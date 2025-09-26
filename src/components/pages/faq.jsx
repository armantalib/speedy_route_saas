import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CircularProgress } from '@mui/material';
import { Accordion, Button, Form, Modal } from 'react-bootstrap';
import { message } from 'antd';
import { dataGet_, dataPut } from '../utils/myAxios';

const Faq = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('');
    const [title_arabic, setTitle_Arabic] = useState('');
    const [desc_arabic, setDesc_Arabic] = useState('');

    useEffect(() => {
        setTitle(selectedItem?.title)
        setDescription(selectedItem?.desc)
        setTitle_Arabic(selectedItem?.title_arabic)
        setDesc_Arabic(selectedItem?.desc_arabic)
    }, [selectedItem])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`
        };
        const formData = {
            title: title,
            description: description,
        };
        setIsProcessing(true);
        try {

           let data1={
            title: title,
            desc: description,
            title_arabic: title_arabic,
            desc_arabic: desc_arabic,
            id:selectedItem?._id
           }
            const endPoint = `general/admin/faq/update`
            const res = await dataPut(endPoint, data1);
            message.success('Faq Updated Successfully')
            fetchData()
            setShowModal(false)
            setDescription('')
            setTitle('')
        } catch (error) {
            console.log(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleShow = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCKEditor = (event, editor) => {
        const data = editor.getData();
        setDescription(data);
    }
    const handleCKEditor2 = (event, editor) => {
        const data = editor.getData();
        setDesc_Arabic(data);
    }

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            let allFaqs = [];
            for (let page = 1; page <= totalPages; page++) {

                const endPoint = `general/admin/faq/${page}`
                const res = await dataGet_(endPoint, {});


                if (res?.data) {
                    allFaqs = allFaqs.concat(res?.data?.data);
                    setTotalPages(res?.data?.count?.totalPage);
                }
            }
            setCategories(allFaqs);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [totalPages]);

    return (
        <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
            <div className="flex justify-between gap-3 items-center w-full">
                <div className="flex flex-col mb-5 w-full">
                    <h2 className='plusJakara_bold text_black'>All Faqs</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                <button onClick={() => { navigate('/add/faq') }} style={{ width: '150px' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Faq</button>
            </div>
            {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                <CircularProgress size={24} className='text_dark' />
            </main> :
                !categories || categories.length === 0 ?
                    <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                        <span className="text_secondary plusJakara_medium">No Faq Found</span>
                    </main> :
                    <div className='accordion d-flex flex-column gap-3'>
                        {categories.map((item, i) => (
                            <Accordion key={i}>
                                <Accordion.Item
                                    className='w-100'
                                    eventKey={i}>
                                    <Accordion.Header className='w-100'>
                                        <h5 className="inter_medium text_black">{item?.title} {`(${item?.title_arabic})`}</h5>
                                    </Accordion.Header>
                                    <Accordion.Body className='w-100'>
                                        <span dangerouslySetInnerHTML={{ __html: item?.desc }} className="text_dark inter_regular"></span>
                                        <Button onClick={() => handleShow(item)} variant="primary" className="mt-3">Edit</Button>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        ))}
                    </div>}

            {selectedItem && (
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Body>
                        <Modal.Header closeButton />
                        <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md">
                            <Form.Group className='shadow_def p-3 w-full'>
                                <Form.Label className="plusJakara_semibold text_dark">Faq Title</Form.Label>
                                <Form.Control
                                    type='text'
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Enter blog title'
                                />
                            </Form.Group>
                            <hr style={{ color: '#f4f4f4' }} />
                            <Form.Group className='shadow_def p-3 w-full'>
                                <Form.Label className="plusJakara_semibold text_dark">Faq Title Arabic</Form.Label>
                                <Form.Control
                                    type='text'
                                    required
                                    value={title_arabic}
                                    onChange={(e) => setTitle_Arabic(e.target.value)}
                                    style={{ padding: '10px 20px', }}
                                    className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                    placeholder='Enter blog title'
                                />
                            </Form.Group>
                            <hr style={{ color: '#f4f4f4' }} />
                            
                            <Form.Group className='shadow_def px-3 mb-3'>
                                <Form.Label className="plusJakara_semibold text_dark">Faq Description</Form.Label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={description}
                                    config={{
                                        toolbar: [
                                            'heading',
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'blockQuote',
                                            'ckfinder',
                                            '|',
                                            'mediaEmbed',
                                            'insertTable',
                                            'tableColumn',
                                            'tableRow',
                                            'mergeTableCells',
                                            '|',
                                            'undo',
                                            'redo',
                                        ],
                                    }}
                                    onChange={handleCKEditor}
                                />
                            </Form.Group>

                            <hr style={{ color: '#f4f4f4' }} />
                            
                            <Form.Group className='shadow_def px-3 mb-3'>
                                <Form.Label className="plusJakara_semibold text_dark">Faq Description Arabic</Form.Label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={desc_arabic}
                                    config={{
                                        toolbar: [
                                            'heading',
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'blockQuote',
                                            'ckfinder',
                                            '|',
                                            'mediaEmbed',
                                            'insertTable',
                                            'tableColumn',
                                            'tableRow',
                                            'mergeTableCells',
                                            '|',
                                            'undo',
                                            'redo',
                                        ],
                                    }}
                                    onChange={handleCKEditor2}
                                />
                            </Form.Group>
                            <div className="flex justify-content-end my-4 w-100">
                                {!isProcessing ? (
                                    <button type='submit' className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                                        <span className="plusJakara_semibold text_white">Update Faq</span>
                                    </button>
                                ) : (
                                    <button type='button' disabled={isProcessing} className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
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

export default Faq;
