import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

function PublicRoutes() {
    const user_type = localStorage.getItem('user_type')
    const token = useAuth()
    return token ? <Navigate to={user_type=='super_admin'?'/super/dashboard': '/dashboard'} /> : <Outlet />
}

export default PublicRoutes;