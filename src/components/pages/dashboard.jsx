/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { avatarman, bag, earning, ready, preview, trash, information2, filter, avatar1 } from '../icons/icon'
import Chart from 'react-apexcharts'
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataGet_ } from '../utils/myAxios';

const Dashboard = () => {
    const [series, setSeries] = useState([]);
    const chatRef = useRef()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const options = {
        series: [
            {
                name: 'Total Users',
                data: [(categories?.stats?.totalCoursesQuizez || 0).toFixed(2)],
                width: 40,
            },
            {
                name: 'Total Courses',
                data: [(categories?.stats?.notattemptedquizez || 0).toFixed(2)],
                width: 40,
            },
            {
                name: 'Completed Courses',
                data: [(categories?.stats?.completedQuizez || 0).toFixed(2)],
                width: 40,
            },
        ],
        chart: {
            width: 300,
            type: 'donut',
        },
        labels: ['Total Courses', 'Pending Courses', 'Completed Courses',],
        dataLabels: {
            enabled: false,
            style: {
                fontSize: '9px',
                colors: ['#fff', '#fafafa', '#D0D2DA'],
            }
        },
        colors: ['#FD2254', '#00B7FE', '#d3d3d3'],
        dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 3,
            width: 10,
            opacity: 0.5
        },
        responsive: [{
            breakpoint: 400,
            options: {
                chart: {
                    width: 280
                },
                legend: {
                    show: false
                }
            }
        }],
        legend: {
            show: false,
        },

    }

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            // const res = await axios.get(`${global.BASEURL}api/users/dashboard`, { headers });
            let data1 = {
            }
            const endPoint = 'users/admin/dashboard'
            const res = await dataGet_(endPoint, data1);
            if (res?.data.success) {
                setCategories(res?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const updateSeries = (stats) => {
        const totalCourses = stats?.totalCoursesQuizez ? parseFloat(stats.totalCoursesQuizez.toFixed(2)) : 0;
        const pendingCourses = stats?.notattemptedquizez ? parseFloat(stats.notattemptedquizez.toFixed(2)) : 0;
        const completedCourses = stats?.completedQuizez ? parseFloat(stats.completedQuizez.toFixed(2)) : 0;
        setSeries([totalCourses, pendingCourses, completedCourses]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
            <div className="flex flex-col mb-3 w-full">
                <h2 className='plusJakara_bold text_black'>Dashboard</h2>
                <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
            </div>
            <div className="displaygrid_1 bg_white rounded-4 shadow-sm px-4 py-5 mb-3 h-auto w-full">
                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#FFF2E9' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Total Users</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.totalUsers || 0}</h5>
                    </div>
                </div>
                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#EDE8FF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Total Community Post</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.totalCommunityPost || 0}</h5>
                    </div>
                </div>

                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#EAF9FF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Total Marketplace Post</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.totalMarketplace || 0}</h5>
                    </div>
                </div>


                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#FFEBEF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Total Livestreams</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.totalStreams || 0}</h5>
                    </div>
                </div>

                {/* <div className='' style={{ backgroundColor: '#ECECEE', height: '70px', width: '1px' }}></div> */}

            </div>


            <div className="feature_grid w-full gap-3">
                {/* <div className="rounded-4 bg_white p-4 shadow w-full h-auto scrolbar">
                    <h4 className='text_dark plusJakara_semibold mb-4'>Top 04 Children</h4>
                    {!categories?.topUser || categories?.topUser?.length === 0 ?
                        <main className='my-5 flex w-100 justify-center items-center'>
                            <CircularProgress size={24} className='text_dark' />
                        </main> :
                        <div className="flex flex-col gap-2 w-full">
                            {categories?.topUser?.map((item, i) => (
                                <div key={i} className="flex border px-3 py-2 rounded-4 w-full justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <img src={item?.image || avatar1} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: "contain" }} alt="" />
                                        <div className="flex flex-col">
                                            <span className="text_dark plusJakara_semibold">{`${item?.first_name} ${item?.last_name}`}</span>
                                            <span className="text_dark plusJakara_semibold text-xs">{item?.honey_pot || 0} Honeypots</span>
                                        </div>
                                    </div>
                                    <div style={{ width: '36px', height: '36px' }} className="border rounded-full flex justify-center p-2">
                                        <span className="text-xs text_dark plusJakara_semibold">{item?.wonQuiz || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>}
                </div> */}
                {/* <div className="rounded-4 bg_white p-4 shadow w-full h-auto">
                    <div className="d-flex flex-column mb-3">
                        <h4 className='text_dark plusJakara_semibold'>Users Stat</h4>
                        <span className='text_secondary text-sm plusJakara_regular'>Total profit growth of 25%</span>
                    </div>
                </div> */}
            </div>
        </main>
    )
}

export default Dashboard;