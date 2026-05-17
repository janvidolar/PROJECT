import { Navigate } from "react-router-dom";

const AuthGuard = ({
    children,
    requireAuth = true,
    allowedRoles = [],
    redirectTo = "/login"
}) => {
    const authData = JSON.parse(
        localStorage.getItem("authDetail-tickethub")
    );
    const isAuthenticated = !!authData
    const userRole = authData?.role;
    if (!requireAuth && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default AuthGuard;