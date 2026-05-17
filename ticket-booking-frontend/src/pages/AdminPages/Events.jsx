import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  Users,
  DollarSign,
  X
} from "lucide-react";

import { ApiService } from "../../Services/ApiService";
// Image path check kar lein
import bgImage from "../../assets/o.jpg"; 

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    capacity: 100,
    price: 0
  });

  const loadEvents = async () => {
    const res = await ApiService.post("/events/list", {
      isAdminEvent: true,
      isEventPage: true
    });
    setEvents(res.data.events);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Movies title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Movies date is required";
    if (!formData.time) newErrors.time = "Movies time is required";
    if (formData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setErrors({});
    setFormData({ title: "", description: "", date: "", time: "", capacity: 100, price: 0 });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setErrors({});
    setFormData(event);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingEvent) {
        await ApiService.put(`/events/${editingEvent.id}`, formData);
      } else {
        await ApiService.post("/events", formData);
      }
      setShowModal(false);
      loadEvents();
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  const handleDelete = async (id) => {
    await ApiService.delete(`/events/${id}`);
    loadEvents();
  };

  const toggleStatus = async (event) => {
    await ApiService.put(`/events/${event.id}`, { active: !event.active });
    loadEvents();
  };

  return (
    <div 
      className="p-8 min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.85), rgba(248, 250, 252, 0.85)), url(${bgImage})` 
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 backdrop-blur-sm bg-white/30 p-4 rounded-3xl border border-white/40">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Movies</h1>
          <p className="text-base text-gray-600 mt-1 font-medium">Create and manage your Movies</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#ff6b00] hover:bg-[#e66000] text-white px-6 py-2.5 rounded-full text-base font-bold shadow-md transition-all active:scale-95"
        >
          <Plus size={20} /> Add Movies
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => {
          const progress = ((parseInt(event.bookingCount) / event.capacity) * 100).toFixed(1);

          return (
            <div key={event.id} className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-white/60 hover:border-sky-300 transition-all group">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{event.title}</h2>
                  <span className={`text-xs font-bold uppercase tracking-widest ${event.active ? "text-sky-500" : "text-rose-400"}`}>
                    {event.active ? "active" : "inactive"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Pencil size={20} onClick={() => openEditModal(event)} className="cursor-pointer text-slate-500 hover:text-sky-500 transition-colors" />
                  <Trash2 size={20} onClick={() => handleDelete(event.id)} className="cursor-pointer text-slate-500 hover:text-rose-500 transition-colors" />
                </div>
              </div>

              <p className="text-slate-600 mt-3 text-[15px] leading-relaxed line-clamp-2 italic">"{event.description}"</p>

              {/* Info Chips */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="flex items-center gap-2 bg-blue-100/50 text-slate-700 p-3 rounded-2xl text-sm font-bold">
                  <Calendar size={16} className="text-sky-500" />
                  {event.date.split("T")[0]}
                </div>
                <div className="flex items-center gap-2 bg-purple-100/50 text-slate-700 p-3 rounded-2xl text-sm font-bold">
                  <Clock size={16} className="text-purple-500" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2 bg-amber-100/50 text-slate-700 p-3 rounded-2xl text-sm font-bold">
                  <Users size={16} className="text-amber-500" />
                  {event.bookingCount} / {event.capacity}
                </div>
                <div className="flex items-center gap-2 bg-emerald-100/50 text-slate-700 p-3 rounded-2xl text-sm font-bold">
                  <DollarSign size={16} className="text-emerald-500" />
                  ₹{event.price}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-tight">Booking</span>
                  <span className="font-bold text-sky-600 text-base">{progress}%</span>
                </div>
                <div className="h-2.5 bg-slate-200/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex justify-between mt-6 pt-4 border-t border-white/40 items-center">
                <span className="text-[15px] font-bold text-slate-700">Movies Visibility</span>
                <button
                  onClick={() => toggleStatus(event)}
                  className={`w-12 h-6 rounded-full transition-all relative ${event.active ? "bg-[#ff6b00]" : "bg-slate-300"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${event.active ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] w-full max-w-lg relative shadow-2xl border border-white/20">
            <X className="absolute top-6 right-6 cursor-pointer text-slate-400 hover:text-slate-600" size={24} onClick={() => setShowModal(false)} />

            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {editingEvent ? "Update Movies" : "Create New Movies"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-500 uppercase ml-1 block mb-1">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                />
                {errors.title && <p className="text-red-500 text-xs ml-1 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="text-sm font-bold text-slate-500 uppercase ml-1 block mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                  rows="2"
                />
                {errors.description && <p className="text-red-500 text-xs ml-1 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase ml-1 block mb-1">Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-base outline-none focus:ring-2 focus:ring-sky-200" />
                  {errors.date && <p className="text-red-500 text-xs ml-1 mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase ml-1 block mb-1">Time</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-base outline-none focus:ring-2 focus:ring-sky-200" />
                  {errors.time && <p className="text-red-500 text-xs ml-1 mt-1">{errors.time}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase ml-1 block mb-1">Capacity</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-base outline-none focus:ring-2 focus:ring-sky-200" />
                  {errors.capacity && <p className="text-red-500 text-xs ml-1 mt-1">{errors.capacity}</p>}
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase ml-1 block mb-1">Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-base outline-none focus:ring-2 focus:ring-sky-200" />
                  {errors.price && <p className="text-red-500 text-xs ml-1 mt-1">{errors.price}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#ff6b00] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-[#e66000] transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;