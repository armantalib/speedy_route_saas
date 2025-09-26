/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { course1, course2, course3, course4, course5, news1 } from '../icons/icon'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CircularProgress } from '@mui/material'
import { Clock, Edit } from 'react-feather'

const Blog = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState(false)



    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            let allBlogs = [];
            for (let page = 1; page <= totalPages; page++) {
                const res = await axios.get(`${global.BASEURL}api/blog/admin/${page}`, { headers });

                if (res?.data) {
                    allBlogs = allBlogs.concat(res?.data?.blogs);
                    setTotalPages(res?.data?.count?.totalPage);
                }
            }
            setCategories(allBlogs);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [totalPages]);

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

    const handleDetail = (item) => {
        navigate('/blogs/blog-detail', { state: { blogDetail: item } })
    }

    return (
        <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
            <div className="flex justify-between gap-3 items-center w-full">
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_bold text_black'>All Blogs</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                <button onClick={() => { navigate('/blogs/add-blog') }} style={{ width: '150px' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Blog</button>
            </div>
            {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                <CircularProgress size={24} className='text_dark' />
            </main> :
                !categories || categories.length === 0 ?
                    <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                        <span className="text_secondary plusJakara_medium">No Blog Found</span>
                    </main> :
                    <div className="flex my-4 w-full displaygrid_3">
                        {categories?.map((item, i) => (
                            <div style={{ cursor: 'pointer' }} onClick={() => handleDetail(item)} key={i} className="shadow-sm rounded-4 bg_white flex flex-col">
                                <img src={item?.image} style={{ width: '100%', maxHeight: "10rem", objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} alt="" />
                                <div className="flex flex-col gap-1 px-3 py-2">
                                    <h5 className="text_dark plusJakara_semibold">{item?.name}</h5>
                                    <span
                                        style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
                                        className="text_dark line-clamp-2 plusJakara_regular">{item?.caption}</span>
                                    <div className="d-flex w-100 justify-content-between my-2">
                                        <div className="d-flex align-items-center gap-1">
                                            <Clock size={20} className='text_secondary' />
                                            <span className="text_secondary plusJakara_medium">{formatTime(item?.time)}</span>
                                        </div>
                                        <span className="text_primary plusJakara_semibold">{item?.honeypot || 0} Honeypots</span>
                                    </div>
                                    <span className="d-flex w-100 justify-content-end mt-2">{formatDate(item?.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>}
        </main>
    )
}

export default Blog