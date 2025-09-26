/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ProductTable from '../DataTable/productTable';
import { dataTable } from '../DataTable/productsData';
import { avatarman,avatar1, preview, trash } from '../icons/icon';
import { StyleSheetManager } from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { dataDelete, dataGet_, dataPut } from '../utils/myAxios';
import Switch from 'react-switch';

const Users = () => {
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState([])


    const StatusToggler = ({ row }) => {
        const [isActive, setIsActive] = useState(row.status === 'online');

        const handleToggle = async () => {
            // axiosInstanceApi.put(`/users/update/${row._id}/${isActive ? 'deactivated' : 'online'}`)
            const endPoint = `users/update/${row._id}/${isActive ? 'deactivated' : 'online'}`
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
                    {isActive ? 'Active' : 'Deactive'}
                </span>
            </div>
        );
    };

    const columns = [
        {
            name: 'Name',
            allowoverflow: true,
            cell: (row) => {
                return (
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
                        <img src={row?.image ? row?.image : avatar1} alt="Girl in a jacket" style={{ borderRadius: 100, width: 40, height: 40 }} />
                        <span style={{marginLeft:10}}>{row?.name}</span>
                    </div>
                )
            }
        },
        {
            name: "Email",
            sortable: true,
            minWidth: '200px',
            selector: row => row?.email
        },
        {
            name: 'About Me',
            sortable: true,
            minWidth: '200px',
            maxWidth: '500px',
            selector: row => row?.about_me
        },
        {
            name: "Community",
            sortable: true,
            minWidth: '200px',
            selector: row => row?.community?.name
        },
        {
            name: "Change Status",
            sortable: true,
            minWidth: '120px',
            selector: (row) => <StatusToggler row={row} />,
        },
        {
            name: 'Created At',
            sortable: true,
            selector: (row) => row?.createdAt,
        },
        // {
        //     name: 'Action',
        //     allowoverflow: true,
        //     cell: (row) => {
        //         return (
        //             <div className='flex gap-1'>
        //                 {/* <button className="bg-[#2B7F75] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={preview} alt="" /></button> */}
        //                 <button onClick={() => deleteUsers(row?._id)} className="bg-[#CE2C60] flex justify-center rounded-3 w-[24px] h-[24px] items-center"><img className="w-[12px] h-auto" src={trash} alt="" /></button>
        //             </div>
        //         )
        //     }
        // }
    ]

    const fetchData = async () => {

        setLoading(true);
        try {
            let allChilds = [];
            for (let page = 1; page <= totalPages; page++) {
                let data1 = {}
                const endPoint = `users/admin/all/${page}`
                const res = await dataGet_(endPoint, data1);
                if (res?.data) {
                    allChilds = allChilds.concat(res?.data?.users);
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

    const deleteUsers = async (id) => {
        if (window.confirm("Are you sure to want delete")) {
            let data1 = {}
            const endPoint = `users/admin/delete/${id}`
            const res = await dataDelete(endPoint, data1);
            // fetchData()
        }

    }

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
                            <span className="text_secondary plusJakara_medium">No Users Found</span>
                        </main> :
                        <ProductTable columns={columns} showFilter={true} data={categories} />
                }
            </main>
        </StyleSheetManager>
    )
}

export default Users;