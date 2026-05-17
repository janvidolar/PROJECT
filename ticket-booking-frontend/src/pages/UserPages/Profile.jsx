import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, Save, Edit2 } from "lucide-react";
import { ApiService } from "../../Services/ApiService.js";
// Is path ko apni image ke hisaab se check kar lein
import bgImage from "../../assets/d.png"; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const id = JSON.parse(localStorage.getItem("authDetail-tickethub")).id;

  const getUserProfile = async () => {
    const res = await ApiService.get(`/users/${id}`);
    setUser(res.data);
    setFormData({
      name: res.data.name,
      email: res.data.email,
      memberSince: res.data.createdAt.split("T")[0],
      phone: res.data.phone,
    });
    setLoading(false);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await ApiService.put(`/users/update/${id}`, formData);
    setIsEditing(false);
    getUserProfile();
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <div 
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-fixed py-20 px-4"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})` 
      }}
    >
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 border border-indigo-100 shadow-xl shadow-indigo-100/40">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2.5 text-indigo-900">
              <User className="text-indigo-600" size={24} />
              Personal Information
            </h2>
            <p className="text-sm text-slate-600 mt-1.5">
              Update your personal details
            </p>
          </div>

          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-7 py-3 rounded-full
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         text-white font-semibold shadow-lg shadow-indigo-300/40
                         hover:from-indigo-700 hover:to-purple-700
                         transition-all duration-300"
            >
              <Save size={18} /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-7 py-3 rounded-full
                         border-2 border-indigo-600 text-indigo-700 font-semibold
                         hover:bg-indigo-50 hover:text-indigo-800 transition-all duration-300"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          )}
        </div>

        {/* AVATAR */}
        <div className="flex flex-col items-center text-center mt-12">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center
                       text-white text-4xl font-extrabold shadow-2xl
                       bg-gradient-to-br from-indigo-600 to-purple-600"
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <h3 className="text-2xl font-bold text-indigo-900 mt-5">
            {user.name}
          </h3>
          <p className="text-slate-600 mt-1.5">{user.email}</p>

          <span className="mt-5 px-6 py-2 rounded-full text-sm font-semibold
                           bg-indigo-100 text-indigo-700 border border-indigo-200">
            {user.role || "User"}
          </span>
        </div>

        {/* STATS */}
        <div className="flex justify-center gap-24 mt-12">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-indigo-900">
              {user.totalBookings || 0}
            </p>
            <p className="text-sm text-slate-600 mt-2 font-medium">Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-indigo-900">
              {user.cancelledBookings || 0}
            </p>
            <p className="text-sm text-slate-600 mt-2 font-medium">Cancelled</p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-14">
          {[
            { label: "Full Name", icon: User, name: "name", type: "text" },
            { label: "Email Address", icon: Mail, name: "email", type: "email" },
            { label: "Member Since", icon: Calendar, name: "memberSince", type: "date" },
            { label: "Mobile Number", icon: Phone, name: "phone", type: "text" },
          ].map(({ label, icon: Icon, name, type }) => (
            <div key={name}>
              <label className="flex items-center gap-2.5 text-indigo-800 font-semibold mb-2.5">
                <Icon size={20} className="text-indigo-600" />
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-5 py-3.5 rounded-2xl
                           border border-indigo-200 bg-indigo-50/30
                           text-indigo-900 placeholder:text-slate-500
                           disabled:opacity-60 disabled:bg-slate-50
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60
                           outline-none transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;