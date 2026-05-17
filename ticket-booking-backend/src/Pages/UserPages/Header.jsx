import { Bell, LogOut, } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    isActive
      ? "text-orange-500 border-b-2 border-orange-500 pb-1"
      : "text-gray-500 hover:text-orange-500";

  const name = JSON.parse(localStorage.getItem('authDetail-tickethub')).name
    .split(" ")[0]

  const handleLogoutConfirm = () => {
    localStorage.removeItem('authDetail-tickethub')
    navigate("/login");
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm px-6 pt-4 border-b border-b-gray-200">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                <img src="/logo.svg" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">TicketHub</h1>
              <p className="text-sm text-gray-500">Hi, {name} </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={() => handleLogoutConfirm()}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="w-full mt-4">
          <ul className="flex items-center gap-6 text-sm font-medium">
            <NavLink to="/user/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/user/my-bookings" className={navClass}>
              My Bookings
            </NavLink>
            <NavLink to="/user/events" className={navClass}>
              Events
            </NavLink>
            <NavLink to="/user/profile" className={navClass}>
              Profile
            </NavLink>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;