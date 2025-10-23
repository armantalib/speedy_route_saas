/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTableFetch from '../../DataTable/productTableFetch';
import { dataTable } from '../../DataTable/productsData';
import { avatar1, preview, trash, edit2 } from '../../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataDelete, dataGet_, dataPut } from '../../utils/myAxios';
import { useNavigate } from 'react-router-dom';
import { Accordion, Form, Modal } from 'react-bootstrap';
import { GoogleMap, LoadScript, Polygon, Autocomplete, Marker, useLoadScript, useJsApiLoader } from "@react-google-maps/api";
import Switch from 'react-switch';
import moment from 'moment';
import AssignDriverModal from '../AssignDriver/AssignDriverModal';
import { formatSecondsToHMS } from '../../utils/DateTimeCustom';
import { useDispatch } from 'react-redux';
import { setHeaderName } from '../../../storeTolkit/userSlice';
import styles2 from "../Drivers/DriverTable.module.css";
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { setRouteDetail } from '../../../storeTolkit/routeSlice';
import AssignDriver from '../AssignDriver/AssignDriver';
const SpeedyRoutesList = (props) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false)
    const [paths, setPaths] = useState([]); // Store the polygon coordinates
    const [isDrawing, setIsDrawing] = useState(false);
    const [search, setSearch] = useState('');
    const [data, setData] = useState([])
    const [map, setMap] = useState(true);
    const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default center (New York City)
    const [singleData, setSingleData] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [key, setKey] = useState(1);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedDate, setSelectedDate] = useState("Today");
    const [selectedStatus, setSelectedStatus] = useState("Completed");
    const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
    const [routeDetailsShow, setRouteDetailsShow] = useState(false);
    const dispatch = useDispatch();
    dispatch(setHeaderName('Routes'))

    const dateOptions = ["Today", "Yesterday", "Last 7 Days", "Last Month"];
    const statusOptions = ["Completed", "In Progress", "Failed", "Cancelled"];
    // const { isLoaded } = useJsApiLoader({
    //     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    //   });



    const StatusToggler = ({ row }) => {
        const [isActive, setIsActive] = useState(row.status === 'active');

        const handleToggle = async () => {
            // axiosInstanceApi.put(`/users/update/${row._id}/${isActive ? 'deactivated' : 'online'}`)
            const endPoint = `marketplace/admin/marketplace/update/${row._id}/${isActive ? 'deactivated' : 'active'}`
            const res = await dataPut(endPoint, {});

            setIsActive(!isActive);

        };

        return (
            <div style={{ display: 'flex', alignItems: 'center', minWidth: '220px' }}>
                <Switch
                    onChange={handleToggle}
                    checked={isActive}
                    offColor="#888"
                    height={18}  // Reduced height
                    width={36}   // Reduced width
                    onColor="#4949E8"  // Green color when active
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
                <span style={{ marginLeft: '10px', color: isActive ? '#4949E8' : 'grey' }}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
        );
    };

    const columns = [
        {
            name: 'Date',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {

                        // setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        {/* <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} /> */}
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{moment(row.scheduleDate).format('DD MMM')}</p>
                    </div>
                )
            }
        },
        {
            name: 'Route ID',
            sortable: true,
            width: '250px',
            selector: row => row?.routeId
        },
        {
            name: 'Driver',
            sortable: true,
            width: '180px',
            selector: row => row?.driver?.name ? row?.driver?.name : 'N/A'
        },
        {
            name: 'Stops',
            sortable: true,
            width: '130px',
            selector: row => row?.stops?.length
        },
        {
            name: 'Status',
            allowoverflow: true,
            width: '150px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                    }} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor:
                            row?.status == 'draft' ? '#E8E8E9' :
                                row?.status == 'assigned' ? '#FEF9C3' :
                                    '#EDFEED', padding: 6, borderRadius: 10, paddingLeft: 15, paddingRight: 15
                    }}>
                        <span style={{
                            fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize', color:
                                row?.status == 'draft' ? '#18181B' :
                                    row?.status == 'assigned' ? '#CA8A04' :
                                        '#22C55E'
                        }}>{row?.status}</span>
                    </div>
                )
            }
        },
        {
            name: 'Duration',
            sortable: true,
            width: '230px',
            selector: row => formatSecondsToHMS(row?.duration)
        },
        {
            name: 'Actions',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        {/* <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} /> */}
                        <p style={{ marginLeft: 10, fontWeight: 700, fontSize: 14, color: '#4770E4', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                                moveNext(row)
                            }}
                        >{'Edit'}</p>
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14, color: '#4770E4', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => {
                            setSingleData(row)
                            setShowAssignDriverModal(true)
                        }}>{'Assign Route'}</p>
                        <p
                            onClick={() => {
                                setSingleData(row)
                                 dispatch(setRouteDetail(row))
                                setRouteDetailsShow(trash)
                            }}
                            style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14, color: '#73757C', cursor: 'pointer', textDecoration: 'underline' }}>{'Details'}</p>
                    </div>
                )
            }
        },
        // {
        //     name: 'Action',
        //     allowoverflow: true,
        //     cell: (row) => {
        //         return (
        //             <div className='flex gap-1' style={{ flexDirection: 'row', flex: 'row', justifyContent: 'space-between' }}>
        //                 {/* <button onClick={() => moveNext(row)} className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={edit2} alt="" /></button> */}
        //                 <button onClick={() => deleteData(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>

        //             </div>
        //         )
        //     }
        // },
    ]


    const fetchData = async () => {
        setLoading(true);
        try {
            let allData = [];
            let data1 = {}
            const endPoint = `routes/admin/list/${currentPage}?category=${selectedCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&search=${search}`;
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




    const deleteData = async (id) => {
        if (window.confirm("Are you sure to want delete")) {
            let data1 = {}
            const endPoint = `marketplace/admin/marketplace/update/${id}/removed`
            const res = await dataPut(endPoint, {});
            fetchData()
        }
    }

    const moveNext = async (item) => {
        // console.log("Clock",item);

        // localStorage.setItem('route_data', JSON.stringify(item))
        dispatch(setRouteDetail(item))
        navigate('/route/form');
    }

    useEffect(() => {
        fetchData();
    }, [currentPage, selectedCategory, minPrice, search]);

    const handleClear = () => {
        setSelectedDate(null);
        setSelectedStatus(null);
    };


    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            {!routeDetailsShow ?
                <main className="min-h-screen lg:container py-5 px-4 mx-auto">



                    <div className={styles2.tableHeader}>
                        <h3></h3>
                        <div>
                            <Input.Search
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: 200, marginRight: 10 }}
                            />
                            <Button type="default"
                                onClick={() => {
                                    setShowModal(true)
                                }}
                            >Filter</Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                style={{ marginLeft: 10 }}
                                onClick={() => {
                                    dispatch(setRouteDetail(null))
                                    navigate('/route/form')

                                }}
                            >
                                New Route
                            </Button>
                        </div>
                    </div>

                    {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                        <CircularProgress size={24} className='text_dark' />
                    </main> :
                        !data || data.length === 0 ?
                            <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                                <span className="text_secondary plusJakara_medium">No Dates Found</span>
                            </main> :
                            <ProductTableFetch columns={columns} showFilter={true} data={data} totalPage={totalPages} currentPageSend={(val) => { setCurrentPage(val) }} currentPage={currentPage - 1} />
                    }
                </main>
                :
                <div className="map-layout">
                    <div className="map-section">
                        <AssignDriver
                            routeGeometry={singleData?.routeGeometry} // Pass GeoJSON data to MapComponent
                            start={[singleData?.startPoint?.longitude,singleData?.startPoint?.latitude]}
                            stops={singleData.stopsData.map((stop) => stop.coordinates)}
                            stopData={singleData.stopsData}
                            destination={[singleData?.endPoint?.longitude,singleData?.endPoint?.latitude]}
                            // destination={start?.coordinates}
                            routeName={singleData?.name}
                            routeId={singleData?.routeId}
                            startPoint={singleData?.startPoint?.address}
                            endPoint={singleData?.endPoint?.address}
                            dateSchedule={moment(singleData?.scheduleDate).format('DD MMM YYYY')}
                            timeSchedule={moment(singleData?.scheduleTime).format('hh:mm')}
                            isUpdate={false}
                            loading={loading}
                            title="Route Detail"
                            exportToCSV={() => {}}
                            printToPDF={() => { }}
                            onClickSave={(val) => {
               

                            }}


                        />
                    </div>

                </div>
            }
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="md"
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: "bold" }}>Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {/* Date Filter */}
                        <div>
                            <h6 className="mb-2" style={{ fontWeight: "600" }}>Date</h6>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {dateOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setSelectedDate(option)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "7px",
                                            border: selectedDate === option ? "1.5px solid #4770E4" : "1px solid #ccc",
                                            background: selectedDate === option ? "#F3F6FF" : "#fff",
                                            color: selectedDate === option ? "#4770E4" : "#555",
                                            fontWeight: selectedDate === option ? "400" : "400",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <h6 className="mb-2" style={{ fontWeight: "600" }}>Status</h6>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {statusOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setSelectedStatus(option)}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "7px",
                                            border: selectedStatus === option ? "1.5px solid #4770E4" : "1px solid #ccc",
                                            background: selectedStatus === option ? "#F3F6FF" : "#fff",
                                            color: selectedStatus === option ? "#4770E4" : "#555",
                                            fontWeight: selectedStatus === option ? "400" : "300",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                {/* Footer */}
                <Modal.Footer style={{ justifyContent: "space-between" }}>
                    <button
                        onClick={handleClear}
                        style={{
                            border: "1px solid #555",
                            background: "#fff",
                            borderRadius: "12px",
                            padding: "6px 16px",
                            fontWeight: "500",
                            cursor: "pointer",
                        }}
                    >
                        Clear all
                    </button>
                    <Button
                        onClick={() => setShowModal(false)}
                        style={{
                            background: "#4770E4",
                            border: "none",
                            borderRadius: "12px",
                            padding: "6px 16px",
                            fontWeight: "500",
                        }}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={!!enlargedImage}
                onHide={() => setEnlargedImage(null)}
                centered
                size="lg"
            >
                <Modal.Body style={{ padding: 0 }}>
                    {enlargedImage && (
                        <img
                            src={enlargedImage}
                            alt="Enlarged"
                            style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                        />
                    )}
                </Modal.Body>
            </Modal>
            <AssignDriverModal
                visible={showAssignDriverModal}
                onCancel={() => setShowAssignDriverModal(false)}
                routeId={singleData?._id}
                onAssign={(driverName) => {
                    console.log("Driver assigned:", driverName);
                    setShowAssignDriverModal(false);
                    fetchData()
                }}
            />
        </StyleSheetManager>
    )
}

export default SpeedyRoutesList;


const marketplaceCategories =
    [
        {
            id: '1',
            name: 'All Routes',

            desc: 'Find homes, apartments, and commercial properties.',
            value: 'all'
        },
        {
            id: '2',
            name: 'Current Route',

            desc: 'Buy and sell cars, motorcycles, and more.',
            value: 'current'
        },
        {
            id: '3',
            name: 'Route History',

            desc: 'Discover the latest gadgets and tech devices.',
            value: 'history'
        },



    ];
