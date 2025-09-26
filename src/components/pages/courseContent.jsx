/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { honeypot } from '../icons/icon'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../styles/swiper.css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, FreeMode, Pagination } from 'swiper';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

const CourseContent = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [courseCategories, setCourseCategories] = useState([])
    const [subCourseCategories, setSubCourseCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleClick = async (categoryId) => {
        setLoading(true);
        setSelectedCategory(categoryId);
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        try {
            let allCourses = [];
            let currentPage = 1;
            let totalPages = 1;
            while (currentPage <= totalPages) {
                let res;
                if (categoryId) {
                    res = await axios.get(`${global.BASEURL}api/courses/admin/${categoryId._id}/${currentPage}`, { headers });
                } else {
                    const firstCategoryId = courseCategories[0]?._id;
                    res = await axios.get(`${global.BASEURL}api/courses/admin/${firstCategoryId}/${currentPage}`, { headers });
                }
                if (res?.data) {
                    console.log(res?.data, 'sdr');
                    allCourses = allCourses.concat(res?.data?.courses);
                    totalPages = res?.data?.count?.totalPage;
                }
                currentPage++;
            }
            setSubCourseCategories(allCourses);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCoursesDetail = (item) => {
        console.log(item);
        navigate(`${'/course-content'}/${item?._id}`, { state: { courseDetail: item }, })
    }

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        try {
            const res = await axios.get(`${global.BASEURL}api/categories/admin/all`, { headers });
            if (res?.data) {
               
                setCourseCategories(res?.data?.categories);
                if (res?.data?.categories?.length > 0) {
                    handleClick(res?.data?.categories[0]);
                }
            }
           
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
            <div className="flex justify-between gap-3 items-center w-full">
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_bold text_black'>All Courses</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                <button onClick={() => { navigate('/course-content/add-content') }} style={{ width: '150px' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add New</button>
            </div>
            <div className="d-flex w-100 my-3 align-items-center">
                <h5 className="text_dark plusJakara_bold">All Courses categories</h5>
            </div>
            <div className="items_swiper mb-5">
                {!courseCategories || courseCategories?.length === 0 ?
                    <main className='my-5 flex w-100 justify-center items-center'>
                        <CircularProgress size={20} className='text_dark' />
                    </main> :
                    <Swiper
                        spaceBetween={20}
                        freeMode={true}
                        modules={[Navigation, FreeMode, Pagination]}
                        navigation={true}
                        className="m-auto w-100 overflow-hidden flex flex-nowrap"
                        slidesPerView={"auto"}
                    >
                        {courseCategories.map((item, i) => (
                            <SwiperSlide
                                key={i}
                                onClick={() => handleClick(item)}
                                style={{ height: 'auto', cursor: 'pointer', maxWidth: '150px' }}
                                className="d-flex flex-column bg_white rounded-4 py-2 px-2 align-items-center gap-1"
                            >
                                <img src={item?.image} style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '50%' }} alt="" />
                                <span className="text_dark text-center plusJakara_bold line-clamp-1">{item?.name}</span>
                            </SwiperSlide>
                        ))}
                    </Swiper>}
            </div>
            <div className="d-flex w-100 my-3 align-items-center">
                <h5 className="text_dark plusJakara_bold">{selectedCategory?.name} Courses</h5>
            </div>
            {!subCourseCategories || subCourseCategories.length === 0 ?
                <main className='my-5 flex w-100 justify-center items-center'>
                    <h6 className="text_dark plusJakara_semibold">No Course Found</h6>
                </main> :
                loading ? <main className='my-5 flex w-100 justify-center items-center'>
                    <CircularProgress className='text_dark' size={20} />
                </main> :
                    <div className="flex my-4 w-full displaygrid_3">
                        {subCourseCategories?.map((item, i) => (
                            <div style={{ cursor: 'pointer' }} onClick={() => handleCoursesDetail(item)} key={i} className="cursor-pointer shadow-sm rounded-4 bg_white flex flex-col gap-2">
                                <img src={item?.image} style={{ width: '100%', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: "13rem", objectFit: 'cover' }} alt="" />
                                <div className="flex flex-col gap-1 p-3">
                                    <h5 style={{ lineClamp: 2 }} className="text_dark mb-0 plusJakara_bold">{item?.title}</h5>
                                    <span
                                        style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
                                        className="plusJakara_medium line-clamp-2 text-sm text_secondary">{item?.courses_des}</span>
                                    {/* <div className="d-flex w-100 my-3 justify-content-between">
                                        <div className="d-flex">
                                            <img src={honeypot} style={{ height: '20px', width: 'auto' }} alt="" />
                                            <span className="text-sm text_dark plusJakara_bold">{item?.honeypot} Honeypots</span>
                                        </div>
                                         <span className="text-sm text_secondary plusJakara_regular">Due 15 May 2020</span> 
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
            }
        </main >
    )
}

export default CourseContent