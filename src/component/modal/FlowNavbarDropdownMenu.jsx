import React, { useState } from 'react';
import '../../assets/style/FlowNavbarDropdownMenu.css';
import { FiEdit2 } from 'react-icons/fi';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { FaLink, FaFileAlt, FaEye, FaTrashAlt, FaUndoAlt } from 'react-icons/fa';
import { MdPublishedWithChanges } from 'react-icons/md';
import { BsArrowRepeat } from 'react-icons/bs';
import { RiAccountPinCircleLine } from 'react-icons/ri';
import axios from 'axios';

const FlowNavbarDropdownMenu = ({ flowId }) => {

  const handleDuplicate = async () => {
    try {
      await axios.post(`http://localhost:5001/api/flows/duplicate/${flowId}`);
      window.location.reload();
    } catch (error) {
      console.error("Error duplicating flow:", error);
    }
  };

  return (
    <div className="flow-dropdown">
      <ul>
        <li><FiEdit2 /> Rename</li>
        <li onClick={handleDuplicate}><HiOutlineDocumentDuplicate /> Duplicate</li>
        <li><FaLink /> Get Draft Link</li>
        <li><MdPublishedWithChanges /> Get Published Link</li>
        <li><RiAccountPinCircleLine /> Copy to another account</li>

        <li className="disabled"><FaFileAlt /> Get JSON for Messenger Ads <span className="pro-badge">Pro</span></li>
        <li className="disabled"><FaFileAlt /> Get Payload for Messenger Ads <span className="pro-badge">Pro</span></li>

        <li><FaEye /> View Analytics <span className="pro-badge">Pro</span></li>
        <li><BsArrowRepeat /> Flow Versions <span className="pro-badge">Pro</span></li>

        <li className="delete"><FaTrashAlt /> Delete</li>
        <li><FaUndoAlt /> Revert to Published</li>
      </ul>
    </div>
  );
};

export default FlowNavbarDropdownMenu;
