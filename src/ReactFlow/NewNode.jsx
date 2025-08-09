import { useState, useContext } from 'react';
import { Handle } from '@xyflow/react';
import { ContentContext } from '../Context/ContentContext';
import NodeFLowList from './ContentList/NodeFLowList';
import { CiText } from "react-icons/ci";
import { IoEyeOutline, IoPlay, IoPlayOutline, IoFingerPrintSharp } from "react-icons/io5";
import { RiDeleteBin6Line, RiLink } from "react-icons/ri";
import { GoCopy } from "react-icons/go";
import { IoChatbubbleEllipsesOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaConnectdevelop } from "react-icons/fa";
import '../assets/style/NewNode.css';

const NewNode = ({ id, data, isConnectable, onDelete, onDuplicate, onRenameClick, nodeNumber }) => {
  const { getContentForNode, startNodeId, setStartNodeId, setContentForNode } = useContext(ContentContext);
  const [isHovered, setIsHovered] = useState(false);
  const contentItems = getContentForNode(id);
  const isStartNode = id === startNodeId;
  const quickReplies = contentItems.find(item => item.type === 'quickReply')?.items || [];

  const nodeChannels = JSON.parse(localStorage.getItem('nodeChannels')) || {};
  const channel = nodeChannels[id] || 'omnichannel';

  const getChannelInitial = () => {
    switch (channel) {
      case 'whatsapp': return <IoLogoWhatsapp fontSize={23} color='green' />;
      case 'webchat': return <IoChatbubbleEllipsesOutline fontSize={23} />;
      default: return <FaConnectdevelop fontSize={23} />;
    }
  };

  const handleAddContent = (index, type) => {
    const currentContent = [...getContentForNode(id)];

    if (type === 'View Catalog' || type === 'ViewCatalog' || type === 'WhatsAppFlows') {
      const newButton = {
        type: 'button',
        text: type === 'View Catalog' ? 'Catalog Item' :
          type === 'ViewCatalog' ? 'View Catalog' : 'Button',
        action: 'postback'
      };

      if (!currentContent[index].buttons) {
        currentContent[index].buttons = [];
      }

      currentContent[index].buttons.push(newButton);
      setContentForNode(id, currentContent);
    }
    // For other types that might need additional content
    else {
      const newContent = {
        type: type,
        value: '',
        ...(type === 'Card' || type === 'Crousel' ? { title: '', subtitle: '' } : {})
      };

      currentContent.splice(index + 1, 0, newContent);
      setContentForNode(id, currentContent);
    }
  };

  return (
    <div className='node-box'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {data.isStart && (
        <div className='start-bot'>
          <div className="play-icon">
            <IoPlay />
          </div>
          <span>Start</span>
        </div>
      )}

      <div className='icon-toolbar' style={{
        display: isHovered ? 'flex' : 'none',
        flexDirection: 'row', gap: '8px',
      }}>
        <i className="icon-eye" onClick={(e) => e.stopPropagation()}><IoEyeOutline /></i>
        {!data.isStart && (
          <i className="icon-eye" onClick={(e) => { e.stopPropagation(); setStartNodeId(id); }}>
            <IoPlayOutline />
          </i>
        )}
        <i className="icon-eye" onClick={(e) => e.stopPropagation()}><RiLink /></i>
        <i className="icon-eye" onClick={(e) => e.stopPropagation()}><IoFingerPrintSharp /></i>
        <i className="icon-eye" onClick={(e) => { e.stopPropagation(); onRenameClick(id, data.label); }}><CiText /></i>
        {!data.isStart && (
          <i className="icon-delete" onClick={(e) => { e.stopPropagation(); onDelete(id); }}>
            <RiDeleteBin6Line />
          </i>
        )}
        <i className="icon-eye" onClick={(e) => { e.stopPropagation(); onDuplicate(id) }}><GoCopy /></i>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{
          marginLeft: '5px',
          padding: '2px 6px',
          borderRadius: '50%',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {getChannelInitial()}
        </span>
        <span>Message #{nodeNumber}</span>
      </div>

      {isStartNode ? (
        <div className="start-node-content">
          <div className="first-node-target">
            <div className='custom-continue-text'>Continue</div>
            <Handle
              className='custom-continue-handler'
              type="source"
              id="handle-continue"
              position="right"
              isConnectable={isConnectable}
            />
          </div>
        </div>
      ) : (
        <>
          {contentItems
            .filter(item => item.type !== 'quickReply')
            .map((item, index) => (
              <div key={index} className="node-content-item">
                <NodeFLowList
                  item={item}
                  index={index}
                  nodeId={id}
                  handleAddContent={handleAddContent}
                />
              </div>
            ))}

          {quickReplies.length > 0 && (
            <div className="node-quick-replies">
              {quickReplies.map((reply) => (
                <div key={reply.id} className="node-quick-reply-item">
                  <div className="node-quick-reply-btn">
                    <span>
                      {reply.text}
                    </span>
                    <Handle
                      className='quick-reply-handler'
                      type="source"
                      id={`quick-reply-${reply.id}`}  // Changed ID prefix to avoid confusion
                      position="right"
                      isConnectable={isConnectable}
                      style={{ zIndex: 2 }}  // Ensure quick reply handles are above continue handle
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='dynamic-continue-text'>
            Continue
            <Handle
              className='dynamic-continue-handler'
              type="source"
              id="handle-continue" 
              position="right"
              isConnectable={isConnectable}
              style={{
                zIndex: 1,  
                bottom: quickReplies.length > 0 ? `${quickReplies.length * 30 + 20}px` : '20px'
              }}
            />
          </div>
        </>
      )}

      <Handle
        type="target"
        position="left"
        style={{ opacity: 0, height: '100%', left: '5px' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position="right"
        style={{ opacity: 0, width: '20px', height: '100%', right: '5px' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position="top"
        style={{ opacity: 0, width: '100%', top: '5px' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position="bottom"
        style={{ opacity: 0, width: '100%', bottom: '5px' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default NewNode;