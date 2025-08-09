import React, { useState } from 'react';

// Main Component
function MainComponent() {
  const [returnedContent, setReturnedContent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true); 

  const handleReturnContent = (content) => {
    setReturnedContent([...returnedContent, content]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {isModalOpen && <ParentComponent onReturnContent={handleReturnContent} onClose={handleCloseModal} />}
      
      <div style={{ marginTop: '20px' }}>
        {returnedContent.map((content, index) => (
          <div key={index} style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}

// Parent Component
function ParentComponent({ onReturnContent, onClose }) {
  const handleReturnContent = (item) => {
    const content = (
      <div style={{ width: "83%", minHeight: "140px", backgroundColor: "#F2F4F5", borderRadius: "13px", margin: "20px auto", overflow: "hidden" }}>
        <input
          type="text"
          value={item}
          onChange={() => {}}
          placeholder="Enter text here"
          style={{ backgroundColor: "#E3E6EB", padding: "20px 5px", width: "100%", border: "none", outline: "none" }}
        />
        <button style={{ width: "80%", padding: "11px", margin: "30px", border: "none", borderRadius: "4px", backgroundColor: "#E3E6EB" }}>
          + Add Button
        </button>
      </div>
    );
    onReturnContent(content);
  };

  return (
    <div>
      <WebChatNestedModal onItemClick={handleReturnContent} onClose={onClose} />
    </div>
  );
}

// WebChatNestedModal Component
const WebChatNestedModal = ({ onItemClick, onClose }) => {
  const secondModalOptions = [
    { label: 'Inbox' },
    { label: 'Add Tag' },
    { label: 'Remove Tag' },
    { label: 'Notify Admins'},
    { label: 'Set Custom Field' },
    // Add more options as needed
  ];

  return (
    <div className="second-modal" style={{
      position: 'fixed',
      top: '3%',
      left: '250px',
      width: '250px',
      backgroundColor: '#fff',
      overflowY: 'auto',
      padding: '0px',
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {secondModalOptions.map((option, index) => (
          <li key={index} style={{ padding: '4px 20px', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => onItemClick(option.label)}
              style={{
                width: '100%',
                padding: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
        Close
      </button>
    </div>
  );
};

export default MainComponent;
