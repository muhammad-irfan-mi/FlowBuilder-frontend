// components/RenameModal.jsx
import React from 'react';
import '../../assets/style/RenameModal.css';

const RenameModal = ({ isOpen, onClose, onSave, nodeLabel, setNodeLabel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Rename</h3>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            className="modal-input"
          />
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-cancel">Cancel</button>
          <button onClick={onSave} className="modal-save">Save</button>
        </div>
      </div>
    </div>
  );
};

export default RenameModal;
