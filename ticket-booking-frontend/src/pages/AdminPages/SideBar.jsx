import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Ticket, LogOut } from "lucide-react";

const SideBar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Bookings", icon: Calendar, path: "/admin/bookings" },
    { name: "Movies", icon: Ticket, path: "/admin/events" },
  ];

  const handleLogoutConfirm = () => {
    localStorage.removeItem('authDetail-tickethub');
    navigate("/login");
  };

  return (
    <aside className="w-72 h-screen bg-[#0f172a] flex flex-col shadow-2xl border-r border-slate-800">
      
      {/* Admin Panel Part - ORANGE REMOVED */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          {/* Logo container without orange background */}
          <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
            <img 
              src="/img2.jpg" 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xl font-bold text-white tracking-tight">Admin Panel</h2>
            <p className="text-sm text-slate-400 font-medium">Admin User</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 mt-4 space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/20 to-transparent text-blue-400 border-l-4 border-blue-500"
                  : "text-slate-500 hover:bg-slate-800/40 hover:text-slate-300"
              }`
            }
          >
            <item.icon 
                size={22} 
                className={`transition-all duration-300 group-hover:scale-110 group-active:scale-95`} 
            />
            <span className="font-bold text-[15px] tracking-wide uppercase">
                {item.name}
            </span>

            {/* Subtle indicator for Active state */}
            {({ isActive }) => (
              <div className={`absolute right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-opacity duration-300 
                ${isActive ? "opacity-100" : "opacity-0"}`}>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-5 border-t border-slate-800/50">
        <button
          className="cursor-pointer w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-800/50 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 border border-slate-700 hover:border-red-500/30"
          onClick={handleLogoutConfirm}
        >
          <LogOut size={18} /> 
          <span className="font-bold uppercase text-xs tracking-widest">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;