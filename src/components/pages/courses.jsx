/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { fileavatar } from '../icons/icon'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CircularProgress } from '@mui/material'
import { Form, Modal } from 'react-bootstrap'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../../config/firebase'
import { Input } from 'reactstrap'
import { message } from 'antd'

const Courses = () => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [categoryStatus, setCategoryStatus] = useState('active')
    const [fileLoading, setFileLoading] = useState(false)
    const [selectedImg, setSelectedImg] = useState(null);
    const [courseImage, setCourseImage] = useState('')
    const [title, setTitle] = useState('')

    const uploadFoodFile = (courseFile) => {
        setFileLoading(true);
        if (!courseFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
        const imageRef = ref(storage, `courseFile/${uniqueFileName}`);
        uploadBytes(imageRef, courseFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setFileLoading(false);
                setCourseImage(url);
            });
        });
    };

    const handleCourseFile = (e) => {
        setFileLoading(true);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImg(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImg(null);
        }
        if (file) {
            uploadFoodFile(file);
        }
    };

    useEffect(() => {
        setTitle(selectedItem?.name)
        setSelectedImg(selectedItem?.image)
        setCategoryStatus(selectedItem?.status)
    }, [selectedItem])

    const handleShow = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    console.log(selectedItem);

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            const res = await axios.get(`${global.BASEURL}api/categories/admin/all`, { headers });
            if (res?.data) {
                setCategories(res?.data?.categories);
            }
            // }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        const formData = {
            name: title,
            image: courseImage ? courseImage : selectedImg,
            status: categoryStatus,
        };
        setIsProcessing(true);
        try {
            const res = await axios.post(`${global.BASEURL}api/categories/edit/${selectedItem?._id}`, formData, { headers });
            console.log(res);
            message.success('Category Updated Successfully')
            setShowModal(false)
            fetchData()
            setCategoryStatus('')
            setCourseImage('')
            setTitle('')
        } catch (error) {
            console.log(error);
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
            <div className="flex justify-between gap-3 items-center w-full">
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_bold text_black'>Course Categories</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                <button onClick={() => { navigate('/course-category/add-course') }} style={{ width: '150px' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Category</button>
            </div>
            {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                <CircularProgress size={24} className='text_dark' />
            </main> :
                !categories || categories.length === 0 ?
                    <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                        <span className="text_secondary plusJakara_medium">No Category Found</span>
                    </main> :
                    <div className="flex my-4 w-full displaygrid_2">
                        {categories?.map((item, i) => (
                            <div key={i} style={{ cursor: 'pointer' }} onClick={() => handleShow(item)} className="cursor-pointer shadow-sm rounded-3 bg_white flex flex-col gap-3 items-center justify-center p-5">
                                <div style={{ width: "100px", height: '100px', borderRadius: '50%', backgroundColor: '#D9D9D9' }} className="flex justify-center items-center">
                                    <img src={item.image} style={{ width: '3rem', borderRadius: '50%', height: "3rem", objectFit: 'cover' }} alt="" />
                                </div>
                                <h5 className="plusJakara_semibold text-center text_black">{item?.name}</h5>
                            </div>
                        ))}
                    </div>
            }

            {selectedItem && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body>
                    <Modal.Header closeButton />
                        <Form onSubmit={handleUpdate}>
                            <div className="flex flex-col p-3 gap-2">
                                <Form.Label className="plusJakara_semibold text_dark">Upload File</Form.Label>
                                <div>
                                    <label style={{ cursor: 'pointer' }} htmlFor="fileInput" className="cursor-pointer">
                                        {fileLoading ? <div style={{ width: '120px', height: '100px', }} className='border rounded-3 d-flex justify-content-center align-items-center'>
                                            <CircularProgress size={20} />
                                        </div> :
                                            selectedImg ? (
                                                <img src={selectedImg} alt="Preview" style={{ width: '120px', height: '100px', objectFit: 'cover' }} className="rounded-3 object-cover" />
                                            ) : (
                                                <div style={{ width: '120px', height: '100px' }} className="border rounded-3 flex justify-center items-center">
                                                    <img src={fileavatar} alt="Camera Icon" />
                                                </div>
                                            )}

                                    </label>
                                    <Input
                                        size='large'
                                        type="file"
                                        // required
                                        id="fileInput"
                                        className="visually-hidden"
                                        onChange={handleCourseFile}
                                    />
                                </div>
                            </div>
                            <Form.Group className='shadow_def px-3 mb-3'>
                                <Form.Label className="plusJakara_semibold text_dark">Category Title</Form.Label>
                                <Form.Control
                                    type='text'
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Enter Category Title'
                                />
                            </Form.Group>
                            <Form.Group className='shadow_def px-3 mb-3'>
                                <Form.Label className="plusJakara_semibold text_dark">Category Status</Form.Label>
                                <div className="flex w-100 gap-2 items-center">
                                    <Form.Select
                                        value={categoryStatus}
                                        onChange={(e) => setCategoryStatus(e.target.value)}
                                        className="w-100 rounded-3 text_secondarydark plusJakara_medium bg_white shadow-sm border"
                                        style={{ padding: '10px 20px' }}
                                    >
                                        <option className='plusJakara_medium text_dark' value="active">Active</option>
                                        <option className='plusJakara_medium text_dark' value="deactive">Deactive</option>
                                    </Form.Select>
                                </div>
                            </Form.Group>
                            <div className="flex justify-content-end my-4 w-100">
                                {!isProcessing ? (
                                    <button type='submit' className="flex justify-center bg_primary py-3 px-2 rounded-3 items-center">
                                        <span className="plusJakara_semibold text_white">Update Category</span>
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

        </main>
    )
}

export default Courses