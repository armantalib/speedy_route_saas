/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTableFetch from '../../DataTable/productTableFetch';
import { avatar1, preview, trash, edit2 } from '../../icons/icon';
import { StyleSheetManager } from 'styled-components';
import { CircularProgress } from '@mui/material';
import { dataGet_, dataPut } from '../../utils/myAxios';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import AssignDriverModal from '../AssignDriver/AssignDriverModal';
import { formatSecondsToHMS } from '../../utils/DateTimeCustom';
import { useDispatch } from 'react-redux';
import { setHeaderName } from '../../../storeTolkit/userSlice';
import styles2 from "../Drivers/DriverTable.module.css";
import { Button, Input, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { setRouteDetail } from '../../../storeTolkit/routeSlice';
import AssignDriver from '../AssignDriver/AssignDriver';
import CustomDateModal from './CustomDateModal';

const { RangePicker } = DatePicker;

const SpeedyRoutesList = (props) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState('');
    const [data, setData] = useState([])
    const [singleData, setSingleData] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
    const [routeDetailsShow, setRouteDetailsShow] = useState(false);
    const [customDateRange, setCustomDateRange] = useState(null);
    const dispatch = useDispatch();
    dispatch(setHeaderName('Routes'))

    const dateOptions = ["Today", "Yesterday", "Last 7 Days", "Custom Days"];
    const statusOptions = ["completed","assigned", "in-progress", "draft"];

    const columns = [
        {
            name: 'Date',
            allowoverflow: true,
            width: '250px',
            cell: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>
                        {moment(row.scheduleDate).format('DD MMM')}
                    </p>
                </div>
            )
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
            cell: (row) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                        row?.status === 'draft' ? '#E8E8E9' :
                            row?.status === 'assigned' ? '#FEF9C3' :
                                '#EDFEED',
                    padding: 6,
                    borderRadius: 10,
                    paddingLeft: 15,
                    paddingRight: 15
                }}>
                    <span style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                        textTransform: 'capitalize',
                        color:
                            row?.status === 'draft' ? '#18181B' :
                                row?.status === 'assigned' ? '#CA8A04' :
                                    '#22C55E'
                    }}>{row?.status}</span>
                </div>
            )
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
            cell: (row) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{
                        marginLeft: 10,
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#4770E4',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                        onClick={() => moveNext(row)}
                    >Edit</p>
                    <p style={{
                        marginLeft: 10,
                        fontWeight: 'bold',
                        fontSize: 14,
                        color: '#4770E4',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }} onClick={() => {
                        setSingleData(row)
                        setShowAssignDriverModal(true)
                    }}>Assign Route</p>
                    <p
                        onClick={() => {
                            setSingleData(row)
                            dispatch(setRouteDetail(row))
                            navigate('/route-detail')
                            // setRouteDetailsShow(true)
                        }}
                        style={{
                            marginLeft: 10,
                            fontWeight: 'bold',
                            fontSize: 14,
                            color: '#73757C',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}>Details</p>
                </div>
            )
        },
    ]

    const fetchData = async () => {
        setLoading(true);
        try {
            const startDate = customDateRange ? moment(customDateRange[0]).format('YYYY-MM-DD') : '';
            const endDate = customDateRange ? moment(customDateRange[1]).format('YYYY-MM-DD') : '';
            const endPoint = `routes/admin/list/${currentPage}?search=${search}&dateType=${selectedDate}&startDate=${startDate}&endDate=${endDate}&status=${selectedStatus}`;
            const res = await dataGet_(endPoint, {});
            if (res?.data?.data) {
                setData(res.data.data);
                setTotalPages(res.data.count?.totalPage || 1);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const moveNext = (item) => {
        dispatch(setRouteDetail(item))
        navigate('/route/form');
    }

    useEffect(() => {
        if (selectedDate === 'Custom Days') {
            setShowModal(false)
            setEnlargedImage(true)
            return
        }
        fetchData();
    }, [currentPage, selectedDate, selectedStatus, search, customDateRange]);

    const handleClear = () => {
        setSelectedDate("");
        setSelectedStatus("");
        setCustomDateRange(null);
        setShowModal(false)
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
                            <Button type="default" onClick={() => setShowModal(true)}>Filter</Button>
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

                    {loading ? (
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <CircularProgress size={24} className='text_dark' />
                        </main>
                    ) : !data || data.length === 0 ? (
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Data Found</span>
                        </main>
                    ) : (
                        <ProductTableFetch
                            columns={columns}
                            showFilter={true}
                            data={data}
                            totalPage={totalPages}
                            currentPageSend={(val) => setCurrentPage(val)}
                            currentPage={currentPage - 1}
                        />
                    )}
                </main>
                :
                <div className="map-layout">
                    <div className="map-section">
                        <AssignDriver
                            routeGeometry={singleData?.routeGeometry}
                            start={[singleData?.startPoint?.longitude, singleData?.startPoint?.latitude]}
                            stops={singleData?.stopsData?.map((stop) => stop.coordinates)}
                            stopData={singleData?.stopsData}
                            destination={[singleData?.endPoint?.longitude, singleData?.endPoint?.latitude]}
                            routeName={singleData?.name}
                            routeId={singleData?.routeId}
                            startPoint={singleData?.startPoint?.address}
                            endPoint={singleData?.endPoint?.address}
                            dateSchedule={moment(singleData?.scheduleDate).format('DD MMM YYYY')}
                            timeSchedule={moment(singleData?.scheduleTime).format('hh:mm')}
                            isUpdate={false}
                            loading={loading}
                            title="Route Detail"
                        />
                    </div>
                </div>
            }


            {/* Filter Modal */}
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
                                        onClick={() => {
                                            setSelectedDate(option)
                                            if(option==='Custom Days'){
                                                setEnlargedImage(true)
                                            }
                                             setShowModal(false)
                                        
                                        }
                                        
                                        }
                                            
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "7px",
                                            border: selectedDate === option ? "1.5px solid #4770E4" : "1px solid #ccc",
                                            background: selectedDate === option ? "#F3F6FF" : "#fff",
                                            color: selectedDate === option ? "#4770E4" : "#555",
                                            fontWeight: selectedDate === option ? "400" : "400",
                                            cursor: "pointer",
                                         textTransform: "capitalize",
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
                                        onClick={() => {
                                            setShowModal(false)
                                            setSelectedStatus(option)}}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "7px",
                                            border: selectedStatus === option ? "1.5px solid #4770E4" : "1px solid #ccc",
                                            background: selectedStatus === option ? "#F3F6FF" : "#fff",
                                            color: selectedStatus === option ? "#4770E4" : "#555",
                                            fontWeight: selectedStatus === option ? "400" : "300",
                                            cursor: "pointer",
                                         
                                                         textTransform: "capitalize",
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
                        onClick={() => {
                            setShowModal(false);
                            fetchData();
                        }}
                        style={{
                            background: "#4770E4",
                            border: "none",
                            borderRadius: "12px",
                            padding: "6px 16px",
                            fontWeight: "500",
                            color:"white"
                        }}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Image Preview Modal */}
     <CustomDateModal
        enlargedImage={enlargedImage}
        setEnlargedImage={setEnlargedImage}
        selectedDate={selectedDate}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
        fetchData={fetchData}
      />

            <AssignDriverModal
                visible={showAssignDriverModal}
                onCancel={() => setShowAssignDriverModal(false)}
                routeId={singleData?.routeId}
                onAssign={() => {
                    setShowAssignDriverModal(false);
                    fetchData();
                }}
            />
            <CustomDateModal/>
        </StyleSheetManager>
    )
}

export default SpeedyRoutesList;
