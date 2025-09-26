/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Select, message } from 'antd';
import axios from 'axios';
import { ArrowLeft } from 'react-feather';
import { dataPost, dataPut } from '../utils/myAxios';

import { GoogleMap, LoadScript, Polygon, Autocomplete, Marker, useLoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyBfDZVFg0U-n_hYFwNRweeM7h69R_waYBg";
const EARTH_RADIUS = 6378137;


const CreateZones = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [addManualLatLng, setAddManualLatLng] = useState(true);
    const [input, setInput] = useState({
        title: '',
        latitude: '',
        longitude: '',
    });
    const [paths, setPaths] = useState([]); // Store the polygon coordinates
    const [isDrawing, setIsDrawing] = useState(true);
    const autocompleteRef = useRef(null);
    const [key, setKey] = useState(1);
    const [map, setMap] = useState(false);
    const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default center (New York City)
    const [markerPosition, setMarkerPosition] = useState(null);
    const [singleData, setSingleData] = useState(null);

    const navigate = useNavigate();

    const handleMapClick = (event) => {
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();

        if (isDrawing) {
            setPaths((prevPaths) => [...prevPaths, { lat, lng }]);
        }
    };


    useEffect(() => {
        const getZone = localStorage.getItem('zone_data')
        if (getZone) {
            console.log("GEt", getZone);

            let data = JSON.parse(getZone);
            setSingleData(data)
            console.log("Zone Data", data);
            let path_m = [];
            data.cords.forEach((element, index) => {
                let valuePush = {}
                valuePush['lat'] = element[1]
                valuePush['lng'] = element[0]
                path_m.push(valuePush)
                // if (index + 1 == paths.length) {
                //     path_m.push([paths[0].lng, paths[0].lat])
                // }
            });

            setCenter({
                lat: data?.location.coordinates[1], lng: data?.location?.coordinates[0]
            })

            setPaths(path_m)
            setMap(true)
            setInput(prevState => ({ ...prevState, 
                title: data?.title,
                latitude : data?.location.coordinates[1],
                longitude : data?.location.coordinates[0]
            }))
        }

        return () => {
            localStorage.removeItem('zone_data')
        }
    }, [])





    const handleStartDrawing = () => {
        setIsDrawing(true);
        setPaths([]); // Clear the previous polygon
    };

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    const handleFinishDrawing = () => {
        setIsDrawing(false);
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const { lat, lng } = place.geometry.location;
                const newCenter = { lat: lat(), lng: lng() };

                console.log("Center", newCenter);

                setCenter(newCenter);
                setMarkerPosition(newCenter);


                // map.panTo(newCenter);
            }
        }
    };

    const polygonOptions = {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: true, // Allows resizing and modifying the polygon
        draggable: true, // Allows moving the polygon
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        setIsProcessing(true);
        e.preventDefault();
        try {
            // const res = await axios.get(`${global.BASEURL}api/users/dashboard`, { headers });
            let path_m = []
            if (addManualLatLng) {
                var reg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");
                console.log("CE", reg.exec(parseFloat(input.latitude)));

                if (check_lat_lon(parseFloat(input.latitude), parseFloat(input.longitude))) {
                    //do nothing
                    // const distance = 40; // 20 meters
                    // const bearings = [0, 90, 180, 270];
                    // const coordinates = bearings.map((bearing) =>
                    //     getOffsetCoordinates(parseFloat(input.latitude), parseFloat(input.longitude), distance, bearing)
                    // );
                    // coordinates.push(coordinates[0]);
                    const centerLa = [parseFloat(input.longitude), parseFloat(input.latitude)]
                    const coordinates = generateCircleZone(centerLa, 20)
                    path_m = coordinates;
                    console.log("CE", coordinates);
                } else {
                    alert('Please enter valid latitude and longitude')
                    setIsProcessing(false);

                    return
                    //error
                }
            } else {
                if (paths.length < 4) {
                    alert('Please select atleast 4 corner to zones')
                    setIsProcessing(false);
                    return
                }
                console.log("CECE", paths);

                paths.forEach((element, index) => {
                    let valuePush = [element.lng, element.lat]
                    path_m.push(valuePush)
                    if (index + 1 == paths.length) {
                        path_m.push([paths[0].lng, paths[0].lat])
                    }
                });
            }
            console.log("Path m", path_m);
            const getZone = await localStorage.getItem('zone_data')

            const centerL = {
                type :"Point",
                coordinates :[parseFloat(input.longitude),parseFloat(input.latitude)],
            }
            const data = {
                title: input.title,
                cords: path_m,
                location : centerL
            }
            const data2 = {
                title: input.title,
                cords: path_m,
                id: singleData?._id,
                location : centerL
            }

            const endPoint = singleData ? 'general/admin/zone/update' : 'general/zone/create'
            console.log("End Point", endPoint);

            const res = singleData ? await dataPut(endPoint, data2) : await dataPost(endPoint, data);
            setIsProcessing(false);
            navigate('/zone');

        } catch (error) {
            console.log(error);
        } finally {

        }
        // navigate('/quiz/create-quiz/add-question', { state: { formData: formData } });
    };

    const getOffsetCoordinates = (lat, lon, distance, bearing) => {


        const angularDistance = distance / EARTH_RADIUS;
        const bearingRad = (bearing * Math.PI) / 180; // Convert bearing to radians

        const latRad = (lat * Math.PI) / 180;
        const lonRad = (lon * Math.PI) / 180;

        const newLatRad = Math.asin(
            Math.sin(latRad) * Math.cos(angularDistance) +
            Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
        );
        const newLonRad =
            lonRad +
            Math.atan2(
                Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
                Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(newLatRad)
            );

        const newLat = (newLatRad * 180) / Math.PI;
        const newLon = (newLonRad * 180) / Math.PI;


        return [newLon, newLat];
    }

    const generateCircleZone = (center, radius = 100, points = 20) => {
        const [lng, lat] = center;
        const coords = [];

        for (let i = 0; i < points; i++) {
            const angle = (i / points) * (2 * Math.PI);
            const dx = radius * Math.cos(angle);
            const dy = radius * Math.sin(angle);

            // Adjust longitude conversion based on latitude
            const newLng = lng + (dx / (111320 * Math.cos(lat * (Math.PI / 180))));
            const newLat = lat + (dy / 110540);

            coords.push([newLng, newLat]);
        }
        coords.push(coords[0]);

        return coords
    }

    const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;

    function check_lat_lon(lat, lon) {
        let validLat = regexLat.test(lat);
        let validLon = regexLon.test(lon);
        return validLat && validLon;
    }

    return (
        <main className='min-h-screen lg:container py-4 px-4 '>
            <div className="d-flex gap-4 align-items-start w-full">
                <div className="flex items-center gap-3">
                    <button type='button' onClick={() => { navigate('/zone') }} style={{ backgroundColor: '#000' }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                        <ArrowLeft className='text_white' />
                    </button>
                </div>
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_semibold text_black'>Create Zones</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
            </div>
            <Form onSubmit={handleSubmit} className="w-full bg_white rounded-3 shadow-md p-4">
                <Form.Group className='shadow_def mb-4'>
                    <Form.Label className="plusJakara_semibold text_dark">Title</Form.Label>
                    <Form.Control
                        type='input'
                        required
                        value={input.title}
                        onChange={(e) => setInput(prevState => ({ ...prevState, title: e?.target?.value }))}
                        // onChange={(e) => setQuizTime(e?.target?.value)}
                        style={{ padding: '10px 20px', }}
                        className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                        placeholder='Please enter title'
                    />

                    <Form.Label className="plusJakara_semibold text_dark"></Form.Label>

                    {map ?

                        <>
                            <div style={{ marginBottom: "10px" }}>
                                <Autocomplete
                                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                                    onPlaceChanged={onPlaceChanged}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search for a city or country"
                                        style={{
                                            width: "300px",
                                            height: "40px",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </Autocomplete>
                            </div>

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
                        </>


                        : null}
                        {singleData?
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div></div>
                        <button type='button' onClick={() => {
                            setPaths([])
                            setKey(pre => pre + 1)
                        }} style={{ backgroundColor: '#000', display: 'flex', alignSelf: 'flex-end' }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                            <span className="plusJakara_semibold text_white">Clear Zone</span>
                        </button>
                    </div>:null}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 50 }}>
                        <div></div>
                        {/* <Form.Label className="plusJakara_semibold text_dark">OR</Form.Label> */}
                        <div></div>

                    </div>
                    <Form.Label className="plusJakara_semibold text_dark"></Form.Label>
                    {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 1 }}>
                        <div></div>
                        <button type='button' onClick={() => {
                            if (addManualLatLng) {
                                setMap(true)
                                setAddManualLatLng(false)
                                window.location.reload();
                            } else {
                                setMap(false)
                                setAddManualLatLng(true)
                            }
                        }} style={{ backgroundColor: '#000' }} className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">{addManualLatLng ? "Create Map Zone" : "Add Manual Lat Lng"}</span>
                        </button>
                        <div></div>

                    </div> */}
                    {addManualLatLng ?
                        <>
                            <Form.Label className="plusJakara_semibold text_dark">Latitude</Form.Label>
                            <Form.Control
                                type='text'
                                value={input.latitude}
                                step="0.01"
                                onChange={(e) => setInput(prevState => ({ ...prevState, latitude: e?.target?.value }))}
                                // onChange={(e) => setQuizTime(e?.target?.value)}
                                style={{ padding: '10px 20px', }}
                                className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                placeholder='Please enter latitude'
                            />

                            <Form.Label className="plusJakara_semibold text_dark mt-4">Longitude</Form.Label>
                            <Form.Control
                                type='text'
                                value={input.longitude}
                                step="0.01"
                                onChange={(e) => setInput(prevState => ({ ...prevState, longitude: e?.target?.value }))}
                                // onChange={(e) => setQuizTime(e?.target?.value)}
                                style={{ padding: '10px 20px', }}
                                className='custom_control rounded-4 plusJakara_regular text_secondarydark bg_white shadow-sm border'
                                placeholder='Please enter longitude'
                            />
                        </> : null}
                </Form.Group>
                <div className="flex justify-end my-4 w-full mt-3">
                    {!isProcessing ? (
                        <button type='submit' style={{ backgroundColor: '#000' }} className="flex justify-center bg_primary py-3 px-4 rounded-3 items-center">
                            <span className="plusJakara_semibold text_white">{singleData ? 'Update Zone' : 'Add Zone'}</span>
                        </button>
                    ) : (
                        <button type='button' disabled={isProcessing} style={{ backgroundColor: '#000' }} className="flex justify-center bg_primary py-3 px-5 rounded-3 items-center">
                            <CircularProgress size={18} className='text_white' />
                        </button>
                    )}
                </div>
            </Form>
        </main>
    )
}

export default CreateZones


const testData = [
    {
        id: '2',
        name: 'Psych Tests'
    },
    {
        id: '3 ',
        name: 'Pychopathy Test'
    },
]