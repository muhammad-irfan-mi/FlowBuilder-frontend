import { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [nodeContents, setNodeContents] = useState({});
  const [currentFlowId, setCurrentFlowId] = useState(null);

  const saveContentToServer = useCallback(async (nodeId, content) => {
    if (!currentFlowId) return;

    try {
      await axios.post(`http://localhost:5001/api/save-content/${currentFlowId}`, {
        nodeId,
        content
      });
    } catch (error) {
      console.error('Error saving content:', error);
    }
  }, [currentFlowId]);

  const setContentForNode = useCallback((nodeId, contentItems) => {
    const processedContent = contentItems.map(item => {
      const baseItem = {
        ...item,
        buttons: item.buttons || []
      };
      if (item.value instanceof File) {
        return {
          ...baseItem,
          // ...item,
          value: {
            name: item.value.name,
            type: item.value.type,
            size: item.value.size,
            lastModified: item.value.lastModified,
            isFile: true
          }
        };
      }
      return baseItem;
    });

    setNodeContents(prev => ({
      ...prev,
      [nodeId]: processedContent
    }));

    saveContentToServer(nodeId, processedContent);
  }, [saveContentToServer]);

  const getContentForNode = (nodeId) => {
    return nodeContents[nodeId] || [];
  };

  return (
    <ContentContext.Provider value={{
      getContentForNode,
      setContentForNode,
      currentFlowId,
      setCurrentFlowId,
      nodeContents
    }}>
      {children}
    </ContentContext.Provider>
  );
};