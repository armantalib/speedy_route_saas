/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { childdark, childlight, coursedark, courselight, dashboarddark, dashboardlight, finabeelight, parentdark, parentlight, quizdark, quizlight,logo,logo2, feedDark, question } from '../icons/icon';
import { useAuth } from '../authRoutes/useAuth';
import { Search } from 'react-feather';
import { MdArticle, MdOutlineArticle, MdProductionQuantityLimits } from 'react-icons/md';

const SidebarMenu = ({ children, setToggled, toggled, setBroken }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedLink, setSelectedLink] = useState('0');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = useAuth();

    const handleLinkClick = (itemId, path) => {
        setSelectedLink(itemId);
        setToggled(false);
        setShow(false);
        navigate(path);
    };

    const isChildPath = (parentPath, childPath) => {
        return childPath.startsWith(parentPath);
    };

    const getParentPath = (path) => {
        const pathSegments = path.split('/');
        return pathSegments.slice(0, pathSegments.length - 1).join('/');
    };

    // const findParentPath = (childPath) => {
    //     for (let i = 0; i < menuItems.length; i++) {
    //         const parentPath = getParentPath(menuItems[i].path);
    //         if (isChildPath(parentPath, childPath)) {
    //             return parentPath;
    //         }
    //     }
    //     return childPath;
    // };

    const menuItems = [
        { image: dashboarddark, image2: dashboarddark, items: "Dashboard", path: '/dashboard' },
        { image: parentdark, image2: parentdark, items: "Routes", path: '/route/list' },
        { image: quizdark, image2: quizdark, items: "Drivers", path: '/driver/list' },
        { image: coursedark, image2: coursedark, items: "Live Tracking", path: '/tracking/list' },
        { image: parentdark	, image2: parentdark, items: "Prof Of Delivery", path: '/prof/list' },
        // { image: question, image2: question, items: "FAQ", path: '/faq' },
        // { image: childdark, image2: childlight, items: "Veh Make/Modal", path: '/veh/make' },
        // {
        //     items: "Safety Resources",
        //     subItems: [
        //         { label: "Safety", path: "/safety" },
        //         { label: "Legal", path: "/legal" },
        //     ]
        // },
        // { image: quizdark, image2: quizlight, items: "Faqs", path: "/faq" },
        // { image: quizdark, image2: quizlight, items: "Customer Support", path: "/customer-support" },
        // { image: quizdark, image2: quizlight, items: "Digital Products", path: "/digital-products" },
    ];

    return (
        <>
            {isLogin ? (
                <div className='flex h-screen min-h-screen'>
                    <div className='h-screen relative' style={{ zIndex: 9999 }}>
                        <Sidebar
                            width='260px'
                            style={{ height: '100%', zIndex: 9999 }}
                            collapsed={collapsed}
                            toggled={toggled}
                            backgroundColor='white'
                            onBackdropClick={() => {
                                setToggled(false);
                                setShow(false);
                            }}
                            onBreakPoint={setBroken}
                            breakPoint="xl"
                        >
                            <div className='scrolbar' style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100%', paddingTop: '1rem' }}>
                                <div className='mb-2 flex items-center justify-center'>
                                    <button onClick={() => { navigate('/dashboard') }} className="">
                                        <img style={{ height: '5rem', width: 'auto'}} src={logo2} className='' alt="" />
                                    </button>
                                </div>
                                <Menu className='container mx-auto flex flex-col justify-between h-full'>
                                    <div>
                                        {menuItems.map((item, i) => (
                                            <Fragment key={i}>
                                                {item.subItems ? (
                                                    <SubMenu icon={<MdProductionQuantityLimits style={{ height: 'auto', width: "25px", marginRight: '10px' }} />} label={item.items} className={`w-full plusJakara_semibold text_secondary rounded-3 mb-2`}>
                                                        {item.subItems.map((subItem, j) => (
                                                            <MenuItem
                                                                key={`${i}-${j}`}
                                                                onClick={() => handleLinkClick(`${i}-${j}`, subItem.path)}
                                                                component={<Link to={subItem.path} />}
                                                                className={`w-full rounded-3 mb-2 ${isChildPath(subItem.path, location.pathname) ? 'bg_darkprimary_light text_black plusJakara_semibold' : 'text_secondary'}`}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className='plusJakara_semibold'>{subItem.label}</div>
                                                                </div>
                                                            </MenuItem>
                                                        ))}
                                                    </SubMenu>
                                                ) : (
                                                    <MenuItem
                                                        key={i}
                                                        onClick={() => handleLinkClick(i.toString(), item.path)}
                                                        component={<Link to={item.path} />}
                                                        className={`w-full rounded-3 mb-2 ${isChildPath(item.path, location.pathname) ? 'bg_darkprimary_light text_black plusJakara_semibold' : 'text_secondary'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {isChildPath(item.path, location.pathname) ? <img style={{ height: 'auto', width: '25px' }} src={item.image2} alt="" /> : <img style={{ height: 'auto', width: '25px' }} src={item.image} alt="" />}
                                                            <div className='plusJakara_semibold'>{item.items}</div>
                                                        </div>
                                                    </MenuItem>
                                                )}
                                            </Fragment>
                                        ))}
                                    </div>
                                </Menu>
                            </div>
                        </Sidebar>
                    </div>
                    <main className='w-full overflow-auto' style={{ backgroundColor: '#FFFFFF' }}>
                        {children}
                    </main>
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default SidebarMenu;
