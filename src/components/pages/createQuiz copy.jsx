/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Select, message } from 'antd';
import axios from 'axios';
import { ArrowLeft } from 'react-feather';

const CreateQuiz = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [addQuestion, setAddQuestion] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [courseCategories, setCourseCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [honeyPots, setHoneyPots] = useState(null)
    const [quizTime, setQuizTime] = useState(null)
    const [passingPer, setPassingPer] = useState(null)
    const [shouldFetchData, setShouldFetchData] = useState(false);
    const navigate = useNavigate();

    const handleFetchCategory = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': global.TOKEN
        };
        try {
            const res = await axios.get(`${global.BASEURL}api/categories/admin/all`, { headers });
            setCategories(res?.data?.categories);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        try {
            let allCourses = [];
            for (let page = 1; page <= totalPages; page++) {
                const res = await axios.get(`${global.BASEURL}api/courses/admin/${categoryId}/${page}`, { headers });

                if (res?.data) {
                    console.log(res?.data, 'sdr');
                    allCourses = allCourses.concat(res?.data?.courses);
                    setTotalPages(res?.data?.count?.totalPage);
                }
            }
            setCourseCategories(allCourses);
        } catch (error) {
            console.log(error);
        } finally {

        }
    };

    const handleCategoryChange = (value) => {
        setCategoryId(value);
        setSelectedCourse(null);
        setTotalPages(1);
        setShouldFetchData(true);
    };

    const handleCourseChange = (value) => {
        setSelectedCourse(value);
    };

    useEffect(() => {
        handleFetchCategory();
    }, []);

    useEffect(() => {
        if (shouldFetchData) {
            fetchData();
            setShouldFetchData(false);
        }
    }, [shouldFetchData, categoryId, totalPages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCourse)
            return message.error('Please Select your Course')

        const formData = {
            courseId: selectedCourse,
            quizTime: quizTime,
            honeypots: honeyPots,
            passingper: passingPer,
            addQuestion: addQuestion
        }
        e.preventDefault();
        navigate('/quiz/create-quiz/add-question', { state: { formData: formData } });
    };

    return (
        <main className='min-h-screen lg:container py-4 px-4 '>
            <div className="d-flex gap-4 align-items-start w-full">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/quiz') }} style={{backgroundColor:'#000'}} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_semibold text_black'>Create Quiz</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md p-4">
                <Form.Group className='shadow_def mb-4'>
                    <Form.Label className="plusJakara_semibold text_dark">Choose Course Category</Form.Label>
                    <Select
                        showSearch
                        style={{
                            width: '100%',
                        }}
                        size='large'
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder="Select Course Category"
                        // value={categoryId}
                        allowClear
                        onChange={handleCategoryChange}
                    >
                        {categories.map((item, i) => (
                            <Select.Option key={i} value={item?._id}>
                                {item?.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Group>
                {/* {courseCategories.length > 0 && ( */}
                <Form.Group className='shadow_def mb-4'>
                    <Form.Label className="plusJakara_semibold text_dark">Choose Course</Form.Label>
                    <Select
                        showSearch
                        style={{
                            width: '100%',
                        }}
                        size='large'
                        className='custom_control mb-2 rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder="Select Course"
                        disabled={courseCategories?.length === 0}
                        allowClear
                        onChange={handleCourseChange}
                    >
                        {courseCategories.map((item, i) => (
                            <Select.Option key={i} value={item?._id}>
                                {item?.title}
                            </Select.Option>
                        ))}
                    </Select>
                    {courseCategories.length === 0 && (<span className='plusJakara_semibold text_dark'>You Dont have any course for this category</span>)}
                </Form.Group>
                {/* )} */}
                <div className="d-flex flex-wrap flex-md-nowrap gap-3 justify-between w-full mb-4">
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">Quiz Time</Form.Label>
                        <Form.Control
                            type='number'
                            required
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
                            onChange={(e) => setHoneyPots(e?.target?.value)}
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='Honeypots'
                        />
                    </Form.Group>
                </div>
                <div className="d-flex flex-wrap flex-md-nowrap gap-3 justify-between w-full mb-4">
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">What's the Passing percentage for quiz?</Form.Label>
                        <Form.Control
                            type='number'
                            required
                            onChange={(e) => setPassingPer(e?.target?.value)}
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='Percentage (%)'
                        />
                    </Form.Group>
                    <Form.Group className='shadow_def w-full'>
                        <Form.Label className="plusJakara_semibold text_dark">How much Question you want to add ?</Form.Label>
                        <Form.Control
                            type='number'
                            name='question'
                            required
                            // value={addQuestion}
                            onChange={(e) => setAddQuestion(e.target.value)}
                            style={{ padding: '10px 20px', }}
                            className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            placeholder='00'
                        />
                    </Form.Group>
                </div>
                <div className="flex justify-end my-4 w-full">
                    {!isProcessing ? (
                        <button type='submit' style={{backgroundColor:'#000'}} className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">Add Question</span>
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

export default CreateQuiz