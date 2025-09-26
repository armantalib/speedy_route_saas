/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTableFetch from '../DataTable/productTableFetch';
import { dataTable } from '../DataTable/productsData';
import { avatar1, preview, trash, edit2 } from '../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataDelete, dataGet_, dataPut } from '../utils/myAxios';
import { useNavigate } from 'react-router-dom';
import { Accordion, Button, Form, Modal } from 'react-bootstrap';
import { GoogleMap, LoadScript, Polygon, Autocomplete, Marker, useLoadScript,useJsApiLoader } from "@react-google-maps/api";
import Switch from 'react-switch';
const Community = (props) => {
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
    const [markerPosition, setMarkerPosition] = useState(null);
    const [key, setKey] = useState(1);
    // const { isLoaded } = useJsApiLoader({
    //     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    //   });



        const StatusToggler = ({ row }) => {
            const [isActive, setIsActive] = useState(row.status === 'active');
    
            const handleToggle = async () => {
                // axiosInstanceApi.put(`/users/update/${row._id}/${isActive ? 'deactivated' : 'online'}`)
                const endPoint = `general/admin/community/update/${row._id}/${isActive ? 'deactivated' : 'active'}`
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
                        {isActive ? 'Approve' : 'Reject'}
                    </span>
                </div>
            );
        };

    const columns = [
        {
            name: 'User Name',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                        <span style={{marginLeft:10}}>{row?.user?.name}</span>
                    </div>
                )
            }
        },
        {
            name: 'Name',
            sortable: true,
            width: '200',
            selector: row => row?.name
        },
        {
            name: 'Location',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ padding:20,display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:row?.severity_color =='gray'?'#C0C0C0':row?.severity_color,borderRadius:6 }}>
                        <span style={{}}>{row?.location?.address}</span>
                    </div>
                )
            }
        },
        {
            name: 'Description',
            sortable: true,
            width: '200',
            selector: row => row?.desc
        },
        {
            name: 'Lat/Lng',
            sortable: true,
            width: '200',
            selector: row => row?.location?.latitude+' ,'+row?.location?.longitude
        },
        {
            name: "Approve/Reject",
            sortable: true,
            minWidth: '120px',
            selector: (row) => <StatusToggler row={row} />,
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ flexDirection: 'row', flex: 'row', justifyContent: 'space-between' }}>
                        {/* <button onClick={() => moveNext(row)} className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={edit2} alt="" /></button> */}
                        <button onClick={() => viewMap(row)} className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button>
                        {/* <button onClick={() => deleteData(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button> */}

                    </div>
                )
            }
        },
    ]

    const viewMap = (item) => {
        let newCenter ={
            lat: parseFloat(item?.location.latitude), lng: parseFloat(item?.location.longitude) 
        }
        setCenter(newCenter)
        setMarkerPosition(newCenter);
        // setKey((prev) => prev + 1);
        setShowModal(true)
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            let allData = [];
                let data1 = {}
                const endPoint = `general/admin/community/${currentPage}`
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
            const endPoint = `general/community/${id}`
            const res = await dataDelete(endPoint, data1);
            fetchData()
        }

    }

    const moveNext = async (item) => {
        localStorage.setItem('zone_data', JSON.stringify(item))
        navigate('/zone/create');
    }

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const polygonOptions = {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true, // Allows resizing and modifying the polygon
        draggable: true, // Allows moving the polygon
    };
    const handleMapClick = (event) => {
        
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();

        if (isDrawing) {
            
            setPaths((prevPaths) => [...prevPaths, { lat, lng }]);
            console.log("CE",paths);

        }
    };


    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">

                <div className="flex justify-between gap-3 items-center w-full">
                    <div className="flex flex-col mb-3 w-full">
                        <h2 className='plusJakara_bold text_black'>Communities List</h2>
                        <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                    </div>
                    {/* <button onClick={() => {
                        navigate('/zone/create')

                        window.location.reload();

                    }} style={{ width: '150px', backgroundColor: '#000' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Zones</button> */}
                </div>
                {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !data || data.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Dates Found</span>
                        </main> :
                        <ProductTableFetch columns={columns} showFilter={true} data={data} totalPage={totalPages} currentPageSend={(val)=>{setCurrentPage(val)}} currentPage={currentPage-1} />
                }
            </main>

            <Modal show={showModal} onHide={() => {
                setShowModal(false)
                setPaths([])
                const script = document.querySelector("script[src*='maps.googleapis.com']");
                if (script) script.remove();
                }} centered>
                <Modal.Body>
                    <Modal.Header closeButton />
                    {map ?
               
                            <GoogleMap
                                mapContainerStyle={{ height: "500px", width: "100%" }}
                                center={center}
                                zoom={17}
                                key={key}
                                onClick={handleMapClick}
                            >
                                {markerPosition && <Marker position={markerPosition} text="📍" />}
                                {/* Draw the polygon if there are paths */}
                                {paths.length > 0 && <Polygon paths={paths} options={polygonOptions} />}

                            </GoogleMap>


                        : null}
                </Modal.Body>
            </Modal>
        </StyleSheetManager>
    )
}

export default Community;