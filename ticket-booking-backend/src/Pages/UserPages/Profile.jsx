import { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, Save, Edit2 } from "lucide-react";
import { ApiService } from "../../Services/ApiService.js";


const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const id = JSON.parse(localStorage.getItem('authDetail-tickethub')).id
    const getUserProfile = async () => {
        try {
            setLoading(true)
            const response = await ApiService.get(`/users/${id}`)
            setUser(response.data)
            setFormData({
                name: response.data.name,
                email: response.data.email,
                memberSince: response.data.createdAt.split("T")[0],
                phone: response.data.phone
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserProfile()
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await ApiService.put(`/users/update/${id}`, formData) 
        setIsEditing(false);
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="w-full flex my-20 justify-center items-center ">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <User className="text-orange-500" size={18} />
                            Personal Information
                        </h2>
                        <p className="text-sm text-gray-500">Update your personal details</p>
                    </div>

                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 transition"
                        >
                            <Save size={16} /> Save
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm flex items-center gap-2 border border-orange-500 text-orange-500 px-4 py-2 rounded-full hover:bg-orange-50 transition"
                        >
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                {/* Profile Center */}
                <div className="flex flex-col items-center text-center mt-5">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-semibold">
                        {user.initials}
                    </div>

                    <h3 className="text-lg font-semibold mt-2">{user.name}</h3>
                    <p className="text-gray-500">{user?.email || "Email"}</p>

                    <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-600">{user.role}</span>
                        {/* <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">{user.isActive ? "Active": "InActive"}</span> */}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-10 mt-5">
                    <div className="text-center">
                        <p className="text-xl font-semibold">{user.totalBookings}</p>
                        <p className="text-gray-500">Bookings</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-semibold">{user.cancelledBookings}</p>
                        <p className="text-gray-500">Cancelled</p>
                    </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                        <label className="flex items-center gap-2 text-gray-600 font-medium mb-1">
                            <User size={16} className="text-orange-500" /> Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData?.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-gray-50 text-sm disabled:opacity-70"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-gray-600 font-medium mb-1">
                            <Mail size={16} className="text-orange-500" /> Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData?.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border-gray-300 rounded-xl border bg-gray-50 text-sm disabled:opacity-70"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-gray-600 font-medium mb-1">
                            <Calendar size={16} className="text-orange-500" /> Member Since
                        </label>
                        <input
                            type="date"
                            value={formData?.memberSince}
                            disabled={!isEditing}
                            name="memberSince"
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-xl border-gray-300 border text-sm bg-gray-50 disabled:opacity-70"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-gray-600 font-medium mb-1">
                            <Phone size={16} className="text-orange-500" /> Mobile Number
                        </label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData?.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 rounded-xl border-gray-300 border bg-gray-50 text-sm disabled:opacity-70"
                        />
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Profile;
