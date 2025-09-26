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

const Children = () => {
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
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
            selector: row => !row?.first_name && !row?.last_name ? 'User Not found' : row.first_name + ' ' + row?.last_name
        },
        {
            name: "Display Name",
            sortable: true,
            selector: row => !row?.username ? 'User Not found' : row?.username
        },
        {
            name: "Email",
            sortable: true,
            minWidth: '200px',
            selector: row => row?.email
        },
        {
            name: 'Subjects',
            sortable: true,
            selector: row => !row?.categories || row?.categories.length === 0 ? 'Not Found' : row?.categories?.map(item => item?.name).join(' ')
        },
        {
            name: 'Age',
            sortable: true,
            selector: row => {
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
            let allChilds = [];
            for (let page = 1; page <= totalPages; page++) {
                const res = await axios.get(`${global.BASEURL}api/users/all/child/${page}`, { headers });
                console.log(res);
                if (res?.data) {
                    allChilds = allChilds.concat(res?.data?.childs);
                    setTotalPages(res?.data?.count?.totalPage);
                }
            }
            setCategories(allChilds);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [totalPages]);

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_bold text_black'>Users</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
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

export default Children;