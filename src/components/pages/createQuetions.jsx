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

const CreateQuetions = () => {
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
        cost: '',
        grade_system: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        getDataItem();
    }, [])

    const getDataItem = async () => {
        const single_question = await localStorage.getItem('single_question');
        let data1 = JSON.parse(single_question);

        if (single_question) {
            setInput(prevState => ({
                ...prevState,
                title: data1?.title,
                title_t: data1?.title_t,
                grade_system: data1?.type
            }))
            setOptionsData(data1?.options)
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
        if (!input.grade_system)
            return message.error('Please Select Test Grade')

        setIsProcessing(true);
        e.preventDefault();
        try {
            const quiz_id = await localStorage.getItem('quiz_id')
            // const res = await axios.get(`${global.BASEURL}api/users/dashboard`, { headers });
            const single_question = await localStorage.getItem('single_question');

            const data = {
                title: input.title,
                title_t: input.title_t,
                type: input.grade_system,
                options: optionsData,
                quiz: quiz_id
            }
            if (single_question) {
                const endPoint = `quiz/question/admin/update/${singleData?._id}`
                const res = await dataPut(endPoint, data);
                setIsProcessing(false);
                localStorage.removeItem('single_question')
                navigate('/questions');

                return

            }
            const endPoint = 'quiz/question/create'
            const res = await dataPost(endPoint, data);
            setIsProcessing(false);
            navigate('/questions');


        } catch (error) {
            console.log(error);
        } finally {

        }
        // navigate('/quiz/create-quiz/add-question', { state: { formData: formData } });
    };

    const deleteOption = (index) => {
        let mData = [...optionsData];
        mData.splice(index)
        setOptionsData(mData)
    }

    const onChangeOptionValue = (item, index, e) => {
        let mData = [...optionsData];
        if (item == 'name') {
            mData[index].option = e?.target?.value
        } else if (item == 'name_t') {
            mData[index].option_t = e?.target?.value
        }
        else {
            mData[index].value = e?.target?.value
        }
        setOptionsData(mData)
    }

    return (
        <main className='min-h-screen lg:container py-4 px-4 '>
            <div className="d-flex gap-4 align-items-start w-full">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/questions') }} style={{ backgroundColor: '#000' }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_semibold text_black'>{singleData?'Update Question':'Create Question'}</h2>
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



                    <Form.Label className="plusJakara_semibold text_dark mt-4">Type of question</Form.Label>
                    <Select
                        showSearch
                        style={{
                            width: '100%',

                        }}
                        size='large'
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder="Select Course Category"
                        value={input.grade_system}
                        allowClear
                        onChange={handleCategoryChange}
                    >
                        {categories.map((item, i) => (
                            <Select.Option key={i} value={item?.id}>
                                {item?.name}
                            </Select.Option>
                        ))}
                    </Select>
                    {optionsData.map((item, index) => (
                        <>
                            <div className="d-flex flex-wrap flex-md-nowrap gap-3 justify-between w-full mb-4 mt-3">
                                <Form.Group className='shadow_def w-full'>
                                    <Form.Label className="plusJakara_semibold text_dark">Option</Form.Label>
                                    <Form.Control
                                        type='text'
                                        required
                                        value={item.option}
                                        onChange={(e) => onChangeOptionValue('name', index, e)}
                                        style={{ padding: '10px 20px', }}
                                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                        placeholder='Please enter option'
                                    />
                                </Form.Group>
                                <Form.Group className='shadow_def w-full'>
                                    <Form.Label className="plusJakara_semibold text_dark">Option Value/Score:</Form.Label>
                                    <Form.Control
                                        type='number'
                                        required
                                        value={item.value}
                                        onChange={(e) => onChangeOptionValue('value', index, e)}
                                        style={{ padding: '10px 20px', }}
                                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                        placeholder='Please enter value'
                                    />
                                </Form.Group>
                            </div>

                            <div className="d-flex flex-wrap flex-md-nowrap gap-3 justify-between w-full mb-4 mt-3">
                                <Form.Group className='shadow_def w-full'>
                                    <Form.Label className="plusJakara_semibold text_dark">Option {' (Turkish)'}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        required
                                        value={item.option_t}
                                        onChange={(e) => onChangeOptionValue('name_t', index, e)}
                                        style={{ padding: '10px 20px', }}
                                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                        placeholder='Please enter option'
                                    />
                                </Form.Group>
                                <Form.Group className='shadow_def w-full'>

                                </Form.Group>
                                {index == 0 ? null :
                                    <div className='flex gap-1' style={{ display: 'flex', alignSelf: 'center', marginTop: 20 }}>
                                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                                        <button onClick={() => deleteOption(index)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>
                                    </div>}
                            </div>
                        </>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <div></div>
                        <button onClick={() => {
                            let mData = [...optionsData];
                            mData.push({ option: '', value: '', option_t: '' })
                            setOptionsData(mData)
                        }} style={{ backgroundColor: '#000', display: 'flex', alignSelf: 'center' }} className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            {/* <span className="plusJakara_semibold text_white">Add</span> */}
                            <img className="w-[12px] h-[12px]" src={add} alt="" />
                        </button>
                        <div></div>
                    </div>
                </Form.Group>


                <div className="flex justify-end my-4 w-full mt-3">
                    {!isProcessing ? (
                        <button type='submit' style={{ backgroundColor: '#000' }} className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">{singleData?'Update Question':'Add Question'}</span>
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

export default CreateQuetions


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