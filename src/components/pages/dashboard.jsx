/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { avatarman, bag, earning, ready, preview, trash, information2, filter, avatar1 } from '../icons/icon'
import Chart from 'react-apexcharts'
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataGet_ } from '../utils/myAxios';
import { useDispatch } from 'react-redux';
import { setHeaderName } from '../../storeTolkit/userSlice';
import ProductTableFetch from '../DataTable/productTableFetch';
import { formatSecondsToHMS } from '../utils/DateTimeCustom';
import moment from 'moment';
import { Divider } from 'antd';

const Dashboard = () => {
    const [series, setSeries] = useState([]);
    const chatRef = useRef()
    const [categories, setCategories] = useState([])
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    dispatch(setHeaderName('Dashboard'))
    const chartOptions = {
        chart: {
            type: "donut",
        },
        labels: ["In Progress", "Assigned", "Draft"], // Label names for each section
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };
    const chartSeries = [44, 33, 23]; // Values for each section

    const chartOptions2 = {
        chart: {
            type: "radialBar",
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                hollow: {
                    margin: 0,
                    size: "70%",
                },
                track: {
                    background: "#e7e7e7",
                    strokeWidth: "100%",
                },
                dataLabels: {
                    name: {
                        show: true,
                        fontSize: "16px",
                        color: "#666",
                        offsetY: 20,
                    },
                    value: {
                        show: true,
                        fontSize: "28px",
                        fontWeight: "bold",
                        formatter: (val) => `${val}%`,
                        offsetY: -10,
                    },
                },
            },
        },
        fill: {
            colors: ["#555"], // Progress color
        },
        labels: ["Stops Completed"],
    };
    const chartSeries2 = [80]; // % Completed
    const columns = [
        {
            name: 'ID',
            allowoverflow: true,
            width: '150px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        // setSingleData(row)
                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{row?.routeId}</p>
                    </div>
                )
            }
        },
        {
            name: 'Driver',
            allowoverflow: true,
            width: '150px',
            cell: (row) => {
                return (
                    <>
                        {row?.driver ?
                            <div onClick={() => {
                                // setSingleData(row)
                                // setSelectedDriver(row)
                                // setShowDriverDetail(true)
                            }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                                <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                                <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{row?.driver?.name}</p>
                            </div> : <span>N/A</span>}
                    </>
                )
            }
        },
        {
            name: 'Status',
            allowoverflow: true,
            width: '150px',
            cell: (row) => {
                return (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: row?.stop?.status == 'failed' ? '#FCE8EC' :
                            row?.stop?.status == 'pending' ? '#FEF9C3' :

                                '#EDFEED',
                        padding: 6, borderRadius: 10, paddingLeft: 15, paddingRight: 15
                    }}>
                        <span style={{
                            fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize',
                            color: row?.stop?.status == 'failed' ? '#EF4444' :
                                row?.stop?.status == 'pending' ? '#CA8A04' :

                                    '#22C55E'
                        }}>{row?.stop?.status}</span>
                    </div>
                )
            }
        },
        {
            name: 'Stop Address',
            sortable: true,
            width: '250px',
            selector: row => row?.stop?.place_name ? row?.stop?.place_name : 'N/A'
        },
        {
            name: 'Time',
            sortable: true,
            width: '150px',
            selector: row => formatSecondsToHMS(row?.duration)
        },

    ]

    const fetchData2 = async () => {
        setLoading(true);
        try {
            let allData = [];
            let data1 = {}
            const endPoint = `routes/admin/prof/list/${currentPage}`;
            const res = await dataGet_(endPoint, data1);

            if (res?.data) {
                allData = allData.concat(res?.data?.data);
                setTotalPages(res?.data?.count?.totalPage);
            }

            setData(allData);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

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
            const endPoint = 'routes/admin/dashboard'
            const res = await dataGet_(endPoint, data1);
            console.log("E",res.data.data);
            
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
        fetchData2();
    }, []);

    return (
        <main className='min-h-screen lg:container py-4 px-4 mx-auto'>
            {/* <div className="flex flex-col mb-3 w-full">
                <h2 className='plusJakara_bold text_black'>Dashboard</h2>
                <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
            </div> */}
            <div className="displaygrid_1 bg_white rounded-4 shadow-sm px-4 py-5 mb-3 h-auto w-full">
                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#FFF2E9' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Route Assigned Today</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.routesAssignedToday || 0}</h5>
                    </div>
                </div>
                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#EDE8FF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Active Drivers</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.activeDrivers || 0}</h5>
                    </div>
                </div>

                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#EAF9FF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Delivery Expectation</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.deliveryExpectation || 0}</h5>
                    </div>
                </div>


                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#FFEBEF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Route Optimized Today</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.routesCreatedToday || 0}</h5>
                    </div>
                </div>

                {/* <div className='' style={{ backgroundColor: '#ECECEE', height: '70px', width: '1px' }}></div> */}

            </div>


            <div className="feature_grid w-full gap-3">
                <div className="rounded-4 bg_white p-4 shadow w-full h-auto scrolbar">
                    <h5 className='text_dark plusJakara_semibold mb-4'>Recent Activity</h5>

                    <ProductTableFetch columns={columns} showFilter={true} data={data} totalPage={totalPages} currentPageSend={(val) => { setCurrentPage(val) }} currentPage={currentPage - 1} />

                </div>
                <div className="rounded-4 bg_white p-4 shadow w-full h-auto">
                    <div className="d-flex flex-column mb-3">
                        <h5 className='text_dark plusJakara_semibold'>Route Status</h5>
                        <Chart
                            options={categories?.chartOptions || chartOptions}
                            series={categories?.chartSeries || chartSeries}
                            type="donut"
                            width="350"
                        />
                    </div>
                    <Divider />
                    <div className="d-flex flex-column mb-3">
                        <h5 className='text_dark plusJakara_semibold'>Stop Completed</h5>
                        <Chart
                            options={chartOptions2}
                             series={categories?.stopCompletionPercent || chartSeries2}
                            type="radialBar"
                            height={500}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard;