import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Plus, Trash2 } from 'react-feather';

const QuestionItem = ({ questionNumber, question, correctAnswer, setCorrectAnswer, description, setDescription, setOptions, setQuestion, options, handleAddOption, handleRemoveOption }) => {
    const [initialized, setInitialized] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState('');

    useEffect(() => {
        if (!initialized) {
            setOptions(['', '']);
            setInitialized(true);
        }
    }, [initialized, setInitialized, setOptions]);

    const handleAnswerChange = (e) => {
        setSelectedAnswer(e.target.value);
        setCorrectAnswer(e.target.value);
    };

    return (
        <div>
            <Form.Group className='shadow_def w-full mb-4 px-3'>
                <Form.Label className="plusJakara_semibold text_dark">Question {questionNumber}</Form.Label>
                <Form.Control
                    type='text'
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    style={{ padding: '10px 20px' }}
                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                    placeholder='Enter Question'
                />
            </Form.Group>
            <hr style={{ color: "#f4f4f4" }} />
            <div className="px-3">
                <div className="flex w-full">
                    <Form.Label className="plusJakara_semibold w-full text_dark">Options</Form.Label>
                </div>
                {options.map((option, index) => (
                    <Form.Group key={index} className='shadow_def flex w-full items-center flex-wrap'>
                        <Row gutter={16} className='w-full mb-3'>
                            <Col span={23}>
                                <Form.Control
                                    type='text'
                                    required
                                    value={option}
                                    onChange={(e) => {
                                        const updatedOptions = [...options];
                                        updatedOptions[index] = e.target.value;
                                        setOptions(updatedOptions);
                                    }}
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
            <hr style={{ color: "#f4f4f4" }} />
            <Form.Group className='shadow_def w-full mb-4 px-3'>
                <Form.Label className="plusJakara_semibold text_dark">Correct Answer</Form.Label>
                <Form.Select
                    required
                    placeholder='Choose answer from options'
                    onChange={handleAnswerChange}
                    style={{ padding: '10px 20px' }}
                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                >
                    {options.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className='shadow_def w-full mb-4 px-3'>
                <Form.Label className="plusJakara_semibold text_dark">Description</Form.Label>
                <Form.Control
                    as='textarea'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ padding: '10px 20px' }}
                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                    placeholder='Enter description'
                />
            </Form.Group>
        </div>
    );
};

export default QuestionItem;
