/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { avatarman, bag, earning, ready, preview, trash, information2, filter, avatar1, up_arrow } from '../icons/icon'
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

const Dashboard = () => {
    const [series, setSeries] = useState([]);
    const chatRef = useRef()
    const [categories, setCategories] = useState([])
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const [failedData, setFailedData] = useState(null)
    const dispatch = useDispatch();
    dispatch(setHeaderName('Dashboard'))
    const navigate = useNavigate()
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
    const chartSeries = [0, 0, 0]; // Values for each section

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
            name: 'Driver',
            allowoverflow: true,
            width: '200px',
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
            name: 'Route ID',
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
            name: 'Client Name/Location',
            allowoverflow: true,
            width: '150px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        // setSingleData(row)
                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{'N/A'}</p>
                    </div>
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
                            row?.stop?.status == 'start' ? '#6495ED' :

                                '#EDFEED',
                        padding: 6, borderRadius: 10, paddingLeft: 15, paddingRight: 15
                    }}>
                        <span style={{
                            fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize',
                            color: row?.stop?.status == 'failed' ? '#EF4444' :
                                row?.stop?.status == 'pending' ? '#CA8A04' :
                                row?.stop?.status == 'start' ? '#0000FF' :

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
            name: 'Last Updated',
            sortable: true,
            width: '150px',
            selector: row => moment(row?.updatedAt).fromNow()
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
            const endPoint = 'routes/admin/dashboard'
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

    const getFailedStops = async () => {

        try {
            // const res = await axios.get(`${global.BASEURL}api/users/dashboard`, { headers });
            let data1 = {
            }
            const endPoint = 'routes/failed/latest'
            const res = await dataGet_(endPoint, data1);
            if (res?.data.success) {
                console.log("R", res?.data?.data);

                setFailedData(res?.data?.data)
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
        getFailedStops()
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
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <h5 className="plusJakara_semibold text_dark">{categories?.routesAssignedToday || 0}</h5>
                            <div style={{ backgroundColor: '#F3F4F4' }} className="rounded-4 w-auto p-2 h-auto flex items-center justify-center">
                                <img src={up_arrow} className='w-4 h-auto' alt="" />
                                <span style={{ fontSize: 14, marginLeft: 5, color: '#006F1F' }}>{categories?.routesAssignedChangePercent || 0}%</span>
                            </div>
                        </div>
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
                           <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <h5 className="plusJakara_semibold text_dark">{categories?.activeDrivers || 0}</h5>
                            <div style={{  }} className="rounded-4 w-auto p-2 h-auto flex items-center justify-center">
                                {/* <img src={up_arrow} className='w-4 h-auto' alt="" />
                                <span style={{ fontSize: 14, marginLeft: 5, color: '#006F1F' }}>+9%</span> */}
                            </div>
                        </div>
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
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <h5 className="plusJakara_semibold text_dark">{categories?.deliveryExpectation || 0}</h5>
                            <div style={{ backgroundColor: '#F3F4F4' }} className="rounded-4 w-auto p-2 h-auto flex items-center justify-center">
                                <img src={up_arrow} className='w-4 h-auto' alt="" />
                                <span style={{ fontSize: 14, marginLeft: 5, color: '#006F1F' }}>{categories?.deliveryExpectationChangePercent || 0}%</span>
                            </div>
                        </div>
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
                           <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <h5 className="plusJakara_semibold text_dark">{categories?.routesCreatedToday || 0}</h5>
                            <div style={{ backgroundColor: '#F3F4F4' }} className="rounded-4 w-auto p-2 h-auto flex items-center justify-center">
                                <img src={up_arrow} className='w-4 h-auto' alt="" />
                                <span style={{ fontSize: 14, marginLeft: 5, color: '#006F1F' }}>{categories?.routesCreatedChangePercent || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className='' style={{ backgroundColor: '#ECECEE', height: '70px', width: '1px' }}></div> */}

            </div>


            <div className="feature_grid w-full gap-3">
                <div className="rounded-4 bg_white p-4 shadow w-full h-auto scrolbar">
                    <h5 className='text_dark plusJakara_semibold'>Recent Stop Activity</h5>
                    <p className='text_dark plusJakara_regular mb-4' style={{color:'gray',fontSize:13}}>Shows the most recent delivery stop status updates across all active routes.</p>
          

                    <ProductTableFetch columns={columns} showFilter={true} data={data} totalPage={totalPages} currentPageSend={(val) => { setCurrentPage(val) }} currentPage={currentPage - 1} />

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
                            <h6 className="text_dark plusJakara_semibold">Route Status</h6>
                            <button onClick={() => {
                                navigate('/route/form')

                            }} style={{ width: '129px', backgroundColor: '#6688E8', fontSize: 11 }} className="bg_primary py-2 rounded-3 text_white plusKajara_semibold">Create New Routes</button>
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
                                options={categories?.chartOptions || chartOptions}
                                series={categories?.chartSeries || chartSeries}
                                type="donut"
                                width="350"
                            />
                        </div>
                    </div>
                    <Divider />

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
                            <h6 className="text_dark plusJakara_semibold">Stops Completed</h6>
                            <button onClick={() => {
                                navigate('/tracking/list')

                            }} style={{ width: '129px', borderColor: '#6688E8', borderWidth: 1, fontSize: 11, color: '#6688E8' }} className="py-2 rounded-3 text_white plusKajara_semibold">View Live Tracking</button>
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
                                options={chartOptions2}
                                series={categories?.stopCompletionPercent || chartSeries2}
                                type="radialBar"
                                height={500}
                            />
                        </div>
                    </div>

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
                            <h6 className="text_dark plusJakara_semibold">Exceptions Callout Panel</h6>
                        </div>
                        {failedData ?
                            <div
                                style={{
                                    border: "1px solid #E8E8E9",   // border color
                                    borderRadius: "8px",        // rounded corners
                                    padding: "10px",            // space inside border
                                    display: "inline-block",    // wrap tightly around chart
                                }}
                            >
                                <div style={{ width: '100%', height: 160, backgroundColor: '#FFE6E6', borderRadius: 12, padding: 10 }}>
                                    <p className="text_dark plusJakara_semibold" style={{ fontSize: 14 }}>Route #{failedData?.routeId} · Stop #{failedData?.failedStop?.stopNumber} — Failed</p>
                                    <p className="text_dark plusJakara_light" style={{ fontSize: 14, color: '#73757C' }}>{failedData?.failedStop?.notes} — Driver: {failedData?.driver?.name} ·Location: — {failedData?.failedStop?.place_name}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                                        <div></div>
                                        {/* <button onClick={() => {
                                    navigate('/route/form')

                                }} style={{ width: '129px', backgroundColor: '#6688E8', fontSize: 11, alignSelf: 'flex-end' }} className="bg_primary py-2 rounded-3 text_white plusKajara_semibold">View Details</button> */}
                                    </div>
                                </div>
                            </div> : null}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard;