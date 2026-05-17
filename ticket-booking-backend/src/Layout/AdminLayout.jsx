import { Outlet } from "react-router-dom";
import SideBar from "../Pages/AdminPages/SideBar";
const AdminLayout = () => {
    return (
        <>
            <div className="flex">
                <div className="w-1/4">
                    <SideBar />
                </div>
                <div className="w-full">       
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
