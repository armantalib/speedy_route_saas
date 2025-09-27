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
import DriverStats from './DriverStats';
import AddDriverModal from './AddDriverModal';
import styles from "./DriverTable.module.css";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Table, Tag, Avatar, Button, Input } from "antd";
import { formatSecondsToHMS } from '../../utils/DateTimeCustom';
import PODDetailsModal from './PODDetailsModal';
import { useDispatch } from 'react-redux';
import { setHeaderName } from '../../../storeTolkit/userSlice';
const ProfDeliveryList = (props) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false)
    const [paths, setPaths] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [search, setSearch] = useState('');
    const [data, setData] = useState([])
    const [map, setMap] = useState(true);
    const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 });
    const [singleData, setSingleData] = useState(null);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [key, setKey] = useState(1);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedDate, setSelectedDate] = useState("Today");
    const [selectedStatus, setSelectedStatus] = useState("Completed");
    const [selectedDriver, setSelectedDriver] = useState(null);
      const dispatch = useDispatch();
  dispatch(setHeaderName('Prof Of Delivery'))

    // new driver modal states
    const [showNewDriverModal, setShowNewDriverModal] = useState(false);
    const [showDriverDetail, setShowDriverDetail] = useState(false);
    const [newDriver, setNewDriver] = useState({
        name: "",
        email: "",
        phone: "",
        tags: [],
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    const dateOptions = ["Today", "Yesterday", "Last 7 Days", "Last Month"];
    const statusOptions = ["Completed", "In Progress", "Failed", "Cancelled"];

    const handleDriverChange = (e) => {
        const { name, value } = e.target;
        setNewDriver(prev => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setNewDriver(prev => ({ ...prev, tags: selected }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewDriver(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveDriver = async () => {
        try {
            const formData = new FormData();
            formData.append("name", newDriver.name);
            formData.append("email", newDriver.email);
            formData.append("phone", newDriver.phone);
            formData.append("tags", JSON.stringify(newDriver.tags));
            if (newDriver.image) formData.append("image", newDriver.image);

            // Example API call
            // await dataPost("drivers/create", formData);

            alert("Driver saved successfully!");
            setShowNewDriverModal(false);
            setNewDriver({ name: "", email: "", phone: "", tags: [], image: null });
            setImagePreview(null);
        } catch (err) {
            console.error(err);
            alert("Failed to save driver.");
        }
    };

    const StatusToggler = ({ row }) => {
        const [isActive, setIsActive] = useState(row.status === 'active');

        const handleToggle = async () => {
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
                    height={18}
                    width={36}
                    onColor="#4949E8"
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
            name: 'ID',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        setSingleData(row)
                        setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{row?.routeId}</p>
                    </div>
                )
            }
        },
        {
            name: 'Name',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {

                        setSingleData(row)
                        setSelectedDriver(row)
                        setShowDriverDetail(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{row?.driver?.name}</p>
                    </div>
                )
            }
        },
        {
            name: 'Status',
            allowoverflow: true,
            width: '250px',
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
            width: '250px',
            selector: row => formatSecondsToHMS(row?.duration)
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ flexDirection: 'row', flex: 'row', justifyContent: 'space-between' }}>
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14, color: '#4770E4', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => {
                            setSingleData(row)
                            setSelectedDriver(row)
                            setShowDriverDetail(true)
                        }}>{'View Detail'}</p>
                    </div>
                )
            }
        },
    ]

    const fetchData = async () => {
        setLoading(true);
        try {
            let allData = [];
            let data1 = {}
            const endPoint = `routes/admin/prof/list/${currentPage}?category=${selectedCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&search=${search}`;
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

    useEffect(() => {
        fetchData();
    }, [currentPage, selectedCategory, minPrice, search]);

    const handleClear = () => {
        setSelectedDate(null);
        setSelectedStatus(null);
    };

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">

                <div className="flex justify-between gap-3 items-center w-full">
                    {/* <div className="flex flex-col mb-3 w-full">
                        <h2 className='plusJakara_bold text_black'>Prof Of Delivery</h2>
                        <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                    </div> */}
                    {/* <button
                        onClick={() => setShowNewDriverModal(true)}
                        style={{ width: '150px', backgroundColor: '#6688E8' }}
                        className="bg_primary py-3 rounded-4 text_white plusKajara_semibold"
                    >
                        New Driver
                    </button> */}
                </div>
                <div className={styles.tableHeader}>
                    <h3></h3>
                    <div>
                        <Input.Search
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: 200, marginRight: 10 }}
                        />
                        <Button type="default">Filter</Button>
                        {/* <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            style={{ marginLeft: 10 }}
                            onClick={() => setShowNewDriverModal(true)}
                        >
                            Add New
                        </Button> */}
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

            {/* Existing Filter Modal */}
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
                                            fontWeight: "400",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

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
                                            fontWeight: "400",
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

            {/* New Driver Modal */}
            <AddDriverModal
                visible={showNewDriverModal}
                onCancel={() => setShowNewDriverModal(false)}
                onClose={() => {
                    setShowNewDriverModal(false);
                    fetchData();
                }}
            />
            <PODDetailsModal
                visible={showDriverDetail}
                data={selectedDriver}
                onClose={() => {
                    setSelectedDriver(null)
                    setShowDriverDetail(false)
                }
                }
            />
        </StyleSheetManager>
    )
}

export default ProfDeliveryList;

const marketplaceCategories = [
    { id: '1', name: 'All Routes', desc: 'Find homes, apartments, and commercial properties.', value: 'all' },
    { id: '2', name: 'Current Route', desc: 'Buy and sell cars, motorcycles, and more.', value: 'current' },
    { id: '3', name: 'Route History', desc: 'Discover the latest gadgets and tech devices.', value: 'history' },
];
