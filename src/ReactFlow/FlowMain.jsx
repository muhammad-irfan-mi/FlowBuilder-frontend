import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, MiniMap, Controls, Background, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { IoIosChatbubbles } from 'react-icons/io';
import MainModal from '../component/modal/MainModal';
import ChatModal from '../component/modal/ChatModal';
import { ContentContext } from '../Context/ContentContext';
import NewNode from './NewNode';
import Navbar from '../component/Navbar';
import { nanoid } from 'nanoid';
import RenameModal from '../component/modal/RenameModal';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const FlowMain = () => {
  const location = useLocation();
  const flowId = location.state?.flowId;
  const { getContentForNode, setContentForNode, setCurrentFlowId } = useContext(ContentContext);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredEdgeId, setHoveredEdgeId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameNodeId, setRenameNodeId] = useState(null);
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeNumbers, setNodeNumbers] = useState({});

  useEffect(() => {
    const numbers = {};
    let counter = 1;

    const sortedNodes = [...nodes].sort((a, b) => {
      return a.position.x - b.position.x;
    });

    sortedNodes.forEach(node => {
      numbers[node.id] = counter++;
    });

    setNodeNumbers(numbers);
  }, [nodes]);

  useEffect(() => {
    if (flowId) {
      setCurrentFlowId(flowId);
    }
  }, [flowId, setCurrentFlowId]);

  const loadNodesFromDB = async () => {
    if (!flowId) return [];

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/nodes/${flowId}`);
      return response.data;
    } catch (error) {
      console.error('Error loading nodes:', error);
      return [];
    }
  };

  const saveNodeToDB = async (node) => {
    if (!flowId) return;

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/nodes/${flowId}`, {
        nodeId: node.id,
        channel: node.data.channel || 'omnichannel',
        label: node.data.label,
        position: node.position,
        type: node.type
      });
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  const updateNodeInDB = async (nodeId, updates) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/nodes/${nodeId}`, {
        ...updates,
        flowId
      });
    } catch (error) {
      console.error('Error updating node:', error);
    }
  };

  const deleteNodeFromDB = async (nodeId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/nodes/${nodeId}`);
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  const loadFlow = async () => {
    try {
      if (flowId) {
        // Load flow data (nodes, edges, content)
        const flowResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/flow-data/${flowId}`);
        const { flowData } = flowResponse.data;

        // Load node-specific data (channels, isStart)
        const dbNodes = await loadNodesFromDB();

        if (dbNodes.length > 0 || (flowData && flowData.nodes)) {
          const nodesToSet = flowData?.nodes || [];

          // Merge with DB node data
          const mergedNodes = nodesToSet.map(node => {
            const dbNode = dbNodes.find(n => n.nodeId === node.id) || {};
            return {
              ...node,
              data: {
                ...node.data,
                channel: dbNode.channel || 'omnichannel',
                isStart: dbNode.isStart || false
              }
            };
          });

          const edgesToSet = flowData?.edges || [];

          setNodes(mergedNodes);
          setEdges(edgesToSet);

          // Load node contents
          if (flowData?.nodeContents) {
            Object.entries(flowData.nodeContents).forEach(([nodeId, content]) => {
              setContentForNode(nodeId, content);
            });
          }
        } else {
          // Create initial node if no nodes exist
          const initialNodeId = new Date().getTime().toString();
          const initialNode = {
            id: initialNodeId,
            type: 'custom',
            position: { x: 400, y: 100 },
            data: {
              label: 'Message #1',
              channel: 'omnichannel',
              isStart: true
            }
          };

          setNodes([initialNode]);
          setEdges([]);

          // Save initial node to DB
          await saveNodeToDB(initialNode);
        }
      } else {
        console.warn("No flowId provided - showing empty flow");
        setNodes([]);
        setEdges([]);
      }
    } catch (error) {
      console.error('Error loading flow:', error);
      setNodes([]);
      setEdges([]);
    }
  };

  useEffect(() => {
    loadFlow();
  }, [flowId]);

  const saveFlowData = async (nodesToSave, edgesToSave) => {
    if (!flowId) return;

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/flow-data/${flowId}`, {
        flowData: {
          nodes: nodesToSave,
          edges: edgesToSave,
          nodeContents: nodesToSave.reduce((acc, node) => {
            acc[node.id] = getContentForNode(node.id);
            return acc;
          }, {})
        }
      });
    } catch (error) {
      console.error('Error saving flow data:', error);
    }
  };

  const onConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;
      updateHistory(nodes, addEdge(params, edges));
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, nodes, edges]
  );

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    async (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');
      if (targetIsPane) {
        const dropPosition = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        const newNodeId = new Date().getTime().toString();
        const newNode = {
          id: newNodeId,
          type: 'custom',
          position: dropPosition,
          data: {
            label: `Message #${Object.keys(nodeNumbers).length + 1}`,
            channel: 'omnichannel',
            isStart: false
          },
        };

        const newEdge = {
          id: `edge-${connectingNodeId.current}-${newNodeId}`,
          source: connectingNodeId.current,
          target: newNodeId,
        };

        updateHistory(nodes.concat(newNode), edges);
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));

        // Save new node to DB
        await saveNodeToDB(newNode);
      }
    },
    [screenToFlowPosition, setNodes, nodes, edges]
  );

  const onDeleteNode = useCallback(
    async (nodeId) => {
      const updatedNodes = nodes.filter((node) => node.id !== nodeId);
      const updatedEdges = edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      updateHistory(updatedNodes, updatedEdges);
      setNodes(updatedNodes);
      setEdges(updatedEdges);

      // Delete node from DB
      await deleteNodeFromDB(nodeId);
    },
    [setNodes, setEdges, nodes, edges]
  );

  const onDuplicate = useCallback(
    async (nodeId) => {
      const newId = new Date().getTime().toString();
      const originalContent = getContentForNode(nodeId);
      const originalNode = nodes.find(n => n.id === nodeId);

      if (!originalNode) return;

      const newNode = {
        ...originalNode,
        id: newId,
        position: {
          x: originalNode.position.x + 50,
          y: originalNode.position.y + 50,
        },
        data: {
          ...originalNode.data,
          label: `${originalNode.data.label} (Copy)`,
          isStart: false // Duplicated nodes should never be start nodes
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      setContentForNode(newId, originalContent);
      updateHistory(newNodes, edges);

      // Save duplicated node to DB
      await saveNodeToDB(newNode);
    },
    [nodes, setNodes, getContentForNode, setContentForNode, edges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeData({
      ...node.data,
      id: node.id,
      selectedChannel: node.data.channel || 'omnichannel',
      isStart: node.data.isStart || false
    });
    setModalOpen(true);
  }, []);

  const handlePublish = async () => {
    const nodeContents = {};
    nodes.forEach((node) => {
      nodeContents[node.id] = getContentForNode(node.id);
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/publish-flow/${flowId}`, {
        nodes,
        edges,
        nodeContents
      });

      console.log('Published flow with content:', response.data);
      alert(`Flowchart published successfully with all content!`);
    } catch (error) {
      console.error('Error publishing flow:', error);
      alert('Failed to publish flowchart');
    }
  };

  const updateHistory = (newNodes, newEdges) => {
    undoStack.current.push({ nodes: [...nodes], edges: [...edges] });
    redoStack.current = [];
    saveFlowData(newNodes, newEdges);
  };

  const handleUndo = () => {
    if (undoStack.current.length === 0) return;
    const lastState = undoStack.current.pop();
    redoStack.current.push({ nodes: [...nodes], edges: [...edges] });
    setNodes(lastState.nodes);
    setEdges(lastState.edges);
  };

  const handleRedo = () => {
    if (redoStack.current.length === 0) return;
    const nextState = redoStack.current.pop();
    undoStack.current.push({ nodes: [...nodes], edges: [...edges] });
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  };

  const handleRenameClick = (id, currentLabel) => {
    setRenameNodeId(id);
    setNodeLabel(currentLabel);
    setShowRenameModal(true);
  };

  const handleModalUpdate = async (newData) => {
    const updatedNodes = nodes.map((node) =>
      node.id === selectedNodeData.id
        ? {
          ...node,
          data: {
            ...node.data,
            ...newData,
            isStart: newData.isStart ? true : node.data.isStart
          }
        }
        : {
          ...node,
          data: {
            ...node.data,
            isStart: newData.isStart ? false : node.data.isStart
          }
        }
    );

    setNodes(updatedNodes);
    updateHistory(updatedNodes, edges);

    // Update node in DB
    await updateNodeInDB(selectedNodeData.id, {
      channel: newData.selectedChannel || 'omnichannel',
      label: newData.label || selectedNodeData.label,
      isStart: newData.isStart || false
    });

    if (newData.isStart) {
      // If this node is now the start node, update all other nodes to isStart=false
      const otherNodes = nodes.filter(n => n.id !== selectedNodeData.id);
      await Promise.all(otherNodes.map(node =>
        updateNodeInDB(node.id, { isStart: false })
      ));
    }
  };

  const nodeTypes = useMemo(() => ({
    custom: (props) => (
      <NewNode
        {...props}
        nodeNumber={nodeNumbers[props.id] || 0}
        onDelete={onDeleteNode}
        onDuplicate={onDuplicate}
        onRenameClick={handleRenameClick}
      />
    ),
  }), [onDeleteNode, onDuplicate, handleRenameClick]);

  return (
    <div style={{ height: '100vh' }}>
      <Navbar
        onPublish={handlePublish}
        onUndo={handleUndo}
        onRedo={handleRedo}
        flowId={flowId}
      />
      <ReactFlowProvider>
        <div style={{ height: '89%', width: '100%' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges.map((edge) => ({
              ...edge,
              style: {
                stroke: edge.id === hoveredEdgeId ? 'red' : '',
                strokeWidth: 3,
              },
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeMouseEnter={(_, edge) => setHoveredEdgeId(edge.id)}
            onEdgeMouseLeave={() => setHoveredEdgeId(null)}
            onEdgeClick={(_, edge) => {
              if (edge.id === hoveredEdgeId) {
                const updatedEdges = edges.filter((e) => e.id !== edge.id);
                setEdges(updatedEdges);
                updateHistory(nodes, updatedEdges);
                setHoveredEdgeId(null);
              }
            }}
            nodeTypes={nodeTypes}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            defaultEdgeOptions={{
              style: { strokeWidth: 2, stroke: '#555' },
              markerEnd: { type: 'arrowclosed' }
            }}
            fitView
          >
            <MiniMap />
            <div className="chat-section">
              <button
                className="chat-btn"
                onClick={() => setChatModalOpen(true)}
              >
                <IoIosChatbubbles className="chat-icon" />
              </button>
            </div>
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>

      {modalOpen && (
        <MainModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          nodeData={selectedNodeData}
          onUpdate={handleModalUpdate}
        />
      )}

      <RenameModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onSave={async () => {
          const updatedNodes = nodes.map((node) =>
            node.id === renameNodeId
              ? { ...node, data: { ...node.data, label: nodeLabel } }
              : node
          );

          setNodes(updatedNodes);
          updateHistory(updatedNodes, edges);
          setShowRenameModal(false);

          // Update node label in DB
          await updateNodeInDB(renameNodeId, { label: nodeLabel });
        }}
        nodeLabel={nodeLabel}
        setNodeLabel={setNodeLabel}
      />

      {chatModalOpen && (
        <ChatModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FlowMain;