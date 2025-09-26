/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import QuestionItem from './questionItem';
import axios from 'axios';
import { message } from 'antd';
import { ArrowLeft } from 'react-feather';

const AddQuestion = () => {
    const { state } = useLocation();
    const formData = state?.formData || null
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [questions, setQuestions] = useState([]);

    const [totalQuestions, setTotalQuestions] = useState(0);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        const totalQuestionsFromLocalStorage = formData?.addQuestion || 0;
        setTotalQuestions(totalQuestionsFromLocalStorage);
        const initialQuestions = Array.from({ length: totalQuestionsFromLocalStorage }, (_, index) => ({
            title: '',
            options: [''],
            answers: '',
            description: '',
            image: '',
        }));
        setQuestions(initialQuestions);
    }, [totalQuestions]);

    console.log(formData, 'form');

    const handleAddOption = (questionIndex) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[questionIndex].options.push('');
            return updatedQuestions;
        });
    };

    console.log(questions, 'qqq');

    const handleRemoveOption = (questionIndex, optionIndex) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions];
            const updatedOptions = [...updatedQuestions[questionIndex].options];
            if (optionIndex >= 0 && optionIndex < updatedOptions.length) {
                updatedOptions.splice(optionIndex, 1);
                updatedQuestions[questionIndex] = {
                    ...updatedQuestions[questionIndex],
                    options: updatedOptions,
                };
            }

            return updatedQuestions;
        });
    };

    const handleNextQuestion = () => {
        if (activeQuestionIndex < totalQuestions - 1) {
            setActiveQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            navigate('/quiz-summary');
        }
    };

    const handlePrevQuestion = () => {
        if (activeQuestionIndex > 0) {
            setActiveQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeQuestionIndex === totalQuestions - 1) {
            setIsProcessing(true)
            const headers = {
                'Content-Type': 'application/json',
                'x-auth-token': global.TOKEN
            }
            const data = {
                courseId: formData?.courseId,
                time: formData?.quizTime,
                honeypot: formData?.honeypots,
                // image: '',
                passing_per: formData?.passingper,
                questions: questions,
            }
            try {
                const res = await axios.post(`${global.BASEURL}api/quiz/create`, data, { headers })
                console.log(res);
                if (res?.data) {
                    console.log(res?.data);
                    message.success('Quiz added successfully')
                    navigate('/quiz')
                }
            } catch (error) {
                setIsProcessing(false)
                console.log(error);
            } finally {
                setIsProcessing(false)
            }
        } else {
            handleNextQuestion();
        }
    };

    return (
        <main className='min-h-screen lg:container py-4 px-4'>
            <div className="d-flex gap-4 align-items-start w-full">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/quiz/create-quiz') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_semibold text_black'>Create Quiz</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md p-4">
                <h4 className='plusJakara_semibold text_dark'>Add Questions</h4>
                <hr style={{ color: '#F1F0F3' }} />
                <div className="flex flex-wrap gap-2 mb-3 items-center w-full">
                    {Array.from({ length: totalQuestions }, (_, index) => (
                        <button
                            key={index}
                            type='button'
                            className={`px-4 py-2 rounded-3 plusJakara_bold ${activeQuestionIndex === index ? 'bg_primary text_white' : 'border text_black'}`}
                            onClick={() => setActiveQuestionIndex(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                {activeQuestionIndex < totalQuestions && (
                    <QuestionItem
                        questionNumber={activeQuestionIndex + 1}
                        question={questions[activeQuestionIndex].title}
                        setQuestion={(value) => setQuestions((prevQuestions) => updateQuestion(prevQuestions, activeQuestionIndex, 'title', value))}
                        correctAnswer={questions[activeQuestionIndex].answers}
                        setCorrectAnswer={(value) => setQuestions((prevQuestions) => updateQuestion(prevQuestions, activeQuestionIndex, 'answers', value))}
                        description={questions[activeQuestionIndex].description}
                        setDescription={(value) => setQuestions((prevQuestions) => updateQuestion(prevQuestions, activeQuestionIndex, 'description', value))}
                        options={questions[activeQuestionIndex].options}
                        setOptions={(value) => setQuestions((prevQuestions) => updateQuestion(prevQuestions, activeQuestionIndex, 'options', value))}
                        handleAddOption={() => handleAddOption(activeQuestionIndex)}
                        handleRemoveOption={(optionIndex) => handleRemoveOption(activeQuestionIndex, optionIndex)}
                    />
                )}
                <div className="flex justify-between my-4 w-full">
                    {activeQuestionIndex > 0 &&
                        <button type='button' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center" onClick={handlePrevQuestion}>
                            <span className="plusJakara_semibold text_white">Prev Question</span>
                        </button>}
                    {!isProcessing ? (
                        <button type='submit' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">{activeQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next Questions'}</span>
                        </button>
                    ) : (
                        <button type='button' disabled={isProcessing} className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
                            <CircularProgress size={18} className='text_white' />
                        </button>
                    )}
                </div>
            </Form>
        </main>
    );
};

export default AddQuestion;


const updateQuestion = (questions, index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
        ...updatedQuestions[index],
        [key]: value,
    };
    return updatedQuestions;
};
