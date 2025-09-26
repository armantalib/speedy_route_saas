/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import { course1, course2, course3, course4, course5, fileavatar } from '../../icons/icon'
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Input } from 'reactstrap';
import { ArrowLeft } from 'react-feather';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../config/firebase';
import axios from 'axios';
import { message } from 'antd';

const AddProduct = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [blogImage, setBlogImage] = useState('')
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [docFile, setDocFile] = useState(null)
    const [honeyPots, setHoneyPots] = useState(null)
    const [title, setTitle] = useState('')
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        const formData = {
            url: docFile,
            name: title,
            honeypot: honeyPots,
            user_type: 'parent'
        };
        setIsProcessing(true);
        try {
            const res = await axios.post(`${global.BASEURL}api/product/create`, formData, { headers });
            console.log(res);
            navigate('/digital-products-parent')
            message.success('Product Created Successfully')
        } catch (error) {
            console.log(error);
        } finally {
            setIsProcessing(false);
        }
    };



    return (
        <main className='min-h-screen lg:container py-4 px-4 '>
            <div className="d-flex gap-4 align-items-start w-full">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/digital-products') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h4 className='plusJakara_semibold text_black'>Add Products</h4>
                    <p className="text_secondary plusJakara_regular">Information about your current plan and usages</p>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 d-flex flex-column shadow-md gap-3 p-4">
                <div className="flex flex-col px-3 gap-2">
                    <Form.Label className="plusJakara_semibold text_dark">Upload Document</Form.Label>
                    <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        id="docInput"
                        onChange={handleDocumentChange}
                    />
                </div>
                <Form.Group className='shadow_def px-3 w-full'>
                    <Form.Label className="plusJakara_semibold text_dark">Product Name</Form.Label>
                    <Form.Control
                        type='text'
                        required
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
                        onChange={(e) => setHoneyPots(e.target.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Honeypots'
                    />
                </Form.Group>
                <div className="flex justify-content-end my-4 w-100">
                    {!isProcessing ? (
                        <button type='submit' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">Add Product</span>
                        </button>
                    ) : (
                        <button type='button' disabled={isProcessing} className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
                            <CircularProgress size={18} className='text_white' />
                        </button>
                    )}
                </div>
            </Form>
        </main>
    )
}

export default AddProduct