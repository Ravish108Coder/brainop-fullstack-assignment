import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
    return !localStorage.getItem('token') ? (
        <Navigate to='/signin' />
    ) : (
        <Outlet />
    )
};

export default PrivateRoutes;