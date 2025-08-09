import React, { useState } from 'react';
import '../assets/style/FlowNavBar.css'
import '../assets/style/Flow.css'
import { CgRedo, CgUndo } from "react-icons/cg";
import { HiDotsHorizontal } from "react-icons/hi";
import FlowNavbarDropdownMenu from './modal/FlowNavbarDropdownMenu';


const Navbar = ({ onPublish, onUndo, onRedo, flowId }) => {
  const [modal, setModal] = useState(false);

  const handleModalToggle = () => {
    setModal(!modal);
  }

  return (
    <div>
      <nav className="navbar" style={{ padding: "10px 30px", borderBottom: "1px solid #ddd", backgroundColor: "#FFFFFF" }}>
        <a href="#home" className="navbar-brand" style={{ fontSize: '21px', fontWeight: 'bold', color: "#9A9B9C" }}>Flow Editor</a>
        <div className="navbar-right" style={{ float: 'right' }}>

          <div className="undo-redo flex items-center">
            <CgUndo onClick={onUndo} className='undo-redo-icon' />
            <CgRedo onClick={onRedo} className='undo-redo-icon' />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className='publish-flow'
              style={{ backgroundColor: "blue" }}
              onClick={onPublish}
            >
              Publish
            </button>
            <div style={{ backgroundColor: "transparent", border: "2px solid lightGray", borderRadius: '5px', width: '40px', height: '33px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: "blue" }} onClick={handleModalToggle}
            >
              <HiDotsHorizontal />
            </div>
          </div>
        </div>
      </nav>
      {modal && (
        <div style={{ position: 'absolute', top: '10px', right: '20px', zIndex: 1000 }}>
          <FlowNavbarDropdownMenu flowId={flowId}/>
        </div>
      )}
    </div>
  );
};

export default Navbar;
