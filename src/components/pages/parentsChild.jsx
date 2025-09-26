/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTable from '../DataTable/productTable';
import { dataTable } from '../DataTable/productsData';
import { avatarman, preview, trash } from '../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';

const ParentsChild = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const [loading, setLoading] = useState(false)
    const ParentsData = state?.parentData || []
    const [categories, setCategories] = useState([])

    const columns = [
        // {
        //     name: 'No',
        //     sortable: true,
        //     maxwidth: '25px',
        //     selector: row => row.no
        // },
        // {
        //     name: "Parents",
        //     sortable: true,
        //     selector: row => row.order_quantity
        // },
        {
            name: 'Name',
            sortable: true,
            selector: (row) => !row?.first_name && !row?.last_name ? 'User Not found' : row?.first_name + ' ' + row?.last_name
        },
        {
            name: "Display Name",
            sortable: true,
            selector: (row) => !row?.username ? 'User Not found' : row?.username
        },
        {
            name: "Email",
            sortable: true,
            minWidth: '200px',
            selector: (row) => row?.email
        },
        // {
        //     name: 'Subjects',
        //     sortable: true,
        //     selector: row => !row?.categories || row?.categories.length === 0 ? 'Not Found' : row?.categories?.map(item => item?.name).join(' ')
        // },
        {
            name: 'Age',
            sortable: true,
            selector: row => {
                if (!row?.dob) return '';
                const dob = new Date(row?.dob);
                const today = new Date();
                const oneDay = 24 * 60 * 60 * 1000;
                const ageInDays = Math.round(Math.abs((today - dob) / oneDay));
                if (ageInDays < 30) {
                    return ageInDays + ' days';
                }
                const ageInMonths = (today.getFullYear() - dob.getFullYear()) * 12 + today.getMonth() - dob.getMonth();
                if (ageInMonths < 12) {
                    return ageInMonths + ' months';
                }

                const ageInYears = Math.floor(ageInMonths / 12);
                return ageInYears + ' years';
            }
        },
        {
            name: 'Quiz Won',
            sortable: true,
            selector: (row) => row?.wonQuiz ? row?.wonQuiz + ' ' + 'Quiz' : 0 + ' ' + 'Quiz',
        },
        {
            name: 'Honeypots',
            sortable: true,
            selector: (row) => row?.honey_pot ? row?.honey_pot?.length : 0 + ' ' + 'Honeypots',
        },
        // {
        //     name: 'Action',
        //     allowoverflow: true,
        //     cell: () => {
        //         return (
        //             <div className='flex gap-1'>
        //                 <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button>
        //                 <button className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>
        //             </div>
        //         )
        //     }
        // }
    ]

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': `${global.TOKEN}`,
        };
        setLoading(true);
        try {
            const res = await axios.get(`${global.BASEURL}api/users/childs/${ParentsData?._id}`, { headers });
            if (res?.data) {
                setCategories(res?.data?.childs);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                <div className="flex justify-between flex-wrap gap-3 items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button type='button' onClick={() => { navigate('/parents') }} className="flex items-center justify-center p-2 bg_primary rounded-3">
                            <ArrowLeft className='text_white' />
                        </button>
                        <h5 className="plusJakara_semibold text_dark">{ParentsData?.username}'s Children</h5>
                    </div>
                </div>
                {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !categories || categories.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Children Found</span>
                        </main> :
                        <ProductTable columns={columns} showFilter={true} data={categories} />
                }
            </main>
        </StyleSheetManager>
    )
}

export default ParentsChild;