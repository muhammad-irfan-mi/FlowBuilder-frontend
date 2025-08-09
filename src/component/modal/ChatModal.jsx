import React from 'react';
import { IoIosSend  } from "react-icons/io";

const ChatModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '390px',
          height: '450px',
          backgroundColor: '#fff',
          padding: '20px',
          boxSizing: 'border-box',
          borderRadius: '8px',
          position: 'relative',
          right: "20px",
          bottom: "44px"
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <h2>Zingtel</h2>
        <div className="chatrace-page">
          <div className="chatrace-link">
            <span>Free Video Course</span>
            <span className='chatrace-pricing'>Pricing</span>
            <span>Learn About WhiteLable</span>
          </div>
        </div>
        <div className="chat-input">
          <input type="text"/> 
          <IoIosSend size={20}/>
        </div>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '10px',
            padding: '5px 10px',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ChatModal;