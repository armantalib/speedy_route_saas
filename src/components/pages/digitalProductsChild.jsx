/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { course1, course2, course3, course4, course5, testpdf } from '../icons/icon'
import { Link, useNavigate } from 'react-router-dom'
import { StyleSheetManager } from 'styled-components';
import ProductTable from '../DataTable/productTable';
import { dataTable } from '../DataTable/productsData';
import { Edit, Trash2 } from 'react-feather';
import axios from 'axios';
import { Form, Modal } from 'react-bootstrap';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { message } from 'antd';
import { CircularProgress } from '@mui/material';
import { Input } from 'reactstrap';

const DigitalProductsChild = () => {
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [categories, setCategories] = useState([])
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [docFile, setDocFile] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [honeyPots, setHoneyPots] = useState(null)
    const [title, setTitle] = useState('')

    const uploadDocument = (documentFile) => {
        if (!documentFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${documentFile?.name}`;
        const documentRef = ref(storage, `productDocument/${uniqueFileName}`);
        uploadBytes(documentRef, documentFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                console.log('Uploaded document URL:', url);
                setDocFile(url)
            });
        });
    };

    const handleDocumentChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedDoc(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedDoc(null);
        }
        if (file) {
            uploadDocument(file);
        }
    };

    useEffect(() => {
        if (selectedItem) {
            setSelectedDoc(selectedDoc?.url)
            setHoneyPots(selectedItem?.honeypot)
            setTitle(selectedItem?.name)
        }
    }, [selectedItem])

    const handleShow = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false)
    }

    const data = [
        {
            name: 'File',
            sortable: true,
            cell: (row) => {
                return <a href={row?.url} target='_blank' style={{ textDecoration: 'none' }} className="flex flex-col gap-1">
                    <img className='d-none' src={row?.url} alt="" />
                    <button className="text_dark plusJakara_semibold">{row?.name ? row?.name : 'Click to view'}</button>
                </a>
            }
        },
        {
            name: 'HoneyPots',
            sortable: true,
            selector: (row) => row?.honeypot
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1'>
                        <button onClick={() => handleShow(row)} style={{ backgroundColor: '#06d6a0' }} className="blex justify-center inter_medium text-xs text_white rounded-3 p-2 items-center"><Edit size={16} /></button>
                        {/* <button style={{ backgroundColor: '#ff6f61' }} className="flex justify-center inter_medium text-xs text_white rounded-3 p-2 items-center"><Trash2 size={16} /></button> */}
                    </div>
                )
            }
        }
    ];

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        try {
            let allProducts = [];
            for (let page = 1; page <= totalPages; page++) {
                const res = await axios.get(`${global.BASEURL}api/product/admin/${page}/child`, { headers });

                if (res?.data) {
                    allProducts = allProducts.concat(res?.data?.products);
                    setTotalPages(res?.data?.count?.totalPage);
                }
            }
            setCategories(allProducts);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true)
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': global.TOKEN
        }
        const formData = {
            name: title,
            honeypot: honeyPots,
            url: docFile ? docFile : selectedItem?.url,
            user_type: 'child'
        }
        try {
            const res = await axios.put(`${global.BASEURL}api/product/edit/${selectedItem?._id}`, formData, { headers })
            console.log(res);
            if (res?.data) {
                message.success('Product Updated successfully')
                // navigate('/digital-products-child')
                setShowModal(false)
                fetchData()
            }
        } catch (error) {
            setIsProcessing(false)
            console.log(error);
        } finally {
            setIsProcessing(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, [totalPages]);


    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
                <div className="flex justify-between flex-wrap gap-3 items-center w-full">
                    <div className="flex flex-col mb-3">
                        <h2 className='plusJakara_bold text_black'>Child Side Digital Products</h2>
                        <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                    </div>
                    <button onClick={() => { navigate('/digital-products-child/add-product') }} style={{ minWidth: '150px' }} className="bg_primary py-3 rounded-3 text_white plusJakara_medium">Add New Product</button>
                </div>
                {isProcessing ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !categories || categories.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Product Found</span>
                        </main> :
                        <div className="my-4 w-full">
                            <ProductTable columns={data} data={categories} />
                        </div>
                }
            </main>

            {selectedItem && (
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit} className="w-full bg_white d-flex flex-column my-3 gap-3">
                            <div className="flex flex-col mb-3 gap-2 px-3">
                                <Form.Label className="plusJakara_semibold text_dark">Upload Document</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        id="docInput"
                                        onChange={handleDocumentChange}
                                    />
                                </div>
                                {selectedDoc ? '' :
                                    <Link
                                        to={selectedItem?.url}
                                        target='_blank'
                                        style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
                                        className="text_dark plusJakara_medium">{selectedItem?.url}
                                    </Link>
                                }
                            </div>
                            <Form.Group className='shadow_def px-3 w-full'>
                                <Form.Label className="plusJakara_semibold text_dark">Product Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Enter product name'
                                />
                            </Form.Group>
                            <Form.Group className='shadow_def px-3 w-full'>
                                <Form.Label className="plusJakara_semibold text_dark">How much honeypots will Product Unlock</Form.Label>
                                <Form.Control
                                    type='number'
                                    required
                                    value={honeyPots}
                                    onChange={(e) => setHoneyPots(e.target.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Honeypots'
                                />
                            </Form.Group>
                            <div className="flex justify-content-end my-4 w-100">
                                {!isProcessing ? (
                                    <button type='submit' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                                        <span className="plusJakara_semibold text_white">Update Product</span>
                                    </button>
                                ) : (
                                    <button type='button' disabled={isProcessing} className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
                                        <CircularProgress size={18} className='text_white' />
                                    </button>
                                )}
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}

        </StyleSheetManager>
    )
}

export default DigitalProductsChild