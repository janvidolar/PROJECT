import { Navigate } from "react-router-dom";

const RoleIndex = () => {
    const authData = JSON.parse(localStorage.getItem("authDetail-tickethub") || "{}");
    const role = authData?.role;

    if (!authData) {
        return <Navigate to="/login" replace />;
    }

    if (role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "user") {
        return <Navigate to="/user/dashboard" replace />;
    }

    return <Navigate to="/unauthorized" replace />;
};

export default RoleIndex;
