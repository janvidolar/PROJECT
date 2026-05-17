import { Outlet } from "react-router-dom";
import Header from "../Pages/UserPages/Header";
const UserLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default UserLayout;
