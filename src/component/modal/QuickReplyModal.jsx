import React, { useState } from 'react';
import { ImCross } from 'react-icons/im';
import { FaBolt, FaEnvelopeOpenText, FaShareAlt, FaStepForward, FaExternalLinkAlt } from 'react-icons/fa';
import '../../assets/style/QuickReplyModal.css';

const QuickReplyModal = ({ isOpen, replyText, onClose, onSave, onDelete }) => {
    const [label, setLabel] = useState(replyText || '');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(label);
        onClose();
    };

    return (
        <div className="qr-modal-overlay">
            <div className="qr-modal">
                <div className="qr-modal-header">
                    <span>Edit</span>
                    <span className="qr-close-btn" onClick={onClose}><ImCross /></span>
                </div>
                <hr />
                <div className="qr-modal-body">
                    <label className="qr-label">Button Label</label>
                    <input
                        className="qr-input"
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                    />

                    <p className="qr-section-title">When This Button is Pressed</p>
                    <div className="qr-actions">
                        <button><FaEnvelopeOpenText /> Send Message</button>
                        <button><FaBolt /> Perform Action</button>
                        <button><FaShareAlt /> Start Another Flow</button>
                        <button><FaStepForward /> Start Another Step</button>
                        <button><FaExternalLinkAlt /> Start External Step</button>
                    </div>
                </div>
                <hr />
                <div className="qr-modal-footer">
                    <button className="qr-delete" onClick={onDelete}>Delete</button>
                    <button className="qr-save" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default QuickReplyModal;