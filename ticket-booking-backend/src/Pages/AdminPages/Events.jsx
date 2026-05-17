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

  /* ---------------- LOAD EVENTS ---------------- */
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

  /* ---------------- FORM VALIDATION ---------------- */
  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Event date is required";
    }

    if (!formData.time) {
      newErrors.time = "Event time is required";
    }

    if (formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }

    if (formData.price < 0) {
      newErrors.price = "Price cannot be negative";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  /* ---------------- MODAL HANDLERS ---------------- */
  const openAddModal = () => {
    setEditingEvent(null);
    setErrors({});
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      capacity: 100,
      price: 0
    });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setErrors({})
    setFormData(event);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (editingEvent) {
      await ApiService.put(`/events/${editingEvent.id}`, formData);
    } else {
      await ApiService.post("/events", formData);
    }

    setShowModal(false);
    loadEvents();
  };

  const handleDelete = async (id) => {
    await ApiService.delete(`/events/${id}`);
    loadEvents();
  };

  const toggleStatus = async (event) => {
    await ApiService.put(`/events/${event.id}`, {
      active: !event.active,
    });
    loadEvents();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage Movies</h1>
          <p className="text-gray-500">Create and manage Movies</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-full"
        >
          <Plus size={18} /> Add Movies
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => {
          const progress =
            ((parseInt(event.bookingCount) / event.capacity) * 100).toFixed(1);

          return (
            <div
              key={event.id}
              className="bg-white p-6 rounded-3xl shadow border"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">{event.title}</h2>
                  <span className="text-xs text-red-500">
                    {event.active ? "active" : "inactive"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Pencil
                    onClick={() => openEditModal(event)}
                    className="cursor-pointer"
                  />
                  <Trash2
                    onClick={() => handleDelete(event.id)}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <p className="text-gray-600 mt-2">{event.description}</p>

              {/* Info */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="flex items-center gap-2 bg-blue-100 p-2 rounded-full">
                  <Calendar size={16} />
                  {event.date.split("T")[0]}
                </div>

                <div className="flex items-center gap-2 bg-purple-100 p-2 rounded-full">
                  <Clock size={16} />
                  {event.time}
                </div>

                <div className="flex items-center gap-2 bg-yellow-100 p-2 rounded-full">
                  <Users size={16} />
                  {event.bookingCount} / {event.capacity}
                </div>

                <div className="flex items-center gap-2 bg-green-100 p-2 rounded-full">
                  <DollarSign size={16} />
                  ${event.price}
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span>Booking</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-indigo-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Toggle */}
              <div className="flex justify-between mt-4 items-center">
                <span>Status</span>
                <button
                  onClick={() => toggleStatus(event)}
                  className={`w-12 h-6 rounded-full ${event.active ? "bg-orange-500" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transform ${event.active ? "translate-x-6" : ""
                      }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-3xl w-full max-w-lg relative">
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setShowModal(false)}
            />

            <h2 className="text-xl mb-4">
              {editingEvent ? "Edit Event" : "Add Event"}
            </h2>

            <div className="space-y-3">
              <div>

                <h1>Movies Title</h1>
                <input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-2 bg-gray-100 rounded-full"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div>

                <h1>Movies Description</h1>

                <input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 bg-gray-100 rounded-full"
                />

                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h1>Movies Date</h1>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                  )}
                </div>
                <div>
                  <h1>Movies Time</h1>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h1> Movies Capacity </h1>
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                  {errors.capacity && (
                    <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                  )}
                </div>
                <div>
                  <h1>Movies Price</h1>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full p-2 bg-gray-100 rounded-full"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-200 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-orange-500 text-white rounded-full"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
