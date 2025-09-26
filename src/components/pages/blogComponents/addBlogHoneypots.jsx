/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Select } from 'antd';
import { ArrowLeft } from 'react-feather';

const AddBlogHoneypots = () => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [addQuestion, setaddQuestion] = useState(null)
    const navigate = useNavigate();

    const data = [
        { title: 'Blog 1' },
        { title: 'Blog 2' },
        { title: 'Blog 3' },
        { title: 'Blog 1' },
        { title: 'Blog 4' },
        { title: 'Blog 1' },
    ]

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('total_questions', addQuestion)
        navigate('/create-quiz/add-question')
    }

    return (
        <main className='min-h-screen lg:container py-4 px-4'>
            <div className="d-flex gap-4 align-items-start w-full">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/blog-setting') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h4 className='plusJakara_semibold text_black'>Create Blog Hopeypots</h4>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md p-4">
                <Form.Group className='shadow_def mb-4'>
                    <Form.Label className="plusJakara_semibold text_dark">Choose Blog</Form.Label>
                    <Select
                        showSearch
                        style={{
                            width: '100%',
                        }}
                        size='large'
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder="Select Blog"
                        allowClear
                    >
                        {data.map((item, i) => (
                            <Select.Option key={i} value={i}>
                                {item?.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Group>
                <hr style={{ color: '#f4f4f4' }} />
                <div className="d-flex flex-wrap flex-md-nowrap gap-3 justify-between w-full mb-4">
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">Screen Time</Form.Label>
                        <Form.Control
                            type='number'
                            required
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='In min'
                        />
                    </Form.Group>
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">How much honeypots will students receive?</Form.Label>
                        <Form.Control
                            type='number'
                            required
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='Honeypots'
                        />
                    </Form.Group>
                </div>
                <div className="flex justify-end my-4 w-full">
                    {!isProcessing ? (
                        <button type='submit' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">Add Now</span>
                        </button>
                    ) : (
                        <button type='button' className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
                            <CircularProgress size={18} className='text_white' />
                        </button>
                    )}
                </div>
            </Form>
        </main>
    )
}

export default AddBlogHoneypots