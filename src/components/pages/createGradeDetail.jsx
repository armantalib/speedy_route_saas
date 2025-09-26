/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { Form } from 'react-bootstrap';
import { Select, message } from 'antd';
import axios from 'axios';
import { ArrowLeft } from 'react-feather';
import { avatarman, preview, trash, add, } from '../icons/icon';
import { dataPost, dataPut } from '../utils/myAxios';
import { json, useLocation, useNavigate } from 'react-router-dom';

const CreateGradeDetail = () => {
    const { pData } = useLocation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [addQuestion, setAddQuestion] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [courseCategories, setCourseCategories] = useState([]);
    const [categories, setCategories] = useState(testData);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [honeyPots, setHoneyPots] = useState(null)
    const [singleData, setSingleData] = useState(null)
    const [optionsData, setOptionsData] = useState([{ option: '', value: '', option_t: '' }])
    const [shouldFetchData, setShouldFetchData] = useState(false);
    const [input, setInput] = useState({
        title: '',
        title_t: '',
        decs: '',
        desc_t: '',
        points: '',
        points_max: '',
        grade_system: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        getDataItem();
    }, [])

    const getDataItem = async () => {
        const single_question = await localStorage.getItem('single_grade_detail');
        let data1 = JSON.parse(single_question);
        console.log("D", data1);

        if (single_question) {
            setInput(prevState => ({
                ...prevState,
                title: data1?.title,
                title_t: data1?.title_t,
                decs: data1?.desc,
                desc_t: data1?.desc_t,
                points: data1?.points_min,
                points_max: data1?.points_max

            }))
            setSingleData(data1)
        }
    }



    const handleCategoryChange = (value) => {
        setCategoryId(value);
        setInput(prevState => ({ ...prevState, grade_system: value }))
        setSelectedCourse(null);
        setTotalPages(1);
        setShouldFetchData(true);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();


        setIsProcessing(true);
        e.preventDefault();
        try {
            const grade_id = await localStorage.getItem('grade_id')
            // const res = await axios.get(`${global.BASEURL}api/users/dashboard`, { headers });
            const single_question = await localStorage.getItem('single_grade_detail');

            const data = {
                title: input.title,
                title_t: input.title_t,
                desc: input.decs,
                desc_t: input.desc_t,
                points_min: input.points,
                points_max:input.points_max,
                grade: grade_id
            }
            if (single_question) {
                const endPoint = `quiz/grade/detail/admin/update/${singleData?._id}`
                const res = await dataPut(endPoint, data);
                setIsProcessing(false);
                localStorage.removeItem('single_grade_detail')
                navigate('/grade/detail');

                return

            }
            const endPoint = 'quiz/grade/detail/create'
            const res = await dataPost(endPoint, data);
            setIsProcessing(false);
            navigate('/grade/detail');


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
                    <button type='button' onClick={() => { navigate('/questions') }} style={{ backgroundColor: '#000' }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_semibold text_black'>{singleData ? 'Update Detail' : 'Create Detail'}</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md p-4">
                <Form.Group className='shadow_def mb-4'>
                    <Form.Label className="plusJakara_semibold text_dark">Title English</Form.Label>
                    <Form.Control
                        type='input'
                        required
                        value={input.title}
                        onChange={(e) => setInput(prevState => ({ ...prevState, title: e?.target?.value }))}
                        // onChange={(e) => setQuizTime(e?.target?.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter title'
                    />
                    <Form.Label className="plusJakara_semibold text_dark mt-3">Title Turkish</Form.Label>
                    <Form.Control
                        type='input'
                        required
                        value={input.title_t}
                        onChange={(e) => setInput(prevState => ({ ...prevState, title_t: e?.target?.value }))}
                        // onChange={(e) => setQuizTime(e?.target?.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter title'
                    />

                    <Form.Label className="plusJakara_semibold text_dark mt-3">Description English</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        required
                        value={input.decs}
                        onChange={(e) => setInput(prevState => ({ ...prevState, decs: e?.target?.value }))}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter Description'
                    />
                    <Form.Label className="plusJakara_semibold text_dark mt-3">Description Turkish</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        required
                        value={input.desc_t}
                        onChange={(e) => setInput(prevState => ({ ...prevState, desc_t: e?.target?.value }))}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter Description'
                    />
                    <Form.Label className="plusJakara_semibold text_dark mt-3">Points Min</Form.Label>
                    <Form.Control
                        type='number'
                        required
                        value={input.points}
                        onChange={(e) => setInput(prevState => ({ ...prevState, points: e?.target?.value }))}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter Points'
                    />

                    <Form.Label className="plusJakara_semibold text_dark mt-3">Points Max</Form.Label>
                    <Form.Control
                        type='number'
                        required
                        value={input.points_max}
                        onChange={(e) => setInput(prevState => ({ ...prevState, points_max: e?.target?.value }))}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter Points'
                    />




                </Form.Group>


                <div className="flex justify-end my-4 w-full mt-3">
                    {!isProcessing ? (
                        <button type='submit' style={{ backgroundColor: '#000' }} className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">{singleData ? 'Update Detail' : 'Add Detail'}</span>
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

export default CreateGradeDetail


const testData = [
    {
        id: 'mcq',
        name: 'Multiple Choice'
    },
    {
        id: 'single',
        name: 'Single Select'
    },
]