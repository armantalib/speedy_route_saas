/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { avatarman, bag, earning, ready, preview, trash, information2, filter, avatar1, badge1, badge2, badge3, badge5, badge4 } from '../icons/icon'
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
import { DivideCircle } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const SuperDashboard = () => {
    const [series, setSeries] = useState([]);
    const chatRef = useRef()
    const [categories, setCategories] = useState([])
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    dispatch(setHeaderName('Reports'))
    const navigate = useNavigate()
    const completed = 1;
    const failed = 0;
    const total = completed + failed;
    const chartOptions = {
        series: [completed, failed],
        options: {
            chart: {
                type: "donut",
            },
            labels: ["Completed", "Failed"],
            colors: ["#4CAF50", "#FF6B6B"], // ✅ green & red
            legend: {
                show: true,
                position: "bottom",
                formatter: function (seriesName, opts) {
                    return `${seriesName} - ${opts.w.globals.series[opts.seriesIndex]}`;
                },
                labels: {
                    colors: "#333",
                },
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: "70%",
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: "Total",
                                formatter: () => total,
                                fontSize: "22px",
                                fontWeight: 600,
                            },
                        },
                    },
                },
            },
        },
    }
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
    const barChartOption = {
        series: [
            {
                name: "Sales",
                data: [0, 0, 0, 0, 0, 0, 0], // Y-axis values
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
            },
            plotOptions: {
                bar: {
                    horizontal: false, // set true for horizontal bars
                    columnWidth: "30%",
                    endingShape: "rounded",
                },
            },
            colors: ["#84A0ED"], // 🔥 set single color for bars
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
            },
            xaxis: {
                categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], // X-axis labels
            },
            yaxis: {
                title: {
                    text: "Sales (in units)",
                },
            },
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val} units`,
                },
            },
        },
    }
    const columns = [
        {
            name: 'Rank',
            allowoverflow: true,
            width: '150px',
            cell: (row) => {
                return (
                    <>
           
                            <div onClick={() => {
                                // setSingleData(row)
                                // setSelectedDriver(row)
                                // setShowDriverDetail(true)
                            }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                                <img src={row?.rank==1?badge1:row?.rank==2?badge2:row?.rank==3?badge3:row?.rank==4?badge4:badge5} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                                <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{row?.driver?.name}</p>
                            </div> 
                    </>
                )
            }
        },
        {
            name: 'Driver',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        // setSingleData(row)
                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{fontWeight: 'bold', fontSize: 14 }}>{row?.driverInfo?.name}</p>
                    </div>
                )
            }
        },

        {
            name: 'Stop Completed',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        // setSingleData(row)
                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{fontWeight: 'bold', fontSize: 14 }}>{row?.completedStops}</p>
                    </div>
                )
            }
        },


         {
            name: 'Failed Stop',
            allowoverflow: true,
            width: '150px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        // setSingleData(row)
                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{fontWeight: 'bold', fontSize: 14 }}>{row?.failedStops}</p>
                    </div>
                )
            }
        },

    ]

        const columns2 = [
     
        {
            name: 'Driver Name',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        // setSingleData(row)
                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{fontWeight: 'bold', fontSize: 14 }}>{row?.driverInfo?.name}</p>
                    </div>
                )
            }
        },

        {
            name: 'Failed Stop',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        // setSingleData(row)
                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{fontWeight: 'bold', fontSize: 14 }}>{row?.failedStops}</p>
                    </div>
                )
            }
        },


    ]

    const fetchData2 = async () => {
        setLoading(true);
        try {
            let allData = [];
            let data1 = {}
            const endPoint = `routes/admin/recent/list/${currentPage}`;
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
            const endPoint = 'routes/admin/reports'
            const res = await dataGet_(endPoint, data1);
            console.log("E", res.data?.chartOptions);

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
        // fetchData();
        // fetchData2();
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
                        <span className="plusJakara_medium text_secondary">Monthly Recurring Revenue</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.totalRoutesCreated || 0}</h5>
                    </div>
                </div>
                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#EDE8FF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Active Clients</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.totalRoutesCompleted || 0}</h5>
                    </div>
                </div>

                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#EAF9FF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Trial Clients</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{categories?.incompleteRoutes || 0}</h5>
                    </div>
                </div>


                <div className="flex gap-2 justify-start w-full">
                    <div style={{ backgroundColor: '#FFEBEF' }} className="rounded-4 w-auto p-3 h-auto flex items-center justify-center">
                        <img src={bag} className='w-3 h-auto' alt="" />
                    </div>
                    <div className="flex flex-col w-full">
                        <span className="plusJakara_medium text_secondary">Past Due Invoices</span>
                        {/* {!categories?.totalCourses ?
                            <div className="flex items-center ms-5">
                                <CircularProgress size={18} className='text_dark' />
                            </div> : */}
                        <h5 className="plusJakara_semibold text_dark">{formatSecondsToHMS(categories?.avgRouteDuration) || 0}</h5>
                    </div>
                </div>

                {/* <div className='' style={{ backgroundColor: '#ECECEE', height: '70px', width: '1px' }}></div> */}

            </div>



            <div className="rounded-4 bg_white p-4 shadow w-full h-auto scrolbar">
                <div
                    style={{
                        border: "1px solid #E8E8E9",   // border color
                        borderRadius: "8px",        // rounded corners
                        padding: "10px",            // space inside border
                        display: "flex",    // wrap tightly around chart
                        justifyContent: 'space-between'
                    }}
                >
                    <h6 className="text_dark plusJakara_semibold">Routes Completed (Last 7 Days)</h6>
                </div>

                <Chart
                    options={categories?.barChartOption?.options || barChartOption.options}
                    series={categories?.barChartOption?.series || barChartOption.series}
                    type="bar"
                    height={350}
                />
            </div>

            <div className="feature_grid w-full gap-3 mt-3">
                <div className="rounded-4 bg_white p-4 shadow w-full h-auto scrolbar">
                    <h5 className='text_dark plusJakara_semibold mb-4'>Driver Leaderboard</h5>

                    <ProductTableFetch columns={columns} showFilter={true} data={categories?.driverLeaderboard || data} notPagination={true} totalPage={totalPages} currentPageSend={(val) => { setCurrentPage(val) }} currentPage={currentPage - 1} />

                </div>
                <div className="rounded-4 bg_white p-4 shadow w-full h-auto">
                    <h5 className='text_dark plusJakara_semibold mb-4'>Top 5 issue</h5>

                    <ProductTableFetch columns={columns2} showFilter={true} data={categories?.failedStopsLeaderboard || data} notPagination={true} totalPage={totalPages} currentPageSend={(val) => { setCurrentPage(val) }} currentPage={currentPage - 1} />

                </div>
            </div>

            <div className="feature_grid w-full gap-3 mt-3">
                <div className="rounded-4 bg_white p-4 shadow w-full h-auto">
                    <div className="d-flex flex-column mb-3">
                        <div
                            style={{
                                border: "1px solid #E8E8E9",   // border color
                                borderRadius: "8px",        // rounded corners
                                padding: "10px",            // space inside border
                                display: "flex",    // wrap tightly around chart
                                justifyContent: 'space-between'
                            }}
                        >
                            <h6 className="text_dark plusJakara_semibold">Stops Completion</h6>

                        </div>
                        <div
                            style={{
                                border: "1px solid #E8E8E9",   // border color
                                borderRadius: "8px",        // rounded corners
                                padding: "10px",            // space inside border
                                display: "inline-block",    // wrap tightly around chart
                            }}
                        >
                            <Chart
                                options={categories?.chartOptions?.options || chartOptions.options}
                                series={categories?.chartOptions?.series || chartOptions.series}
                                type="donut"
                                height={300}
                            />
                        </div>
                    </div>
                </div>
                <div className="rounded-4 bg_white p-4 shadow w-full h-auto">
                    <div className="d-flex flex-column mb-3">
                        <div
                            style={{
                                border: "1px solid #E8E8E9",   // border color
                                borderRadius: "8px",        // rounded corners
                                padding: "10px",            // space inside border
                                display: "flex",    // wrap tightly around chart
                                justifyContent: 'space-between'
                            }}
                        >
                            <h6 className="text_dark plusJakara_semibold">Top 5 Drivers Performance</h6>

                        </div>
                        <div
                            style={{
                                border: "1px solid #E8E8E9",   // border color
                                borderRadius: "8px",        // rounded corners
                                padding: "10px",            // space inside border
                                display: "inline-block",    // wrap tightly around chart
                            }}
                        >
                            <Chart
                                options={barChartOption.options}
                                series={barChartOption.series}
                                type="bar"
                                height={350}
            
                            />
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}

export default SuperDashboard;