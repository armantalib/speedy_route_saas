/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Check, Clock, Code, Phone, PhoneCall, Trash, Trash2 } from 'react-feather';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, message } from 'antd';
import { MdDiscount, MdPets } from 'react-icons/md';
import { news1 } from '../../icons/icon';

const PreviewBlog = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const blogDetail = state?.blogDetail || null;

    const handleSubmit = (e) => {
        console.log(e);
    };

    console.log(blogDetail, 'ar');


    const formatTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} mins${minutes > 1 ? 's' : ''}`;
        } else {
            return `${minutes} min${minutes > 1 ? 's' : ''}`;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };


    const handleUpdate = () => {
        navigate(`/blogs/update-blog/${blogDetail?._id}`, { state: { blogDetail: blogDetail } });
    };

    return (
        <main className='container m-auto min-h-screen py-4'>
            <div className="flex justify-between flex-wrap gap-3 items-center mb-4">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/blogs') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                    <h5 className="plusJakara_semibold text_dark">Blog Detail</h5>
                </div>
                <button onClick={() => handleUpdate(blogDetail)} type='button' className="flex justify-center bg_primary px-3 py-2 rounded-3 items-center">
                    <span className="plusJakara_semibold text-sm text_white">Edit Blog</span>
                </button>
            </div>
            <div className="bg_white rounded-3 shadow-md p-4">
                <h5 className="text_dark plusJakara_semibold">{blogDetail?.name}</h5>
                <div className="d-flex w-100 justify-content-between my-2">
                    <div className="d-flex align-items-center gap-1">
                        <Clock size={20} className='text_secondary' />
                        <span className="text_secondary plusJakara_medium">{formatTime(blogDetail?.time)}</span>
                    </div>
                    <span className="text_primary plusJakara_semibold">{blogDetail?.honeypot || 0} Honeypots</span>
                </div>
                <img src={blogDetail?.image} style={{ maxHeight: '20rem', objectFit: 'cover', borderRadius: '16px', width: '100%' }} alt="" />
                <div className="d-flex p-2 flex-column w-100">
                    <div className="d-flex align-items-center mb-2 justify-content-end w-100">
                        {/* <h5 className="plusJakara_semibold text_dark">Blog Caption</h5> */}
                        <span className="plusJakara_semibold text_dark">{formatDate(blogDetail?.createdAt)}</span>
                    </div>
                    <span className="plusJakara_regular text_secondary max-md:text-sm">{blogDetail?.caption}</span>
                </div>
            </div>
        </main>
    )
}
export default PreviewBlog;