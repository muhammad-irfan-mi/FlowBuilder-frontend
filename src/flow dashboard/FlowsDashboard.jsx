import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/style/FlowsDashboard.css";
import { useNavigate } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";

// const API_URL = `${pro}/api/flows`;

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/flows`;

const FlowsDashboard = () => {
    const [flows, setFlows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentFlowId, setCurrentFlowId] = useState(null);
    const [newFlowName, setNewFlowName] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFlows();
    }, []);

    const fetchFlows = async () => {
        const res = await axios.get(API_URL);
        setFlows(res.data);
    };

    const handleToggle = async (id, field) => {
        const flow = flows.find(f => f._id === id);
        const updatedFlow = { ...flow, [field]: !flow[field] };
        await axios.put(`${API_URL}/${id}`, updatedFlow);
        fetchFlows();
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchFlows();
    };

    const handleAddClick = () => {
        setNewFlowName("");
        setEditMode(false);
        setShowModal(true);
    };

    const handleEditClick = (flow) => {
        setNewFlowName(flow.name);
        setCurrentFlowId(flow._id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setNewFlowName("");
        setCurrentFlowId(null);
        setEditMode(false);
    };

    // const handleModalSubmit = async () => {
    //     if (editMode) {
    //         await axios.put(`${API_URL}/${currentFlowId}`, {
    //             name: newFlowName
    //         });
    //     } else {
    //         const newFlow = {
    //             name: newFlowName,
    //             status: true,
    //             inbox: true,
    //             modified: new Date().toISOString().split("T")[0]
    //         };
    //         await axios.post(API_URL, newFlow);
    //     }
    //     fetchFlows();
    //     handleModalClose();
    // };

    // Modify the handleModalSubmit function
    const handleModalSubmit = async () => {
        try {
            if (editMode) {
                await axios.put(`${API_URL}/${currentFlowId}`, {
                    name: newFlowName
                });
                fetchFlows();
            } else {
                const response = await axios.post(`${API_URL}/`, {
                    name: newFlowName
                });
                fetchFlows();
            }
            handleModalClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create flow');
        }
    };

    const handleRowClick = (flowId) => {
        navigate("/flow", { state: { flowId } });
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Flows</h2>
                <button onClick={handleAddClick} className="dashboard-button">Add</button>
            </div>
            <div className="dashboard-controls">
                <button className="dashboard-button">Trash</button>
                <button className="dashboard-button">New Folder</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Inbox</th>
                        <th>Modified</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {flows.map(flow => (
                        <tr key={flow._id} onClick={() => handleRowClick(flow._id)} className="clickable-row">
                            <td><input type="checkbox" /></td>
                            <td><span className="dot" /> {flow.name}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={flow.status}
                                    onChange={() => handleToggle(flow._id, "status")}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={flow.inbox}
                                    onChange={() => handleToggle(flow._id, "inbox")}
                                />
                            </td>
                            <td>{flow.modified}</td>
                            <td className="dropdown">
                                <button onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === flow._id ? null : flow._id) }} className="dashboard-button"><HiDotsHorizontal size={21} /></button>
                                {dropdownOpen === flow._id && (
                                    <div className="dropdown-menu">
                                        <div onClick={(e) => { e.stopPropagation(); handleEditClick(flow) }}>Edit</div>
                                        <div onClick={(e) => { e.stopPropagation(); handleDelete(flow._id) }}>Delete</div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table >

            {
                showModal && (
                    <div className="add-flow-modal">
                        <div className="add-flow-modal-content">
                            <div className="add-flow-modal-header">
                                <h3>{editMode ? "Edit Flow" : "Add New"}</h3>
                                <span className="close" onClick={handleModalClose}>&times;</span>
                            </div>
                            <div className="add-flow-modal-body">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newFlowName}
                                    onChange={(e) => setNewFlowName(e.target.value)}
                                />
                            </div>
                            <div className="add-flow-modal-footer">
                                <button onClick={handleModalClose} className="dashboard-button">Cancel</button>
                                <button onClick={handleModalSubmit} className="dashboard-button">Save</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default FlowsDashboard;
