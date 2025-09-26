/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { course1, course2, course3, course4, course5, news1 } from '../icons/icon'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Clock, Edit } from 'react-feather'
import { Form, Modal } from 'react-bootstrap'
import { CircularProgress } from '@mui/material'
import { message } from 'antd'
import { dataGet_ } from '../utils/myAxios'

const Quiz = () => {
    const navigate = useNavigate()
    const [selectedItem, setSelectedItem] = useState(null)
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [honeyPots, setHoneyPots] = useState(null)
    const [passingPer, setPassingPer] = useState(null)
    const [quizTime, setQuizTime] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const handleFetchCategory = async () => {
        setIsProcessing(true)

        try {
            // const res = await axios.get(`${global.BASEURL}api/users/dashboard`, { headers });
            let data1 = {
            }
            const endPoint = 'quiz/get/admin'
            const res = await dataGet_(endPoint, data1);
            console.log("R",res.data);
            
            if (res?.data.success) {
                setCategories(res?.data);
            }
        } catch (error) {
            setIsProcessing(false)
            console.log(error);
        } finally {
            setIsProcessing(false)
        }
    };

    useEffect(() => {
        // handleFetchCategory();
    }, []);

    useEffect(() => {
        if (selectedItem) {
            setPassingPer(selectedItem?.passing_per)
            setQuizTime(selectedItem?.time)
            setHoneyPots(selectedItem?.honeypot)
        }
    }, [selectedItem])

    const handleShow = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };
    const handleClose = () => {
        setShowModal(false)
        setHoneyPots(selectedItem?.honeypot)
        setPassingPer(selectedItem?.passing_per)
        setQuizTime(selectedItem?.time)
    }

    const formatTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} mins${minutes > 1 ? 's' : ''}`;
        } else {
            return `${minutes} mins${minutes > 1 ? 's' : ''}`;
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        const formData = {
            honeypot: honeyPots,
            time: quizTime,
            passing_per: passingPer
        };
        setLoading(true);
        
        try {
            const res = await axios.put(`${global.BASEURL}api/quiz/edit/${selectedItem?._id}`, formData, { headers });
            console.log(res);
            message.success('Quiz Updated Successfully')
            handleFetchCategory()
            setShowModal(false)
            setHoneyPots('')
            setPassingPer('')
            setQuizTime('')
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDetail = (item) => {
        navigate('/quiz/quiz-detail', { state: { quizDetail: item } })
    }

    return (
        <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
            <div className="flex justify-between gap-3 items-center w-full">
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_bold text_black'>All Quiz</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                <button onClick={() => { navigate('/quiz/create-quiz') }} style={{ width: '150px',backgroundColor:'#000' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Quiz</button>
            </div>
            {isProcessing ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                <CircularProgress size={24} className='text_dark' />
            </main> :
                !categories || categories.length === 0 ?
                    <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                        <span className="text_secondary plusJakara_medium">No Quiz Found</span>
                    </main> :
                    <div className="flex my-4 w-full displaygrid_3">
                        {categories.map((item, i) => (
                            <div key={i} className="shadow-sm rounded-4 bg_white flex flex-col">
                                <div className="position-relative">
                                    <button onClick={() => handleShow(item)} style={{ right: 0, }} className="position-absolute bg_white p-2">
                                        <Edit size={20} />
                                    </button>
                                    <img onClick={() => handleDetail(item)} src={item?.image} style={{ width: '100%', cursor: 'pointer', maxHeight: "10rem", objectFit: 'cover', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} alt="" />
                                </div>
                                <div onClick={() => handleDetail(item)} style={{ cursor: 'pointer' }} className="flex flex-col gap-1 px-3 py-2">
                                    <h5 className="plusJakara_semibold text_blak">{item.title}</h5>
                                    <span
                                        style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
                                        className="text_dark line-clamp-2 plusJakara_regular">{item?.courses_des}</span>
                                    <div className="d-flex w-100 gap-2 flex-wrap justify-content-between my-2">
                                        <div className="d-flex align-items-center gap-1">
                                            <Clock size={20} className='text_secondary' />
                                            <span className="text_secondary plusJakara_medium">{formatTime(item?.time)}</span>
                                        </div>
                                        <span className="text_primary plusJakara_semibold">{item?.honeypot || 0} Honeypots</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}

            {selectedItem && (
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Body>
                        <Form onSubmit={handleUpdate} className="w-full bg_white d-flex flex-column my-3 gap-3">
                            <Form.Group className='shadow_def w-full'>
                                <Form.Label className="plusJakara_semibold text_dark">Quiz Time</Form.Label>
                                <Form.Control
                                    type='number'
                                    required
                                    value={quizTime}
                                    onChange={(e) => setQuizTime(e?.target?.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Quiz Time (In min)'
                                />
                            </Form.Group>
                            <Form.Group className='shadow_def w-full'>
                                <Form.Label className="plusJakara_semibold text_dark">How much honeypots will students receive?</Form.Label>
                                <Form.Control
                                    type='number'
                                    required
                                    value={honeyPots}
                                    onChange={(e) => setHoneyPots(e?.target?.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Honeypots'
                                />
                            </Form.Group>
                            <Form.Group className='shadow_def w-full'>
                                <Form.Label className="plusJakara_semibold text_dark">What's the Passing percentage for quiz?</Form.Label>
                                <Form.Control
                                    type='number'
                                    required
                                    value={passingPer}
                                    onChange={(e) => setPassingPer(e?.target?.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Percentage (%)'
                                />
                            </Form.Group>
                            <div className="flex justify-content-end w-100">
                                {!loading ? (
                                    <button type='submit'
                                        className="flex justify-center bg_primary py-3 px-2 rounded-3 items-center">
                                        <span className="plusJakara_semibold text_white">Update Quiz</span>
                                    </button>
                                ) : (
                                    <button type='button'
                                        disabled={loading}
                                        className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
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

export default Quiz