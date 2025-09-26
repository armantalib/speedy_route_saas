/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { StyleSheetManager } from 'styled-components';
import { CircularProgress } from '@mui/material';
import { Modal, Form, Button } from 'react-bootstrap';
import { dataGet_, dataPost, dataPut, dataDelete } from '../utils/myAxios'; // Assuming you have dataPost too
import ProductTableFetch from '../DataTable/productTableFetch';
import Switch from 'react-switch';

const VehicleMakeModel = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('make'); // 'make' or 'model'
    const [modalData, setModalData] = useState({ name: '', make: '', type: 'make' });
    const [editId, setEditId] = useState(null);

    const [selectedMakeId, setSelectedMakeId] = useState('');

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await dataGet_('general/admin/make/' + currentPage);
            if (res?.data) {
                setVehicles(res.data.data || []);
                setTotalPages(res.data.count.totalPage || 1);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!modalData.name) {
            alert('Name is required');
            return;
        }

        try {
            if (editId) {
                // Update
                await dataPut(`general/admin/make/update/${editId}`, modalData);
            } else {
                // Create
                const res = await dataPost(`general/admin/make/create`, modalData);

            }
            setShowModal(false);
            setModalData({ name: '', make: '', make: '' });
            setEditId(null);
            fetchVehicles();
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure to delete?')) {
            try {
                await dataDelete(`general/admin/make/${id}`);
                fetchVehicles();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="d-flex gap-2">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                            setModalType(row.type);
                            setModalData({ name: row.name, make: row.make, type: row.type });
                            setEditId(row._id);
                            setShowModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    {row?.type == 'make' ? null :
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(row._id)}
                        >
                            Delete
                        </Button>
                    }
                </div>
            ),
        },
    ];

    useEffect(() => {
        fetchVehicles();
    }, [currentPage]);

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                <div className="flex justify-between gap-3 items-center w-full">
                    <div className="flex flex-col mb-3 w-full">
                        <h2 className="plusJakara_bold text_black">Vehicle Make/Model List</h2>
                        <h6 className="text_secondary plusJakara_regular">
                            Manage your vehicle makes and models
                        </h6>
                    </div>
                    <div className="flex gap-2">
                        <Button
                         style={{
                            backgroundColor: '#4949E8',
                            borderColor: '#4949E8',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap',
                            color: '#fff',
                        }}
                            onClick={() => {
                                setModalType('make');
                                setModalData({ name: '', make: '', type: 'make' });
                                setEditId(null);
                                setShowModal(true);
                            }}
                        >
                            Add Make
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#4949E8',
                                borderColor: '#4949E8',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                                color: '#fff',
                            }}
                            onClick={() => {
                                setModalType('model');
                                setModalData({ name: '', make: selectedMakeId, type: 'model' });
                                setEditId(null);
                                setShowModal(true);
                            }}
                        >
             
                            <span>Add Model</span>
                        </Button>

                    </div>
                </div>

                <div className="my-4">
                    <Form.Group>
                        <Form.Label>Filter by Make</Form.Label>
                        <Form.Select
                            value={selectedMakeId}
                            onChange={(e) => setSelectedMakeId(e.target.value)}
                        >
                            <option value="">-- Select Make --</option>
                            {vehicles
                                .filter(v => v.type === 'make')
                                .map(make => (
                                    <option key={make._id} value={make._id}>
                                        {make.name}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>
                </div>

                {loading ? (
                    <main className="my-5 d-flex w-100 justify-content-center align-items-center">
                        <CircularProgress size={24} className="text_dark" />
                    </main>
                ) : (
                    <ProductTableFetch
                        columns={columns}
                        data={
                            selectedMakeId
                                ? vehicles.filter(v => v.type === 'model' && v.make === selectedMakeId)
                                : vehicles
                        }
                        showFilter={true}
                        totalPage={totalPages}
                        currentPageSend={(val) => setCurrentPage(val)}
                        currentPage={currentPage - 1}
                    />
                )}

                {/* Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editId ? 'Edit' : 'Add'} {modalType === 'make' ? 'Make' : 'Model'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={modalData.name}
                                onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                            />
                        </Form.Group>

                        {modalType === 'model' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Make</Form.Label>
                                <Form.Select
                                    value={modalData.make}
                                    onChange={(e) => setModalData({ ...modalData, make: e.target.value })}
                                >
                                    <option value="">Select Make</option>
                                    {vehicles
                                        .filter(v => v.type === 'make')
                                        .map(make => (
                                            <option key={make._id} value={make._id}>
                                                {make.name}
                                            </option>
                                        ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            {editId ? 'Update' : 'Save'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </main>
        </StyleSheetManager>
    );
};

export default VehicleMakeModel;
