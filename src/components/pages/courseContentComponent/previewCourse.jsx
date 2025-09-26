/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Check, Code, Download, Phone, PhoneCall, Trash, Trash2 } from 'react-feather';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, message } from 'antd';
import { MdDiscount, MdPets } from 'react-icons/md';
import { news1, pdflogo } from '../../icons/icon';

const PreviewCourse = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const courseDetail = state?.courseDetail || null;

    const handleDocumentClick = () => {
        window.open(courseDetail.course_doc, '_blank');
    };
    const handleUpdate = () => {
        navigate(`/course-content/update-course/${courseDetail?._id}`, { state: { courseDetail: courseDetail } });
    };

    return (
        <main className='container m-auto min-h-screen py-4'>
            <div className="flex justify-between flex-wrap gap-3 items-center mb-4">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/course-content') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                    <h5 className="plusJakara_semibold text_dark">Course Detail</h5>
                </div>
                <button onClick={() => handleUpdate(courseDetail)} type='button' className="flex justify-center bg_primary px-3 py-2 rounded-3 items-center">
                    <span className="plusJakara_semibold text-sm text_white">Edit Course</span>
                </button>
            </div>
            <div className="bg_white rounded-3 shadow-md p-4">
                <h3 className="plusJakara_semibold text_black">{courseDetail?.category?.name}</h3>
                <h5 className="text_dark plusJakara_medium">{courseDetail?.title}</h5>
                {courseDetail?.intro_video &&
                    <div className="my-3 w-full">
                        <video controls style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', }}>
                            <source src={courseDetail?.intro_video} />
                            Your browser does not support the video tag.
                        </video>
                    </div>}
                <h6 className="plusJakara_regular my-3 text_dark max-md:text-sm">{courseDetail?.courses_des}</h6>
                <img src={courseDetail?.image} style={{ maxHeight: '20rem', width: '100%', objectFit: 'cover' }} alt="" />
                <div className="my-3 w-full flex justify-center">
                    <button style={{ backgroundColor: '#f4f4f4', border: '1px dashed black' }} onClick={handleDocumentClick} className='rounded-4 px-4 py-2 flex gap-2 items-center '>
                        <img src={pdflogo} style={{ height: '25px', width: "auto" }} />
                        <span className='text_dark plusJakara_medium'>Download PDF</span>
                    </button>
                </div>
            </div>
        </main>
    )
}

export default PreviewCourse;