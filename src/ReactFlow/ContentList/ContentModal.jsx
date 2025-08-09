import React, { useEffect, useRef, useState } from 'react';
import { FaFileAlt, FaImage, FaVideo, FaFile, FaMapMarkerAlt } from 'react-icons/fa';
import { MdTextFields, MdCardMembership, MdPerson, MdFormatListBulleted } from 'react-icons/md';
import { IoChatbubblesOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { BiCarousel } from 'react-icons/bi';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { IoIosArrowForward } from "react-icons/io";
import SubContentModal from '../../component/modal/SubContentModal';

const ContentModal = ({ onClose, onSelect, type }) => {
  const modalRef = useRef();
  const [arrowModalLabel, setArrowModalLabel] = useState(null);

  const handleSubContentSelect = (type) => {
    onSelect(type);
    setArrowModalLabel(null);
  };

  const showArrowFor = ['File', 'Actions', 'WhatsApp'];

  const commonOptions = [
    { label: 'Text', icon: <MdTextFields /> },
    { label: 'Image', icon: <FaImage /> },
    { label: 'Card', icon: <MdCardMembership /> },
    { label: 'Get User Data', icon: <MdPerson /> },
    { label: 'Video', icon: <FaVideo /> },
    { label: 'File', icon: <FaFile /> },
    { label: 'Actions', icon: <MdFormatListBulleted /> },
  ];

  const omniChannelOptions = [
    ...commonOptions,
    { label: 'Crousel', icon: <BiCarousel /> },
    { label: 'GIF', icon: <MdFormatListBulleted /> },
    { label: 'Typing Pro', icon: <FaFileAlt />, pro: true },
    { label: 'WhatsApp', icon: <AiOutlineWhatsApp style={{ color: "green" }} /> },
  ];

  const webchatOptions = [
    ...commonOptions,
    { label: 'Crousel', icon: <BiCarousel /> },
    { label: 'GIF', icon: <MdFormatListBulleted /> },
    { label: 'Typing Pro', icon: <FaFileAlt />, pro: true },
  ];

  const whatsAppOptions = [
    ...commonOptions,
    { label: 'Options List', icon: <MdFormatListBulleted /> },
    { label: 'Template Message Pro', icon: <IoChatbubblesOutline />, pro: true },
    { label: 'Typing Pro', icon: <FaFileAlt />, pro: true },
    { label: 'WhatsApp Flows', icon: <IoLogoWhatsapp /> },
    { label: 'View Catalog', icon: <FaFileAlt /> },
    { label: 'Send Products', icon: <MdFormatListBulleted /> },
    { label: 'Location', icon: <FaMapMarkerAlt /> },
  ];

  const getOptions = () => {
    switch (type) {
      case 'Webchat':
        return webchatOptions;
      case 'WhatsApp':
        return whatsAppOptions;
      case 'OmniChannel':
      default:
        return omniChannelOptions;
    }
  };

  const contentOptions = getOptions();

  const handleClick = (label) => {
    if (showArrowFor.includes(label)) {
      setArrowModalLabel(label);
    } else {
      onSelect(label);
    }
  };

  const handleClose = (e) => {
    onClose();
    e.stopPropagation();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex' }}>
      {/* Main Modal */}
      <div
        className="content-modal"
        ref={modalRef}
        style={{
          position: 'relative',
          top: type === 'WhatsApp' ? '17%' : '3%',
          left: 0,
          width: '250px',
          backgroundColor: '#fff',
          overflowY: 'auto',
          padding: 0,
          borderRight: '1px solid #ddd',
          boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
        }}
      >
        <button onClick={handleClose} style={{padding:'3px', position:'absolute', right:10, top:5}}>close</button>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative', top: '30px' }}>
          {contentOptions.map((option, index) => (
            <li key={index} style={{ padding: '2px 20px' }}>
              <button
                onClick={() => handleClick(option.label)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span style={{ marginRight: '10px', fontSize: '16px' }}>{option.icon}</span>
                <span style={{ flexGrow: 1 }}>{option.label}</span>

                {option.pro && (
                  <span
                    style={{
                      color: 'red',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginLeft: '8px',
                    }}
                  >
                    Pro
                  </span>
                )}

                {showArrowFor.includes(option.label) && (
                  <span style={{ marginLeft: '8px', fontSize: '16px' }}>
                    <IoIosArrowForward />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sub Modal */}
      {arrowModalLabel && (
        <SubContentModal
          label={arrowModalLabel}
          onSelect={handleSubContentSelect}
        />
      )}
    </div>
  );
};

export default ContentModal;
