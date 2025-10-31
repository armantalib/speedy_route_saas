/* eslint-disable no-unused-vars */
import "bootstrap/dist/js/bootstrap.bundle";
import { Suspense, lazy, useEffect, useState } from 'react';
import './App.scss';
import './components/styles/main.css'
import { finabeelight, logoDynomo } from './components/icons/icon';
import { CircularProgress } from "@mui/material"
import { Route, Routes, useLocation } from 'react-router-dom';
import PublicRoutes from "./components/authRoutes/publicRoutes";
import PrivateRoutes from "./components/authRoutes/privateRoutes";

import Users from "./components/pages/users";
import { GoogleMap, LoadScript, Polygon, Autocomplete, Marker, useLoadScript,useJsApiLoader } from "@react-google-maps/api";
import Community from "./components/pages/community";
import CommunityPost from "./components/pages/communityPost";
import MarketplacePost from "./components/pages/marketplacePost";
import Faq from "./components/pages/faq";
import AddFaq from "./components/pages/faqComponents/addFaq";
import VehicleMakeModel from "./components/pages/vehicleMakeModal";
import SpeedyRoutesList from "./components/pages/SpeedyRoutes/SpeedyRoutesList";
import RouteForm from "./components/pages/SpeedyRoutes/RouteForm";
import DriversList from "./components/pages/Drivers/DriversList";
import DriverForm from "./components/pages/Drivers/DriverForm";
import ProfDeliveryList from "./components/pages/ProfOfDelivery/ProfDeliveryList";
import LiveTrackingList from "./components/pages/LiveTracking/LiveTrackingList";
import Reports from "./components/pages/reports";
import SuperDashboard from "./components/pages/superDashboard";
import CompanyList from "./components/pages/SuperAdmin/Company/CompanyList";
import AdminUsersList from "./components/pages/SuperAdmin/AdminUsers/AdminUsersList";
import DispatcherList from "./components/pages/SuperAdmin/Dispatcher/DispatcherList";
import Settings from "./components/pages/CompanySettings/Settings";
import RegisterUser from "./components/auth/registerUser";
import RouteDetail from "./components/pages/SpeedyRoutes/RouteDetail";

// import AccountDeletetion from "./components/auth/accountDeletion";


const NavHeader = lazy(() => import('./components/header/navHeader'));
const SidebarMenu = lazy(() => import('./components/pages/sidebar'));
const LoginPage1 = lazy(() => import('./components/auth/dynomoLogin1'));
const AccountDeletetion = lazy(() => import('./components/auth/accountDeletion'));
const Dashboard = lazy(() => import('./components/pages/dashboard'));
const Parents = lazy(() => import('./components/pages/parents'));
const ZoneExcel = lazy(() => import('./components/pages/zoneExcel'));

function App() {
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { pathname } = useLocation();

  const token = window.localStorage.getItem('login_admin_token')
  global.GoogleApiKey = "AIzaSyBqVDx99KnqA9QE-pCDqR61EsEtPsT8B78"

  // console.log(token);

  useEffect(() => {
    global.BASEURL = 'http://192.168.0.104:8090/api/'
    global.TOKEN = token
  }, [])

  useEffect(() => {
    const isLoginData = JSON.parse(localStorage.getItem("isLogin_finabee_admin") || false);
    setIsLogin(isLoginData);
  }, [pathname]);


  function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  }

  return (
    <>
      <SidebarMenu toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled}>
           <LoadScript googleMapsApiKey={global.GoogleApiKey} libraries={["places"]}>
        {isLogin && <NavHeader toggled={toggled} setBroken={setBroken} broken={broken} setToggled={setToggled} />}
        <Suspense fallback={
          <main className='h-screen flex flex-col justify-center items-center'>
            <CircularProgress className='text_darkprimary' size={40} thickness={2} />
            {/* <img style={{ width: '3rem', height: "auto" }} src={finabeelight} className='absolute' alt="" /> */}
          </main>
        }>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicRoutes />} >
              <Route index element={<LoginPage1 />}></Route>
              <Route path='/login' element={<LoginPage1 />}></Route>
              {/* <Route path='/register' element={<RegisterUser />}></Route> */}
              <Route path='/account-delete' element={<AccountDeletetion />}></Route>
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/community" element={<Community />} />
              <Route path="/post/community" element={<CommunityPost />} />
              <Route path="/marketplace/post" element={<MarketplacePost />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/add/faq" element={<AddFaq />} />
              <Route path="/veh/make" element={<VehicleMakeModel />} />
              <Route path="/route/list" element={<SpeedyRoutesList />} />
              <Route path="/route/form" element={<RouteForm />} />
              <Route path="/driver/list" element={<DriversList />} />
              <Route path="/driver/form" element={<DriverForm />} />
              <Route path="/prof/list" element={<ProfDeliveryList />} />
              <Route path="/tracking/list" element={<LiveTrackingList />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/super/dashboard" element={<SuperDashboard />} />
              <Route path="/company/list" element={<CompanyList />} />
              <Route path="/clients/list" element={<AdminUsersList />} />
              <Route path="/dispatcher/list" element={<DispatcherList />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/route-detail" element={<RouteDetail />} />
             
      


         
            </Route>
          </Routes>
        </Suspense>
        </LoadScript>
      </SidebarMenu>
    </>
  );
}
export default App;
