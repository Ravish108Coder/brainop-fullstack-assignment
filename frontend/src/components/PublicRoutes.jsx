import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutes = () => {
    return !localStorage.getItem('token') ? (
        <Outlet />
    ) : (
        <Navigate to='/' />
    )
};

export default PublicRoutes;