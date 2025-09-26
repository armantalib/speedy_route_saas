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
import { GoogleMap, LoadScript, Polygon, Autocomplete, Marker, useLoadScript, useJsApiLoader } from "@react-google-maps/api";
import Switch from 'react-switch';
const MarketplacePost = (props) => {
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
            name: 'User Name',
            allowoverflow: true,
            width: '250px',
            cell: (row) => {
                return (
                    <div onClick={() => {
                        setSingleData(row)
                        setShowModal(true)
                    }} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        <img src={row?.user?.image ? row?.user?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                        <span style={{ marginLeft: 10 }}>{row?.user?.name}</span>
                    </div>
                )
            }
        },
        {
            name: 'Title',
            sortable: true,
            width: '300px',
            selector: row => row?.title
        },
        {
            name: 'Description',
            sortable: true,
            width: '430px',
            selector: row => row?.desc
        },
        {
            name: 'Category',
            sortable: true,
            width: '130px',
            selector: row => row?.category
        },
        {
            name: 'Price',
            sortable: true,
            width: '130px',
            selector: row => row?.price
        },

        {
            name: "Active/DeActive",
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
                        <button onClick={() => deleteData(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>

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
            const endPoint = `marketplace/admin/marketplace/${currentPage}?category=${selectedCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&search=${search}`;
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
        localStorage.setItem('zone_data', JSON.stringify(item))
        navigate('/zone/create');
    }

    useEffect(() => {
        fetchData();
    }, [currentPage,selectedCategory,minPrice,maxPrice]);

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
            console.log("CE", paths);

        }
    };


    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">

                <div className="flex justify-between gap-3 items-center w-full">
                    <div className="flex flex-col mb-3 w-full">
                        <h2 className='plusJakara_bold text_black'>Marketplace Post List</h2>
                        <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                    </div>
                    {/* <button onClick={() => {
                        navigate('/zone/create')

                        window.location.reload();

                    }} style={{ width: '150px', backgroundColor: '#000' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Zones</button> */}
                </div>
                <div className="mb-4 d-flex flex-wrap align-items-center gap-3">
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ width: 200 }}
                    >
                        <option value="">All Categories</option>
                        {marketplaceCategories.map((cat, idx) => (
                            <option key={idx} value={cat.value}>{cat.name}</option>
                        ))}
                    </Form.Select>

                    <Form.Control
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={{ width: 150 }}
                    />
                    <Form.Control
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={{ width: 150 }}
                    />
                    <Button variant="secondary" onClick={() => {
                        setSelectedCategory('');
                        setMinPrice('');
                        setMaxPrice('');
                    }}>Reset</Button>
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

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setPaths([]);
                    const script = document.querySelector("script[src*='maps.googleapis.com']");
                    if (script) script.remove();
                }}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Post Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {singleData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* User Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img
                                    src={singleData?.user?.image || avatar1}
                                    alt="User"
                                    style={{
                                        borderRadius: '100%',
                                        width: 60,
                                        height: 60,
                                        objectFit: 'cover',
                                    }}
                                />
                                <div>
                                    <h5 style={{ margin: 0 }}>{singleData?.user?.name}</h5>
                                    <small style={{ color: 'gray' }}>{singleData?.user?.email}</small>
                                </div>
                            </div>

                            {/* Title, Category, Status */}
                            <div>
                                <h6 className="mb-1">Post Information:</h6>
                                <p><strong>Title:</strong> {singleData?.title}</p>
                                <p><strong>Category:</strong> {singleData?.category} → {singleData?.sub_category}</p>
                                <p><strong>Status:</strong> {singleData?.status}</p>
                            </div>

                            {/* Description */}
                            <div>
                                <h6 className="mb-1">Description:</h6>
                                <p style={{ whiteSpace: 'pre-line' }}>{singleData?.desc}</p>
                            </div>

                            {/* Vehicle/Property Details */}
                            {singleData?.details && (
                                <div>
                                    <h6 className="mb-2">Details:</h6>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {Object.entries(singleData.details).map(([key, value]) => (
                                            <div key={key} style={{ minWidth: '120px' }}>
                                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div>
                                <h6 className="mb-1">Pricing:</h6>
                                <p><strong>Price:</strong> ${singleData?.price?.toLocaleString()}</p>
                                {singleData?.additionalPriceInfo && (
                                    <p><strong>Additional Info:</strong> {singleData?.additionalPriceInfo}</p>
                                )}
                            </div>

                            {/* Images with Click-to-Enlarge */}
                            {singleData?.images && singleData?.images.length > 0 && (
                                <div>
                                    <h6 className="mb-2">Images:</h6>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {singleData.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Post Img ${idx + 1}`}
                                                onClick={() => setEnlargedImage(img)}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 10,
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>No data found</p>
                    )}
                </Modal.Body>
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
        </StyleSheetManager>
    )
}

export default MarketplacePost;


const marketplaceCategories =
[
    {
        id :'1',
        name:'Real State',

        desc:'Find homes, apartments, and commercial properties.',
        value:'real_state'
    },
    {
        id :'2',
        name:'Vehicles',

        desc:'Buy and sell cars, motorcycles, and more.',
        value:'vehicles'
    },
    {
        id :'3',
        name:'Electronics',

        desc:'Discover the latest gadgets and tech devices.',
        value:'electronic'
    },
    {
        id :'4',
        name:'Jobs',

        desc:'Explore job opportunities in various industries.',
        value:'jobs'
    },
    {
        id :'5',
        name:'Services',

        desc:'Find services from local businesses and professionals.',
        value:'services'
    },
    {
        id :'6',
        name:'Fashion & Accesories',

        desc:'Shop clothing, footwear, and accessories for all.',
        value:'fashion'
    },
    {
        id :'6',
        name:'Home & Garden',

        desc:'Upgrade your home with furniture, decor, and tools.',
        value:'home'
    },
    {
        id :'7',
        name:'Pets',

        desc:'Adopt pets or find grooming and pet accessories.',
        value:'pets'
    },
    {
        id :'8',
        name:'Books & Magazines',

        desc:'Browse books, comics, and magazines.',
        value:'books'
    },
    {
        id :'9',
        name:'Kids & Babies',

        desc:"Shop for baby gear, toys, and kids' products.",
        value:'kids'
    },
    {
        id :'9',
        name:'Sports & Fitness',

        desc:"Get fitness gear, apparel, and personal training.",
        value:'sports'
    },
   
];
