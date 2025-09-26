/* eslint-disable no-unused-vars */
import React, { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { arrowdown, arrowdownlight, avatarman, cart, favourite, notification, searchbar } from '../icons/icon';
import { Menu, Transition } from '@headlessui/react';
import { MdMenu } from 'react-icons/md';
import { Navbar, Nav, Container, Modal } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { message } from 'antd';

const NavHeader = ({ broken, setToggled, toggled }) => {
    const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }


    const handleLogout = () => {
        window.localStorage.removeItem("isLogin_finabee_admin");
        message.error("Logout Successful!");
        console.log("Logging out ");
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="white" expand="lg" sticky="top" className='p-3 shadow-sm w-[100%]' id="navbar">
                <Container fluid="lg" className='w-full' >
                    <div className='flex items-center gap-3 md:w-1/2'>
                        {broken && (
                            <button className="sb-button" onClick={() => setToggled(!toggled)}>
                                <MdMenu size={28} />
                            </button>
                        )}
                        {/* {isSmallScreen && (
                            <div>
                                <img src={searchbar} className='cursor-pointer' alt="" onClick={openModal} />
                                <Modal show={isModalOpen} onHide={closeModal}>
                                    <Modal.Body className='p-0'>
                                        <div className="flex items-center">
                                            <img src={searchbar} className='absolute m-2' alt="" />
                                            <input type="text" className='w-full ps-10 py-[10px] border border-white rounded' placeholder='Search anything here' name="" id="" />
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        )}
                        {!isSmallScreen && (
                            <div className='hidden md:block w-full'>
                                <img src={searchbar} className='absolute m-2' alt="" />
                                <input type="text" className='ps-10 py-2 w-full' placeholder='Search anything here' name="" id="" />
                            </div>
                        )} */}
                        <h3 className="d-none d-md-block poppins_semibold mb-0 text_dark">Admin</h3>
                    </div>
                    <Nav className="ms-auto flex">
                        <div className='flex justify-center items-center'>
                            <Menu as="div" className="relative">
                                <Menu.Button className="relative flex items-center ms-2 no-underline gap-2">
                                    <img src={avatarman} className='rounded-full max-h-[2rem] w-[100%]' alt="" />
                                    <img src={arrowdownlight} style={{ width: '20px', height: 'auto' }} alt="" />
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute z-10 mt-2 flex flex-col rounded-3 bg_white shadow py-2" style={{ minWidth: '10rem', right: '0px', position: 'absolute' }}>
                                        <Link onClick={handleLogout} style={{ textDecoration: 'none' }} className='px-4 py-1 text_dark plusJakara_semibold text_white no-underline'>Sign out</Link>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </Nav>
                </Container>
            </Navbar>
        </>

    )
}

export default NavHeader
