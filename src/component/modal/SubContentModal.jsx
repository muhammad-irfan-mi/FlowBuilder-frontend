import React, { useContext, useEffect } from 'react';
import { RiInbox2Line } from "react-icons/ri";
import { TbUserEdit } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import { GoDatabase } from "react-icons/go";
import { TfiLayersAlt } from "react-icons/tfi";
import { TbGraph } from "react-icons/tb";
import { FaSms } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { CgToolbox } from "react-icons/cg";
import { RxSpeakerLoud } from "react-icons/rx";
import { FaRegFileAlt } from "react-icons/fa";
import { ContentContext } from '../../Context/ContentContext';

const SubContentModal = ({ label, onSelect }) => {

    const handleContentSelect = (type) => {
        console.log(`Selected type: ${type}`);
        onSelect(type);
    };

    const getContent = () => {
        switch (label) {
            case 'File':
                return [
                    { icon: <RxSpeakerLoud />, text: 'Audio', type: 'Audio' },
                    { icon: <FaRegFileAlt />, text: 'Others', type: 'Others' },
                ];
            case 'Actions':
                return [
                    { icon: <RiInbox2Line />, text: 'Inbox', type: 'Inbox' },
                    { icon: <TbUserEdit />, text: 'Add Tag', type: 'AddTag' },
                    { icon: <TbUserEdit />, text: 'Remove Tag', type: 'RemoveTag' },
                    { icon: <IoIosNotificationsOutline />, text: 'Notify Admins', type: 'NotifyAdmins', pro: true },
                    { icon: <GoDatabase />, text: 'Set Custom Field', type: 'SetCustomField' },
                    { icon: <GoDatabase />, text: 'Clear Custom Field', type: 'ClearCustomField' },
                    { icon: <TfiLayersAlt />, text: 'Pipelines', type: 'Pipelines', pro: true },
                    { icon: <TbGraph />, text: 'Log Custom Events', type: 'LogCustomEvents', pro: true },
                    { icon: <FaSms />, text: 'SMS', type: 'SMS' },
                    { icon: <BsLightningCharge />, text: 'Subscribe to receive broadcasts', type: 'SubscribeBroadcast' },
                    { icon: <BsLightningCharge />, text: 'Unsubscribe from all broadcast', type: 'UnsubscribeBroadcast' },
                    { icon: <FiUserX />, text: 'Delete Contact', type: 'DeleteContact', pro: true },
                    { icon: <HiOutlineCodeBracket />, text: 'External API Request', type: 'ExternalAPI' },
                    { icon: <MdOutlineCalendarMonth />, text: 'Appointment Scheduling', type: 'AppointmentScheduling', pro: true },
                    { icon: <BsLightningCharge />, text: 'Trigger', type: 'Trigger' },
                    { icon: <BsLightningCharge />, text: 'More Options', type: 'MoreOptions' },
                    { icon: <CgToolbox />, text: 'Tools', type: 'Tools' },
                ];
            case 'WhatsApp':
                return [
                    { text: 'Template Message', type: 'TemplateMessage', pro: true },
                    { text: 'Options List', type: 'OptionsList' },
                    { text: 'WhatsApp Flows', type: 'WhatsAppFlows' },
                    { text: 'View catalog', type: 'ViewCatalog' },
                    { text: 'Send Products', type: 'Send Products' },
                    { text: 'Location', type: 'Location' },
                ];
            default:
                return [];
        }
    };

    return (
        <div
            style={{
                width: label === 'Actions' ? '320px' : '250px',
                marginLeft: '251px',
                backgroundColor: '#fff',
                boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
                padding: '10px 0',
                borderRadius: '4px',
                position: 'absolute',
                top: label === 'WhatsApp' ? '350px' : label === 'Actions' ? '75px' : '200px',
                zIndex: 1000,
            }}
        >
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '500px', overflowY: 'auto' }}>
                {getContent().map((item, idx) => (
                    <li
                        key={idx}
                        style={{
                            padding: '8px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            cursor: 'pointer',
                            ':hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                        onClick={() => handleContentSelect(item.type)}
                    >
                        {item.icon && <span style={{ marginRight: '10px' }}>{item.icon}</span>}
                        {item.text}
                        {item.pro && (
                            <span style={{ marginLeft: 'auto', color: 'red', fontSize: '10px', fontWeight: 'bold' }}>Pro</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubContentModal;