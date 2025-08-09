import React, { useState, useContext } from 'react';
import '../../App.css';
import ContentModal from '../../ReactFlow/ContentList/ContentModal';
import { ContentContext } from '../../Context/ContentContext';
import ModalContentList from '../../ReactFlow/ContentList/ModalContentList';
import { ImCross } from "react-icons/im";
import '../../assets/style/MainModal.css';
import QuickReplyModal from './QuickReplyModal';

const MainModal = ({ nodeData, onClose, isOpen, onUpdate }) => {
  const { id } = nodeData || {};
  const { getContentForNode, setContentForNode } = useContext(ContentContext);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedQuickReplyIndex, setSelectedQuickReplyIndex] = useState(null);
  const [quickReplyModalOpen, setQuickReplyModalOpen] = useState(false);


  const nodeChannels = JSON.parse(localStorage.getItem('nodeChannels')) || {};
  const savedChannel = nodeChannels[id] || 'omnichannel';

  const [selectedMessageType, setSelectedMessageType] = useState(
    savedChannel === 'whatsapp' ? 'WhatsApp' :
      savedChannel === 'webchat' ? 'Webchat' : 'OmniChannel'
  );
  const [channel, setChannel] = useState(savedChannel);

  const contentItems = getContentForNode(id);
  const quickReplyItem = contentItems.find(item => item.type === 'quickReply');
  const quickReplies = quickReplyItem?.items || [];

  if (!isOpen) return null;

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const channelValue = selectedValue.toLowerCase();

    setSelectedMessageType(selectedValue);
    setChannel(channelValue);

    const storedChannels = JSON.parse(localStorage.getItem('nodeChannels')) || {};
    storedChannels[id] = channelValue;
    localStorage.setItem('nodeChannels', JSON.stringify(storedChannels));

    onUpdate({ selectedChannel: channelValue });
  };

  const handleAddContentClick = () => {
    setShowContentModal(true);
  };

  const handleContentSelect = (type) => {
    if (type === 'quickReply') {
      if (!quickReplyItem) {
        setContentForNode(id, [...contentItems, { type: 'quickReply', items: [] }]);
      }
    } else {
      setContentForNode(id, [...contentItems, { type, value: '' }]);
    }
    setShowContentModal(false);
  };

  // const handleInputChange = (index, value) => {
  //   const updatedItems = [...contentItems];
  //   updatedItems[index].value = value;
  //   setContentForNode(id, updatedItems);
  // };

  const handleInputChange = (index, value) => {
    const updatedItems = [...contentItems];

    if (typeof value === 'object' && !(value instanceof File)) {
      // For object updates (like buttons), merge with existing item
      updatedItems[index] = { ...updatedItems[index], ...value };
    } else {
      // For simple values, update just the value property
      updatedItems[index].value = value;
    }

    setContentForNode(id, updatedItems);
  };
  
  const handleRemoveContent = (index) => {
    const updatedItems = contentItems.filter((_, i) => i !== index);
    setContentForNode(id, updatedItems);
  };

  const handleAddQuickReply = () => {
    const newReply = {
      type: 'button',
      text: `Quick Reply ${quickReplies.length + 1}`,
      id: `qr-${Date.now()}`
    };

    if (quickReplyItem) {
      const updatedItems = contentItems.map(item =>
        item.type === 'quickReply'
          ? { ...item, items: [...item.items, newReply] }
          : item
      );
      setContentForNode(id, updatedItems);
    } else {
      setContentForNode(id, [...contentItems, { type: 'quickReply', items: [newReply] }]);
    }
  };

  const handleRemoveQuickReply = (index) => {
    const updatedItems = contentItems.map(item =>
      item.type === 'quickReply'
        ? { ...item, items: item.items.filter((_, i) => i !== index) }
        : item
    );
    setContentForNode(id, updatedItems);
  };

  const handleQuickReplyClick = (index) => {
    setSelectedQuickReplyIndex(index);
    setQuickReplyModalOpen(true);
  };

  const handleQuickReplySave = (updatedText) => {
    const updatedItems = contentItems.map(item => {
      if (item.type === 'quickReply') {
        const updatedQuickReplies = [...item.items];
        updatedQuickReplies[selectedQuickReplyIndex].text = updatedText;
        return { ...item, items: updatedQuickReplies };
      }
      return item;
    });
    setContentForNode(id, updatedItems);
  };

  const handleQuickReplyDelete = () => {
    handleRemoveQuickReply(selectedQuickReplyIndex);
    setQuickReplyModalOpen(false);
  };


  return (
    <div className='modal-main'>
      <div className="modal-header align-center">
        <h3>{nodeData.label}</h3>
        <button onClick={onClose}>
          <ImCross className='remove-modal-item-icon' />
        </button>
      </div>

      <div className="msg-type">
        <p>Message Type</p>
        <select value={selectedMessageType} onChange={handleSelectChange}>
          <option value="OmniChannel">OmniChannel</option>
          <option value="Webchat">Webchat</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
      </div>
      <div className="hr"></div>

      <div>
        {contentItems
          .filter(item => item.type !== 'quickReply')
          .map((item, index) => (
            <div className='modal-item' key={index}>
              <ModalContentList
                item={item}
                index={index}
                handleInputChange={handleInputChange}
              />
              <button
                className='remove-modal-item-btn'
                onClick={() => handleRemoveContent(index)}
              >
                X
              </button>
            </div>
          ))}
      </div>

      <div className="quick-reply-section">
        {/* Added Quick Replies */}
        {quickReplies.length > 0 && (
          <div className="added-quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                className="quick-reply-item"
                key={index}
                onClick={() => handleQuickReplyClick(index)}
              >
                {reply.text}
              </button>
            ))}
          </div>
        )}
        <button
          className="default-quick-reply-btn"
          onClick={handleAddQuickReply}
        >
          + Quick Reply
        </button>
      </div>


      <div className="add-content">
        <button onClick={handleAddContentClick}>+ Add Content</button>
      </div>

      {showContentModal && (
        <ContentModal
          onSelect={handleContentSelect}
          onClose={() => setShowContentModal(false)}
          type={selectedMessageType}
        />
      )}
      {quickReplyModalOpen && (
        <QuickReplyModal
          isOpen={quickReplyModalOpen}
          replyText={quickReplies[selectedQuickReplyIndex]?.text}
          onClose={() => setQuickReplyModalOpen(false)}
          onSave={handleQuickReplySave}
          onDelete={handleQuickReplyDelete}
        />
      )}

    </div>
  );
};

export default MainModal;