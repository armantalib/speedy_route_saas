/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { childdark, childlight, coursedark, courselight, dashboarddark, dashboardlight, finabeelight, parentdark, parentlight, quizdark, quizlight, logo, logo2, feedDark, question, dashboard_icon, route_icom, driver_icons, live_tracking_icon, prof_delivery_icon, reports_icon, user_icons, settings_icon, crown } from '../icons/icon';
import { useAuth } from '../authRoutes/useAuth';
import { Search } from 'react-feather';
import { MdArticle, MdOutlineArticle, MdProductionQuantityLimits } from 'react-icons/md';
import { Button } from 'antd';
import { dataGet_ } from '../utils/myAxios';

const SidebarMenu = ({ children, setToggled, toggled, setBroken }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedLink, setSelectedLink] = useState('0');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
      const [planDataM, setPlansDataM] = useState([]);
      const [plans, setPlans] = useState(null);
      const [planDataY, setPlansDataY] = useState([]);
      const [selectedPlanObj, setSelectedPlanObj] = useState(null);
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

    useEffect(() => {
     getData();
    }, [])
    

      const getData = async () => {
        const plans = localStorage.getItem('plans')
        if (plans) {
          const planParse = JSON.parse(plans)
          setPlansDataM(planParse?.plansMonthly)
          setPlansDataY(planParse?.plansYearly)
        }
        const endPoint = 'settings/get/plan-addons'
        const response = await dataGet_(endPoint, {});
        if (response?.data?.success) {
          setPlans(response?.data?.subscription?.plan?.plan)
          localStorage.setItem('plans', JSON.stringify(response?.data))
        }
      }

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
        { image: dashboard_icon, image2: dashboard_icon, items: "Dashboard", path: '/dashboard' },
        { image: route_icom, image2: route_icom, items: "Routes", path: '/route/list' },
        {
            items: "Team",
            image: live_tracking_icon, image2: live_tracking_icon,
            subItems: [
                { label: "Dispatcher", path: "/dispatcher/list" },
                { label: "Driver", path: "/driver/list" },
            ]
        },
        // { image: driver_icons, image2: driver_icons, items: "Drivers", path: '/driver/list' },
        { image: live_tracking_icon, image2: live_tracking_icon, items: "Live Tracking", path: '/tracking/list' },
        { image: prof_delivery_icon, image2: prof_delivery_icon, items: "Prof Of Delivery", path: '/prof/list' },
        { image: reports_icon, image2: reports_icon, items: "Reports", path: '/reports' },
        { image: settings_icon, image2: settings_icon, items: "Company Settings", path: '/settings' },
    ];

    const menuItemsDispatcher = [
        { image: dashboard_icon, image2: dashboard_icon, items: "Dashboard", path: '/dashboard' },
        { image: route_icom, image2: route_icom, items: "Routes", path: '/route/list' },
        { image: driver_icons, image2: driver_icons, items: "Drivers", path: '/driver/list' },
        { image: live_tracking_icon, image2: live_tracking_icon, items: "Live Tracking", path: '/tracking/list' },
        { image: prof_delivery_icon, image2: prof_delivery_icon, items: "Prof Of Delivery", path: '/prof/list' },
        // { image: reports_icon, image2: reports_icon, items: "Reports", path: '/reports' },
    ];

    const menuItemsDispatcherLimited = [
        { image: dashboard_icon, image2: dashboard_icon, items: "Dashboard", path: '/dashboard' },
        { image: route_icom, image2: route_icom, items: "Routes", path: '/route/list' },
        { image: driver_icons, image2: driver_icons, items: "Drivers", path: '/driver/list' },
        { image: live_tracking_icon, image2: live_tracking_icon, items: "Live Tracking", path: '/tracking/list' },
        { image: prof_delivery_icon, image2: prof_delivery_icon, items: "Prof Of Delivery", path: '/prof/list' },
    ];

    const menuItemsSuperAdmin = [
        { image: dashboard_icon, image2: dashboard_icon, items: "Dashboard", path: '/super/dashboard' },
        { image: user_icons, image2: user_icons, items: "Clients", path: '/clients/list' },
        // { image: prof_delivery_icon, image2: prof_delivery_icon, items: "Companies", path: '/company/list' },

        // { image: driver_icons, image2: driver_icons, items: "Drivers", path: '/driver/list' },
        // { image: live_tracking_icon, image2: live_tracking_icon, items: "Live Tracking", path: '/tracking/list' },
        // { image: prof_delivery_icon, image2: prof_delivery_icon, items: "Prof Of Delivery", path: '/prof/list' },
        // { image: reports_icon, image2: reports_icon, items: "Reports", path: '/reports' },

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

    const user_type = localStorage.getItem('user_type')
    const dispatch_limit = localStorage.getItem('dispatch_limit')
    const finalMenuItem = user_type === 'super_admin' ? menuItemsSuperAdmin : user_type === 'dispatcher' ? menuItemsDispatcher : menuItems
    
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
                                        <img style={{ height: '5rem', width: 'auto' }} src={logo2} className='' alt="" />
                                    </button>
                                </div>
                                <Menu className='container mx-auto flex flex-col justify-between h-full'>
                                    <div>
                                        {finalMenuItem.map((item, i) => (
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
                                {plans=='trial'?
                                <div style={{ width: '88%', alignSelf: 'center', height: 187, backgroundColor: '#F3F4F4', position: 'absolute', bottom: 50, borderRadius: 10, padding: 12 }}>
                                    <div style={{ width: 40, height: 40, backgroundColor: '#6688E8', borderRadius: 12, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                        <img style={{ height: 24, width: 24 }} src={crown} className='' alt="" />
                                    </div>
                                    <p style={{ fontWeight: '500', color: '#1B1B1B', marginTop: 15 }}>Trial plan</p>
                                    <p style={{ fontWeight: '400', color: '#73757C', fontSize: 12, marginTop: -10 }}>You’re on the Basic Plan. Max 5 routes/day.</p>

                                    <Button
                                        size="middle"
                                        variant="primary"
                                        style={{width:'100%'}}
                                        onClick={() => {
                                            navigate('/settings')
                                        }}
                                    >
                                        Upgrade Plan
                                    </Button>
                                </div>:null}
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
