/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Select, message } from 'antd';
import { Input } from 'reactstrap';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../config/firebase';
import axios from 'axios';
import { fileavatar } from '../../icons/icon';
import { ArrowLeft, Video } from 'react-feather';

const UpdateCourse = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const courseDetail = state?.courseDetail || null;
    const [isProcessing, setIsProcessing] = useState(false)
    const [description, setDescription] = useState('');
    const [categoryStatus, setCategoryStatus] = useState('active')
    const [categories, setCategories] = useState([])
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [docFile, setDocFile] = useState(null)
    const [categoryId, setCategoryId] = useState('')
    const [fileLoading, setFileLoading] = useState(false)
    const [selectedImg, setSelectedImg] = useState(null);
    const [videoLoading, setVideoLoading] = useState(false)
    const [courseImage, setCourseImage] = useState('')
    const [title, setTitle] = useState('')
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);

    console.log(courseDetail);

    useEffect(() => {
        setTitle(courseDetail?.title)
        setDescription(courseDetail?.courses_des)
        setCategoryId(courseDetail?.category?._id)
        setSelectedImg(courseDetail?.image)
        setCategoryStatus(courseDetail?.status)
    }, [courseDetail])

    const handleVideoChange = (event) => {
        setVideoLoading(true);
        const file = event.target.files[0];
        if (file) {
            setSelectedVideo(file);
            const videoBlobUrl = URL.createObjectURL(file);
            setVideoUrl(videoBlobUrl); // Set the URL for the selected video
            uploadVideo(file); // Upload the video
        }
        setVideoLoading(false);
    };

    const uploadVideo = (videoFile) => {
        setVideoLoading(true);
        if (!videoFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${videoFile?.name}`;
        const videoRef = ref(storage, `courseVideo/${uniqueFileName}`);
        uploadBytes(videoRef, videoFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setVideoLoading(false);
                setVideoUrl(url);
            });
        });
    };

    const courseFirebaseImage = (courseContentFile) => {
        setFileLoading(true);
        if (!courseContentFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${courseContentFile?.name}`;
        const imageRef = ref(storage, `courseContentFile/${uniqueFileName}`);
        uploadBytes(imageRef, courseContentFile).then((snapshot) => {
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
            courseFirebaseImage(file);
        }
    };

    const uploadDocument = (documentFile) => {
        if (!documentFile) return;
        const currentDate = new Date();
        const uniqueFileName = `${currentDate.getTime()}_${documentFile?.name}`;
        const documentRef = ref(storage, `courseDocuments/${uniqueFileName}`);
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
        setIsProcessing(true)
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': global.TOKEN
        }
        const formData = {
            category: categoryId ? categoryId : courseDetail?.category?._id,
            image: courseImage ? courseImage : selectedImg,
            title: title,
            status: categoryStatus,
            courses_des: description,
            intro_video: videoUrl ? videoUrl : courseDetail?.intro_video,
            course_doc: docFile ? docFile : courseDetail?.course_doc,
            passing_per: 0,
            time: 0,
            honeypot: 0
        }
        try {
            const res = await axios.post(`${global.BASEURL}api/courses/edit/${courseDetail?._id}`, formData, { headers })
            console.log(res);
            if (res?.data) {
                message.success('Course Updated successfully')
                navigate('/course-content')
            }
        } catch (error) {
            setIsProcessing(false)
            console.log(error);
        }
    }

    const handleFetchCategory = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auto-token': global.TOKEN
        }
        try {
            const res = await axios.get(`${global.BASEURL}api/categories/admin/all`, { headers })
            setCategories(res?.data?.categories)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleFetchCategory()
    }, [])


    return (
        <main className='min-h-screen lg:container py-4 px-4 '>
            <div className="d-flex gap-4 align-items-start w-100">
                <button type='button' onClick={() => { navigate('/course-content') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                    <ArrowLeft className='text_white' />
                </button>
                <div className="flex flex-col mb-3 w-full">
                    <h3 className='plusJakara_semibold text_black'>Update Course Content</h3>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md p-4">
                <div className="flex flex-col mb-3 gap-2">
                    <Form.Group className='shadow_def mb-3'>
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
                <div className="flex flex-col mb-3 gap-2">
                    <Form.Label className="plusJakara_semibold text_dark">Upload Intro Video</Form.Label>
                    <Input
                        type="file"
                        accept="video/*"
                        id="videoInput"
                        onChange={handleVideoChange}
                    />
                    {selectedVideo ? '' :
                        <Link
                            to={courseDetail?.intro_video}
                            target='_blank'
                            style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
                            className="text_dark plusJakara_medium">{courseDetail?.intro_video}
                        </Link>
                    }
                </div>
                <div className="flex flex-col mb-3 gap-2">
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
                            to={courseDetail?.course_doc}
                            target='_blank'
                            style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
                            className="text_dark plusJakara_medium">{courseDetail?.course_doc}
                        </Link>
                    }
                </div>
                <Form.Group className='shadow_def mb-4'>
                    <Form.Label className="plusJakara_semibold text_dark">Choose Course category</Form.Label>
                    <Select
                        showSearch
                        style={{
                            width: '100%',
                        }}
                        size='large'
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder="Select Course category"
                        value={categoryId}
                        allowClear
                        onChange={(value) => setCategoryId(value)}
                    >
                        {categories.map((item, i) => (
                            <Select.Option key={i} value={item?._id}>
                                {item?.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Group>
                <div className="d-flex flex-wrap flex-md-nowrap gap-3 justify-between w-full mb-4">
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">Course Title</Form.Label>
                        <Form.Control
                            type='text'
                            required
                            value={title}
                            onChange={(e) => setTitle(e?.target?.value)}
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='Title'
                        />
                    </Form.Group>
                    {/* <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">How much honeypots will students receive?</Form.Label>
                        <Form.Control
                            type='number'
                            required
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='Honeypots'
                        />
                    </Form.Group> */}
                </div>
                <Form.Group className='shadow_def w-full'>
                    <Form.Label className="plusJakara_semibold text_dark">Course Detail</Form.Label>
                    <Form.Control
                        as='textarea'
                        rows={4}
                        required
                        value={description}
                        onChange={(e) => setDescription(e?.target?.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Course Detail'
                    />
                </Form.Group>
                <div className="d-flex justify-content-end my-4 w-100">
                    {!isProcessing ? (
                        <button
                            type='submit' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">Update Course</span>
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

export default UpdateCourse