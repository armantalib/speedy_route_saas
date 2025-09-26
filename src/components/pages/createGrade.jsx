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
import { dataPost } from '../utils/myAxios';

const CreateGrade = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [addQuestion, setAddQuestion] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [courseCategories, setCourseCategories] = useState([]);
    const [categories, setCategories] = useState(testData);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [honeyPots, setHoneyPots] = useState(null)
    const [quizTime, setQuizTime] = useState(null)
    const [passingPer, setPassingPer] = useState(null)
    const [shouldFetchData, setShouldFetchData] = useState(false);
    const [input, setInput] = useState({
        title: '',
        title_t: '',
        decs: '',
        desc_t: '',
        cost: '',
        grade_system: '',
    });

    const navigate = useNavigate();

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
        setInput(prevState => ({ ...prevState, grade_system: value }))
        setSelectedCourse(null);
        setTotalPages(1);
        setShouldFetchData(true);
    };

    const handleCourseChange = (value) => {
        setSelectedCourse(value);
    };

    useEffect(() => {
        if (shouldFetchData) {
            fetchData();
            setShouldFetchData(false);
        }
    }, [shouldFetchData, categoryId, totalPages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
   

        setIsProcessing(true);
        e.preventDefault();
        try {
            // const res = await axios.get(`${global.BASEURL}api/users/dashboard`, { headers });
            const data = {
                title: input.title,
            }
            const endPoint = 'quiz/grade/create'
            const res = await dataPost(endPoint, data);
            setIsProcessing(false);
            navigate('/grade');

        } catch (error) {
            console.log(error);
        } finally {

        }
        // navigate('/quiz/create-quiz/add-question', { state: { formData: formData } });
    };

    return (
        <main className='min-h-screen lg:container py-4 px-4 '>
            <div className="d-flex gap-4 align-items-start w-full">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/quiz') }} style={{ backgroundColor: '#000' }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_semibold text_black'>Create Grade</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md p-4">
                <Form.Group className='shadow_def mb-4'>
                    <Form.Label className="plusJakara_semibold text_dark">Title</Form.Label>
                    <Form.Control
                        type='input'
                        required
                        onChange={(e) => setInput(prevState => ({ ...prevState, title: e?.target?.value }))}
                        // onChange={(e) => setQuizTime(e?.target?.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter title'
                    />
              
                </Form.Group>


                <div className="flex justify-end my-4 w-full mt-3">
                    {!isProcessing ? (
                        <button type='submit' style={{ backgroundColor: '#000' }} className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">Add Grade</span>
                        </button>
                    ) : (
                        <button type='button' disabled={isProcessing} style={{ backgroundColor: '#000' }} className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
                            <CircularProgress size={18} className='text_white' />
                        </button>
                    )}
                </div>
            </Form>
        </main>
    )
}

export default CreateGrade


const testData = [
    {
        id: '2',
        name: 'Psych Tests'
    },
    {
        id: '3 ',
        name: 'Pychopathy Test'
    },
]