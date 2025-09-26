/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTable from '../DataTable/productTable';
import { dataTable } from '../DataTable/productsData';
import { avatarman, preview, trash, edit2 } from '../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataDelete, dataGet_ } from '../utils/myAxios';
import { useLocation, useNavigate } from 'react-router-dom';
const Questions = (props) => {
    const navigate = useNavigate()
    const { pData } = useLocation();
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [data, setData] = useState([])

    const columns = [
        {
            name: 'Title',
            sortable: true,
            minWidth: '200px',
            width: '700px',
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ flexDirection: 'row', flex: 'row', justifyContent: 'space-between' }}>
                        <p>{row?.title}</p>
                    </div>
                )
            }
        },
        {
            name: "Type",
            sortable: true,
            minWidth: '200px',
            maxWidth: '200px',
            selector: row => row?.type
        },

        {
            name: 'Options',
            sortable: true,
            minWidth: '200px',
            width: '270px',
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{}}>
                        {row?.options.map((item, index) => (
                            <p>{item.option + ` (${item.value})`}</p>
                        ))}
                    </div>
                )
            }
        },

        {
            name: 'Date',
            sortable: true,
            selector: (row) => row?.createdAt,
        },
        {
            name: 'Action',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div className='flex gap-1' style={{ flexDirection: 'row', flex: 'row', justifyContent: 'space-between' }}>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        <button onClick={() => moveNext(row)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center" style={{ backgroundColor: '#3B71CA' }}><img className="w-[12px] h-auto" src={edit2} alt="" /></button>
                        <button onClick={() => deleteData(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>
                    </div>
                )
            }
        },
    ]

    const fetchData = async () => {
        setLoading(true);
        try {
            const quiz_id = localStorage.getItem('quiz_id')
            let allData = [];
            for (let page = 1; page <= totalPages; page++) {
                let data1 = {}
                const endPoint = `quiz/question/admin/get/${page}/${quiz_id}`
                const res = await dataGet_(endPoint, data1);
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
            const endPoint = `quiz/question/admin/delete/${id}`
            const res = await dataDelete(endPoint, data1);
            fetchData()
        }

    }

    const moveNext = async (row) => {

        let mData = JSON.stringify(row)
        localStorage.setItem('single_question', mData)
        navigate('/questions/create')
    }

    useEffect(() => {
        fetchData();
    }, [totalPages]);

    return (
        <StyleSheetManager shouldForwardProp={(prop) => !['sortActive'].includes(prop)}>
            <main className="min-h-screen lg:container py-5 px-4 mx-auto">
                <div className="flex justify-between gap-3 items-center w-full">
                    <div className="flex flex-col mb-3 w-full">
                        <h2 className='plusJakara_bold text_black'>All Questions</h2>
                        <h6 className="text_secondary plusJakara_regular">Information about your current plan and usages</h6>
                    </div>
                    <button onClick={() => { 
                        localStorage.removeItem('single_question')
                        navigate('/questions/create') 
                        }} style={{ width: '150px', backgroundColor: '#000' }} className="bg_primary py-3 rounded-3 text_white plusKajara_semibold">Add Question</button>
                </div>
                {loading ? <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                    <CircularProgress size={24} className='text_dark' />
                </main> :
                    !data || data.length === 0 ?
                        <main className='my-5 d-flex w-100 justify-content-center align-items-center'>
                            <span className="text_secondary plusJakara_medium">No Dates Found</span>
                        </main> :
                        <ProductTable columns={columns} showFilter={true} data={data} />
                }
            </main>
        </StyleSheetManager>
    )
}

export default Questions;