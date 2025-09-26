/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTable from '../../DataTable/productTable';
import { dataTable } from '../../DataTable/productsData';
import { avatarman, preview, trash } from '../../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataDelete, dataGet_ } from '../../utils/myAxios';
import { useNavigate } from 'react-router-dom';

const LegalResources = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [data, setData] = useState([])

    const columns = [
        {
            name: 'Title',
            sortable: true,
            selector: row => !row?.title ? 'User Not found' : row.title
        },
        {
            name: "Content",
            sortable: true,
            minWidth: '200px',
            selector: row => row?.content
        },
        {
            name: 'Created At',
            sortable: true,
            selector: (row) => row?.createdAt,
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1'>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        <button onClick={() => deleteData(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>
                    </div>
                )
            }
        }
    ]

    const fetchData = async () => {
        setLoading(true);
        try {
            let allData = [];
            for (let page = 1; page <= totalPages; page++) {
                let data1 = {}
                const endPoint = `resources/admin/get/${page}/legal`
                const res = await dataGet_(endPoint, data1);
                console.log("R",res?.data?.data);
                if (res?.data) {
                    allData = allData.concat(res?.data?.data);
                    setTotalPages(res?.data?.count?.totalPage);
                }
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
            const endPoint = `resources/admin/delete/${id}`
            const res = await dataDelete(endPoint, data1);
            fetchData()
        }

    }

    useEffect(() => {
        fetchData();
    }, [totalPages]);

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
            <div className="flex justify-between gap-3 items-center w-full">
                <div className="flex flex-col mb-5 w-full">
                    <h2 className='plusJakara_bold text_black'>Legal Resources</h2>
                    <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                </div>
                <button onClick={() => { navigate('/legal/add-legal') }} style={{ width: '150px' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Legal</button>
            </div>
                {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !data || data.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Resources Found</span>
                        </main> :
                        <ProductTable columns={columns} showFilter={true} data={data} />
                }
            </main>
        </StyleSheetManager>
    )
}

export default LegalResources;