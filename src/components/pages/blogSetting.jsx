/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { course1, course2, course3, course4, course5, testpdf } from '../icons/icon'
import { useNavigate } from 'react-router-dom'
import { StyleSheetManager } from 'styled-components';
import ProductTable from '../DataTable/productTable';
import { dataTable } from '../DataTable/productsData';
import { Edit, Trash2 } from 'react-feather';
import axios from 'axios';

const BlogSetting = () => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState(false)

    const columns = [
        {
            name: 'Blog Name',
            sortable: true,
            selector: (row) => row?.name
        },
        {
            name: 'HoneyPots',
            sortable: true,
            selector: (row) => row?.honeypot
        },
        {
            name: 'Screen Time (In min)',
            sortable: true,
            selector: (row) => row?.time
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1'>
                        <button style={{ backgroundColor: '#06d6a0' }} className="blex justify-center inter_medium text-xs text_white rounded-3 p-2 items-center"><Edit size={16} /></button>
                        <button style={{ backgroundColor: '#ff6f61' }} className="flex justify-center inter_medium text-xs text_white rounded-3 p-2 items-center"><Trash2 size={16} /></button>
                    </div>
                )
            }
        }
    ];

    const fetchData = async () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': global.TOKEN
        };
        try {
            const res = await axios.get(`${global.BASEURL}api/blog/all`, { headers });
            setCategories(res?.data?.blogs);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                <div className="flex flex-col mb-3 w-full">
                    <h2 className='plusJakara_bold text_black'>Blog Setting</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                <ProductTable columns={columns} data={categories} />
            </main>
        </StyleSheetManager>
    )
}

export default BlogSetting