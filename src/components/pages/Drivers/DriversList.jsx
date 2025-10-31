/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTableFetch from '../../DataTable/productTableFetch';
import { dataTable } from '../../DataTable/productsData';
import { avatar1, preview, trash, edit2, edit_icon } from '../../icons/icon';
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
import DriverDetailsModal from './DriverDetailsModal';
import { useDispatch } from 'react-redux';
import { setHeaderName } from '../../../storeTolkit/userSlice';
import EditDataModal from './EditDataModal';
const DriversList = (props) => {
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
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [isEditForm, setIsEditForm] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [driverToDelete, setDriverToDelete] = useState(null);
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
    const dispatch = useDispatch();
    dispatch(setHeaderName('Drivers'))
    const user_type = localStorage.getItem('user_type')

    const dateOptions = ["Today", "Yesterday", "Last 7 Days", "Last Month"];
     const statusOptions = ["active", "deactivated"];

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
            name: 'Name',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        console.log("Ec", row);

                        setSingleData(row)
                        setSelectedDriver(row)
                        setShowDriverDetail(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{row?.name}</p>
                    </div>
                )
            }
        },
      {
            name: 'Email',
            sortable: true,
            width: '250px',
            selector: row => row?.email
        },
           {
            name: 'Phone',
            sortable: true,
            width: '200px',
            selector: row => row?.phone
        },
         {
            name: 'Status',
            allowoverflow: true,
            width: '290px',
            cell: (row) => {
                return (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: row?.status == 'deactivated' ? '#FEF9C3' : '#EDFEED',
                        padding: 6, borderRadius: 10, paddingLeft: 15, paddingRight: 15
                    }}>
                        <span style={{
                            fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize',
                            color: row?.status == 'deactivated' ? '#CA8A04' : '#22C55E'
                        }}>{row?.status=='online'?'Active':'Inactive'}</span>
                    </div>
                )
            }
        },
      {
            name: 'App Permission',
            sortable: true,
            width: '290px',
            selector: row => row?.isAppAllow?'Allow':'Not Allow'
        },
    
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ flexDirection: 'row', flex: 'row', justifyContent: 'space-between' }}>
                       <button className="flex justify-center rounded-3 w-[34px] h-[34px] items-center"><img className="w-[24px] h-auto" src={edit_icon} onClick={() => {
                                                setSingleData(row)
                                                setIsEditForm(true)
                                            }} alt="" /></button>
                        {/* <button className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} onClick={()=>{
                            handleDeleteClick(row)
                        }} alt="" /></button> */}

                    </div>
                )
            }
        },
    ]
     const columnsDis = [

        {
            name: 'Name',
            allowoverflow: true,
            width: '290px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        console.log("Ec", row);

                        setSingleData(row)
                        setSelectedDriver(row)
                        setShowDriverDetail(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                        <p style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 14 }}>{row?.name}</p>
                    </div>
                )
            }
        },
             {
            name: 'Email',
            sortable: true,
            width: '250px',
            selector: row => row?.email
        },
           {
            name: 'Phone',
            sortable: true,
            width: '200px',
            selector: row => row?.phone
        },
        {
            name: 'Status',
            allowoverflow: true,
            width: '290px',
            cell: (row) => {
                return (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: row?.status == 'deactivated' ? '#FEF9C3' : '#EDFEED',
                        padding: 6, borderRadius: 10, paddingLeft: 15, paddingRight: 15
                    }}>
                        <span style={{
                            fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize',
                            color: row?.status == 'deactivated' ? '#CA8A04' : '#22C55E'
                        }}>{row?.status=='online'?'Active':'Deactivated'}</span>
                    </div>
                )
            }
        },
     {
            name: 'App Permission',
            sortable: true,
            width: '290px',
            selector: row => row?.isAppAllow?'Allow':'Not Allow'
        },
    
     
    ]

    const fetchData = async () => {
        setLoading(true);
        try {
            let allData = [];
            let data1 = {}
            const endPoint = `users/admin/driver/all/${currentPage}/${search}?category=${selectedCategory}&search=${search}`;
            const res = await dataGet_(endPoint, data1);

            if (res?.data) {
                allData = allData.concat(res?.data?.data);
    
                setTotalPages(res?.data?.count?.totalPage||1);
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
const handleDeleteClick = (driver) => {
  setDriverToDelete(driver);
  setShowDeleteModal(true);
};

const handleConfirmDelete = async () => {
  try {
    if (!driverToDelete) return;
    const endpoint = `users/${driverToDelete._id}`;
    await dataDelete(endpoint,{});
    setShowDeleteModal(false);
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Failed to delete driver");
  }
};

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            {/* <DriverStats />  */}
            <main className="min-h-screen lg:container mt-5 py-1 px-4 mx-auto">

                <div className="flex justify-between gap-3 items-center w-full">
                    {/* <div className="flex flex-col mb-3 w-full">
                        <h2 className='plusJakara_bold text_black'>Drivers</h2>
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
                        <Button type="default"
                        onClick={()=>{
                              setShowModal(true)
                        }}
                        >Filter</Button>
                        {user_type =='dispatcher'?null:
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            style={{ marginLeft: 10 }}
                            onClick={() => setShowNewDriverModal(true)}
                        >
                            Add New
                        </Button>
}
                    </div>
                </div>



                {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !data || data.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Dates Found</span>
                        </main> :
                        <ProductTableFetch columns={user_type==='dispatcher'?columnsDis:columns} showFilter={true} data={data} totalPage={totalPages} currentPageSend={(val) => { setCurrentPage(val) }} currentPage={currentPage - 1} />
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
                            <h6 className="mb-2" style={{ fontWeight: "600" }}>Status</h6>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                {statusOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSelectedStatus(option)
                                            if (option == 'active') {
                                                setSearch('online')
                                            } else {
                                                setSearch(option)
                                            }
                                        }}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: "7px",
                                            border: selectedStatus === option ? "1.5px solid #4770E4" : "1px solid #ccc",
                                            background: selectedStatus === option ? "#F3F6FF" : "#fff",
                                            color: selectedStatus === option ? "#4770E4" : "#555",
                                            fontWeight: "400",
                                            cursor: "pointer",
                                            textTransform: "capitalize", // ✅ makes text capitalize
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
                            color: "white"
                        }}
                    >
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
                size="md"
            >
      
                <Modal.Body>
                    <div style={{ textAlign: "center", padding: "20px 10px" }}>
                        <div
                            style={{
                                backgroundColor: "#FFF1F0",
                                width: 70,
                                height: 70,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 15px auto",
                            }}
                        >
                            <DeleteOutlined style={{ color: "#F87171", fontSize: 28 }} />
                        </div>

                        <h2 style={{ marginBottom: 10 }}>Delete Driver</h2>
                        <p style={{ color: "#666", marginBottom: 30 }}>
                            Are you sure you want to delete this? This action cannot be undone.
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    width: "48%",
                                    height: 40,
                                    borderRadius: 8,
                                    border: "1px solid #ccc",
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                danger
                                onClick={handleConfirmDelete}
                                style={{
                                    width: "48%",
                                    height: 40,
                                    borderRadius: 8,
                                    backgroundColor: "#F87171",
                                    border: "none",
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
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
            <EditDataModal
                visible={isEditForm}
                dataFill={isEditForm ? singleData : null}
                onCancel={() => setIsEditForm(false)}
                onClose={() => {
                    console.log("Click Close");

                    setIsEditForm(false);
                    fetchData();
                }}
            />
            <DriverDetailsModal
                visible={showDriverDetail}
                driver={selectedDriver}
                onClose={() => {
                    setSelectedDriver(null)
                    setShowDriverDetail(false)
                }
                }
            />


        </StyleSheetManager>
    )
}

export default DriversList;

const marketplaceCategories = [
    { id: '1', name: 'All Routes', desc: 'Find homes, apartments, and commercial properties.', value: 'all' },
    { id: '2', name: 'Current Route', desc: 'Buy and sell cars, motorcycles, and more.', value: 'current' },
    { id: '3', name: 'Route History', desc: 'Discover the latest gadgets and tech devices.', value: 'history' },
];
