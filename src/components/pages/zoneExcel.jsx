/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTableFetch from '../DataTable/productTableFetch';
import { dataTable } from '../DataTable/productsData';
import { avatarman, preview, trash, edit2 } from '../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataDelete, dataGet_ } from '../utils/myAxios';
import { useNavigate } from 'react-router-dom';
import { Accordion, Button, Form, Modal } from 'react-bootstrap';
import { GoogleMap, LoadScript, Polygon, Autocomplete, Marker, useLoadScript,useJsApiLoader } from "@react-google-maps/api";
const GOOGLE_MAPS_API_KEY = "AIzaSyBfDZVFg0U-n_hYFwNRweeM7h69R_waYBg";

const ZoneExcel = (props) => {
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

    const columns = [
        {
            name: 'Vehicle Type',
            sortable: true,
            width: '200',
            selector: row => row?.vehicle_type
        },
        {
            name: 'Severity',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ padding:20,display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:row?.severity_color =='gray'?'#C0C0C0':row?.severity_color,borderRadius:6 }}>
                        <span style={{color:row?.severity_color =='#FF0000' || row?.severity_color =='#008000'?'white':'black',fontSize:14,fontWeight:'bold'}}>{row?.severity}</span>
                    </div>
                )
            }
        },

        {
            name: 'Lat/Lng',
            sortable: true,
            width: '200',
            selector: row => row?.location?.coordinates[1]+' ,'+row?.location?.coordinates[0]
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ flexDirection: 'row', flex: 'row', justifyContent: 'space-between' }}>
                        {/* <button onClick={() => moveNext(row)} className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={edit2} alt="" /></button> */}
                        {/* <button onClick={() => deleteData(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button> */}
                        <button onClick={() => viewMap(row)} className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button>

                    </div>
                )
            }
        },
    ]

    const viewMap = (itemData) => {
        console.log("EK",key);
        let path_m=[];
        itemData.cords.forEach((element, index) => {
            let valuePush = {}
            valuePush['lat'] = element[1]
            valuePush['lng'] = element[0]
            if (index + 1 == itemData.cords.length) {
                
            }else{
            path_m.push(valuePush)

            }
        });

        setCenter({
            lat: path_m[0]?.lat, lng: path_m[0]?.lng 
        })
        console.log("PAT",path_m);
        setTimeout(() => {
            setPaths(path_m)            
        }, 700);
        
        setKey((prev) => prev + 1);
        setShowModal(true)
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            let allData = [];
                let data1 = {}
                const endPoint = `general/admin/zone/get_large/${currentPage}`
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
            const endPoint = `general/admin/zone/${id}`
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
                        <h2 className='plusJakara_bold text_black'>Accident Data</h2>
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

export default ZoneExcel;