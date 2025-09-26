import { CircularProgress } from '@mui/material';
import { Col, Row, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ArrowLeft, CheckCircle, Clock, Edit, Plus, Trash2 } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizDetail = () => {
    const navigate = useNavigate()
    const { state } = useLocation();
    const quizDetail = state?.quizDetail || null;
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [descriptionQuestion, setDescriptionQuestion] = useState('')
    const [question, setQuestion] = useState('')
    const [questionQuestion, setQuestionQuestion] = useState('')
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [selectedAnswerQuestion, setSelectedAnswerQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [optionsQuestion, setOptionsQuestion] = useState(["", '']);
    const [selectedItem, setSelectedItem] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

    console.log(quizDetail, 'asd');

    const handleShowAddQuestionModal = () => {
        setShowAddQuestionModal(true);
    };

    const handleShow = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    useEffect(() => {
        if (selectedItem) {
            setQuestion(selectedItem?.title)
            setDescription(selectedItem?.description)
            setOptions(selectedItem?.options || []);
            setSelectedAnswer(selectedItem?.answers)
        }
    }, [selectedItem])

    console.log(selectedItem);

    const handleClose = () => {
        setShowModal(false)
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

    const handleAnswerChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
    };
    const handleAddOption2 = () => {
        setOptionsQuestion([...optionsQuestion, '']);
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = [...options];
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);
    };
    const handleRemoveOption2 = (index) => {
        const updatedOptions = [...optionsQuestion];
        updatedOptions.splice(index, 1);
        setOptionsQuestion(updatedOptions);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };
    const handleOptionChange2 = (index, value) => {
        const updatedOptions = [...optionsQuestion];
        updatedOptions[index] = value;
        setOptionsQuestion(updatedOptions);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        const formData = {
            title: question,
            courseId: selectedItem?.course,
            options: options,
            description: description,
            answers: selectedAnswer,
        };
        setLoading(true);
        try {
            const res = await axios.put(`${global.BASEURL}api/questions/edit/${selectedItem?._id}`, formData, { headers });
            console.log(res);
            message.success('Question Updated Successfully')
            setShowModal(false)
            navigate('/quiz')
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        const formData = {
            title: questionQuestion,
            courseId: quizDetail?._id,
            options: optionsQuestion,
            description: descriptionQuestion,
            answers: selectedAnswerQuestion,
        };
        setLoading(true);
        try {
            const res = await axios.post(`${global.BASEURL}api/questions/create`, formData, { headers });
            console.log(res);
            message.success('Question created Successfully')
            navigate('/quiz')
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDetele = async (value) => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        console.log(value, 'asd');
        try {
            const res = await axios.delete(`${global.BASEURL}api/questions/${value?._id}`, { headers });
            console.log(res);
            message.success('Question deleted successfuly')
            navigate('/quiz')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <main className='container m-auto min-h-screen py-4'>
            <div className="flex justify-between flex-wrap gap-3 items-center mb-4">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/quiz') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                    <h5 className="plusJakara_semibold text_dark">Quiz Detail</h5>
                </div>
            </div>
            <div className="bg_white rounded-3 shadow-md p-4">
                {quizDetail && (
                    <div>
                        <p>{quizDetail.description}</p>
                        <div className="d-flex w-100 justify-content-between my-2">
                            <div className="d-flex align-items-center gap-1">
                                <Clock size={20} className='text_secondary' />
                                <span className="text_secondary plusJakara_medium">{formatTime(quizDetail?.time)}</span>
                            </div>
                            <span className="text_primary plusJakara_semibold">{quizDetail?.honeypot || 0} Honeypots</span>
                        </div>
                        <img src={quizDetail?.image} style={{ width: '100%', cursor: 'pointer', maxHeight: "20rem", objectFit: 'cover', borderRadius: '16px', }} alt="" />
                        <div className="d-flex flex-column p-3 gap-3">
                            <div className="d-flex justify-content-between flex-wrap gap-3 align-items-center w-100">
                                <div className="d-flex flex-column gap-3">
                                    <h4 className="plusJakara_semibold mb-0 text_black">{quizDetail?.title}</h4>
                                    <span className="plusJakara_regular text_secondary max-md:text-sm">{quizDetail?.courses_des}</span>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Button variant="primary" className='px-2 py-3' onClick={handleShowAddQuestionModal}>Add More Question</Button>
                                </div>
                            </div>
                            {quizDetail?.questions && quizDetail?.questions?.map((question, i) => (
                                <div key={i} className="d-flex flex-column gap-2">
                                    <div className="d-flex gap-3 align-items-start">
                                        <div className="d-flex gap-1">
                                            <h4 className="plusJakara_bold mb-0 text_primary">Q no {i + 1} :</h4>
                                            <div className="d-flex flex-column align-items-start mt-1 gap-1">
                                                <h5 className="plusJakara_semibold text_black">{question?.title}?</h5>
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="d-flex align-items-center gap-3">
                                                        {option === question?.answers ? (
                                                            <CheckCircle size={16} />
                                                        ) : (
                                                            <div className={`bg_darksecondary rounded-5 p-1 text_dark`} />
                                                        )}
                                                        <span key={optionIndex} className={`plusJakara_medium ${option === question?.answers ? 'text_dark plusJakara_semibold' : 'text_darksecondary plusJakara_medium'}`}>
                                                            {option}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => handleShow(question)} className="bg-transparent mt-1 border-none">
                                            <Edit size={20} />
                                        </button>
                                        <button onClick={() => handleDetele(question)} className="bg-transparent mt-1 border-none">
                                            <Trash2 style={{ color: 'red' }} size={20} />
                                        </button>
                                    </div>
                                    <div className="d-flex mt-3 gap-2 align-items-end">
                                        <h6 className="plusJakara_semibold mb-0 text_black">Answer :</h6>
                                        <span className="plusJakara_medium text_black">{question?.answers}</span>
                                    </div>
                                    {question?.description &&
                                        <div className="d-flex gap-2 align-items-start">
                                            <h6 className="plusJakara_semibold mb-0 text_black">Description </h6>
                                            <span className="plusJakara_medium text-sm text_dark">{question?.description}</span>
                                        </div>
                                    }
                                    <hr style={{ color: '#d3d3d3' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedItem && (
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Header closeButton />
                    <Modal.Body>
                        <Form onSubmit={handleUpdate} className="w-full bg_white d-flex flex-column gap-3">
                            <Form.Group className='shadow_def w-full px-3'>
                                <Form.Label className="plusJakara_semibold text_dark">Question Title</Form.Label>
                                <Form.Control
                                    type='text'
                                    required
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    style={{ padding: '10px 20px' }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Enter Question title'
                                />
                            </Form.Group>
                            <div className="px-3">
                                <div className="flex w-full">
                                    <Form.Label className="plusJakara_semibold w-full text_dark">Options</Form.Label>
                                </div>
                                {options.map((option, index) => (
                                    <Form.Group key={index} className='shadow_def flex w-full items-center flex-wrap'>
                                        <Row gutter={16} className='w-full mb-2'>
                                            <Col span={23}>
                                                <Form.Control
                                                    type='text'
                                                    required
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    style={{ padding: '10px 20px' }}
                                                    className='custom_control rounded-4 mb-0 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                                    placeholder={`Enter Option ${index + 1}`}
                                                />
                                            </Col>
                                            {index > 1 && (
                                                <Col span={1}>
                                                    <button
                                                        type='button'
                                                        style={{ backgroundColor: '#CE2C60' }}
                                                        className='text_white inter_semibold p-2 rounded-3'
                                                        onClick={() => handleRemoveOption(index)}
                                                    >
                                                        <Trash2 size={18} style={{ color: 'white' }} />
                                                    </button>
                                                </Col>
                                            )}
                                            {index === 0 && (
                                                <Col span={1}>
                                                    <button
                                                        type='button'
                                                        className='text_white inter_semibold bg_primary p-2 rounded-3'
                                                        onClick={handleAddOption}
                                                    >
                                                        <Plus size={18} style={{ color: 'white', }} />
                                                    </button>
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Group>
                                ))}
                            </div>
                            <Form.Group className='shadow_def w-full px-3'>
                                <Form.Label className="plusJakara_semibold text_dark">Correct Answer</Form.Label>
                                <Form.Select
                                    required
                                    placeholder='Choose answer from options'
                                    value={selectedAnswer}
                                    onChange={handleAnswerChange}
                                    style={{ padding: '10px 20px' }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                >
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='shadow_def w-full px-3'>
                                <Form.Label className="plusJakara_semibold text_dark">Description</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    row={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{ padding: '10px 20px' }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Enter description'
                                />
                            </Form.Group>
                            <div className="flex justify-content-end w-100">
                                {!loading ? (
                                    <button type='submit'
                                        className="flex justify-center bg_primary py-2 px-1 rounded-3 items-center">
                                        <span className="plusJakara_semibold text_white text-sm">Update Question</span>
                                    </button>
                                ) : (
                                    <button type='button'
                                        disabled={loading}
                                        className="flex justify-center bg_primary py-2 px-5 rounded-3 items-center">
                                        <CircularProgress size={18} className='text_white' />
                                    </button>
                                )}
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
            <Modal show={showAddQuestionModal} onHide={() => setShowAddQuestionModal(false)} centered>
            <Modal.Header closeButton />
                <Modal.Body>
                    <Form onSubmit={handleAddQuestion} className="w-full bg_white d-flex flex-column gap-3">
                        <Form.Group className='shadow_def w-full px-3'>
                            <Form.Label className="plusJakara_semibold text_dark">Question Title</Form.Label>
                            <Form.Control
                                type='text'
                                required
                                onChange={(e) => setQuestionQuestion(e.target.value)}
                                style={{ padding: '10px 20px' }}
                                className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                placeholder='Enter Question title'
                            />
                        </Form.Group>
                        <div className="px-3">
                            <div className="flex w-full">
                                <Form.Label className="plusJakara_semibold w-full text_dark">Options</Form.Label>
                            </div>
                            {optionsQuestion.map((option, index) => (
                                <Form.Group key={index} className='shadow_def flex w-full items-center flex-wrap'>
                                    <Row gutter={16} className='w-full mb-2'>
                                        <Col span={23}>
                                            <Form.Control
                                                type='text'
                                                required
                                                value={option}
                                                onChange={(e) => handleOptionChange2(index, e.target.value)}
                                                style={{ padding: '10px 20px' }}
                                                className='custom_control rounded-4 mb-0 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                                placeholder={`Enter Option ${index + 1}`}
                                            />
                                        </Col>
                                        {index > 1 && (
                                            <Col span={1}>
                                                <button
                                                    type='button'
                                                    style={{ backgroundColor: '#CE2C60' }}
                                                    className='text_white inter_semibold p-2 rounded-3'
                                                    onClick={() => handleRemoveOption2(index)}
                                                >
                                                    <Trash2 size={18} style={{ color: 'white' }} />
                                                </button>
                                            </Col>
                                        )}
                                        {index === 0 && (
                                            <Col span={1}>
                                                <button
                                                    type='button'
                                                    className='text_white inter_semibold bg_primary p-2 rounded-3'
                                                    onClick={handleAddOption2}
                                                >
                                                    <Plus size={18} style={{ color: 'white', }} />
                                                </button>
                                            </Col>
                                        )}
                                    </Row>
                                </Form.Group>
                            ))}
                        </div>
                        <Form.Group className='shadow_def w-full px-3'>
                            <Form.Label className="plusJakara_semibold text_dark">Correct Answer</Form.Label>
                            <Form.Select
                                required
                                placeholder='Choose answer from options'
                                onChange={(e) => setSelectedAnswerQuestion(e.target.value)}
                                style={{ padding: '10px 20px' }}
                                className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                            >
                                {/* Mapping over optionsQuestion instead of options */}
                                {optionsQuestion.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='shadow_def w-full px-3'>
                            <Form.Label className="plusJakara_semibold text_dark">Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                row={4}
                                onChange={(e) => setDescriptionQuestion(e.target.value)}
                                style={{ padding: '10px 20px' }}
                                className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                placeholder='Enter description'
                            />
                        </Form.Group>
                        <div className="flex justify-content-end w-100">
                            {!loading ? (
                                <button type='submit'
                                    className="flex justify-center bg_primary py-2 px-1 rounded-3 items-center">
                                    <span className="plusJakara_semibold text_white text-sm">Add Question</span>
                                </button>
                            ) : (
                                <button type='button'
                                    disabled={loading}
                                    className="flex justify-center bg_primary py-2 px-5 rounded-3 items-center">
                                    <CircularProgress size={18} className='text_white' />
                                </button>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </main>
    );
}

export default QuizDetail;

