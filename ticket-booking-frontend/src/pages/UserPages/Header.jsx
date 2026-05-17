import { Bell, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold"
      : "text-gray-400 hover:text-white transition";

  const authData = JSON.parse(
    localStorage.getItem("authDetail-tickethub") || "{}"
  );
  const name = authData?.name?.split(" ")[0] || "Guest";

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authDetail-tickethub");
    navigate("/login");
  };

  return (
    <header className="w-full bg-gradient-to-b from-[#0F172A] to-[#020617] px-6 pt-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/40 shadow">
            <img src="/img2.jpg" className="w-13 h-13 object-contain" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
             MoviePass
            </h1>
            <p className="text-xs text-gray-400">
              Hi, <span className="text-gray-200 font-medium">{name}</span>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Bell className="w-5 h-5 text-gray-300" />
          </button>

          <button
            onClick={handleLogoutConfirm}
            className="flex items-center gap-2 px-4 py-2
                       rounded-full text-sm font-medium
                       bg-[#111827] text-gray-200
                       hover:bg-[#1F2937] transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="w-full mt-4 pb-3 border-t border-white/10 pt-3">
        <ul className="flex items-center gap-8 text-sm font-medium">
          <NavLink to="/user/dashboard" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/user/my-bookings" className={navClass}>
            My Bookings
          </NavLink>
          <NavLink to="/user/events" className={navClass}>
            Movies
          </NavLink>
          <NavLink to="/user/profile" className={navClass}>
            Profile
          </NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
