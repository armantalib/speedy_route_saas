/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { course1, course2, course3, course4, course5, fileavatar } from '../../icons/icon'
import { CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Input } from 'reactstrap';
import { ArrowLeft } from 'react-feather';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../config/firebase';
import axios from 'axios';
import { message } from 'antd';

const UpdateBlog = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const { state } = useLocation()
    const blogDetail = state?.blogDetail || null
    const [fileLoading, setFileLoading] = useState(false)
    const [selectedImg, setSelectedImg] = useState(null);
    const [blogImage, setBlogImage] = useState('')
    const [title, setTitle] = useState('')
    const [honeyPots, setHoneyPots] = useState(null)
    const [quizTime, setQuizTime] = useState(null)
    const [caption, setCaption] = useState('')
    const navigate = useNavigate();

    const uploadFoodFile = (courseFile) => {
        setFileLoading(true);
        if (!courseFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${courseFile?.name}`;
        const imageRef = ref(storage, `blogFile/${uniqueFileName}`);
        uploadBytes(imageRef, courseFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setFileLoading(false);
                setBlogImage(url);
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
        if (blogDetail) {
            setSelectedImg(blogDetail?.image)
            setCaption(blogDetail?.caption)
            setTitle(blogDetail?.name)
            setQuizTime(blogDetail?.time)
            setHoneyPots(blogDetail?.honeypot)
        }
    }, [blogDetail])

    const handleUpdate = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        const formData = {
            image: blogImage ? blogImage : selectedImg,
            caption: caption,
            name: title,
            time: quizTime,
            honeypot: honeyPots
        };
        setIsProcessing(true);
        try {
            const res = await axios.put(`${global.BASEURL}api/blog/edit/${blogDetail?._id}`, formData, { headers });
            navigate('/blogs')
            message.success('Blog Updated Successfully')
            setBlogImage('')
            setCaption('')
            setQuizTime('')
            setHoneyPots('')
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
                    <button type='button' onClick={() => { navigate('/blogs') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h4 className='plusJakara_semibold text_black'>Update Blog</h4>
                    <p className="text_secondary plusJakara_regular">Information about your current plan and usages</p>
                </div>
            </div>
            <Form onSubmit={handleUpdate} className="w-full bg_white rounded-3 shadow-md p-4">
                <div className="flex flex-col px-3 mb-3 gap-2">
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
                <Form.Group className='shadow_def px-3 w-full'>
                    <Form.Label className="plusJakara_semibold text_dark">Blog Title</Form.Label>
                    <Form.Control
                        type='text'
                        // required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Enter blog title'
                    />
                </Form.Group>
                <hr style={{ color: '#f4f4f4' }} />
                <div className="d-flex flex-wrap flex-md-nowrap gap-3 px-3 justify-between w-full mb-4">
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">Screen Time</Form.Label>
                        <Form.Control
                            type='number'
                            // required
                            value={quizTime}
                            onChange={(e) => setQuizTime(e.target.value)}
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='In min'
                        />
                    </Form.Group>
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">How much honeypots will students receive?</Form.Label>
                        <Form.Control
                            type='number'
                            // required
                            value={honeyPots}
                            onChange={(e) => setHoneyPots(e.target.value)}
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='Honeypots'
                        />
                    </Form.Group>
                </div>
                <Form.Group className='shadow_def px-3 mb-3'>
                    <Form.Label className="plusJakara_semibold text_dark">Blog Caption</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={4}
                        // required
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Enter Blog caption'
                    />
                </Form.Group>
                <div className="flex justify-content-end my-4 w-100">
                    {!isProcessing ? (
                        <button type='submit' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">Update Blog</span>
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

export default UpdateBlog