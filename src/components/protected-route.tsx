import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
    children? : ReactElement;
    isAuthenticated: boolean;
    adminOnly?: boolean;  // To make a route be accessible for admin only
    admin?: boolean; // To detect whether the user is admin or not.
    redirect?: string;
}

const ProtectedRoute = ({
    isAuthenticated,
    children,
    adminOnly,
    admin,
    redirect="/",
}: Props) => {

    if(!isAuthenticated){
        return <Navigate to={redirect} />;
    }

    if(adminOnly && !admin){
        return <Navigate to={redirect} />;
    }

    return children ? children : < Outlet />;
}

export default ProtectedRoute;  