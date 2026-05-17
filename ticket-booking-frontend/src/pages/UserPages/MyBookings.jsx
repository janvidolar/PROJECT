import { useEffect, useState } from "react";
import { Calendar, Clock, Ticket, Download, X, Hash } from "lucide-react";
import formatDate from "../../Helper/formatDate";
import getStatus from "../../Helper/getStatus";
import { ApiService } from "../../Services/ApiService";
// Apni image ko yahan import karein ya direct URL use karein
import bgImage from "../../assets/d.png"; 

const statusStyles = {
  UPCOMING: "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-sm",
  LIVE: "bg-[#6366F1] text-white",
  COMPLETED: "bg-emerald-500 text-white",
  CANCELLED: "bg-gray-400 text-white",
};

const formatBookedOn = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const id = JSON.parse(localStorage.getItem("authDetail-tickethub")).id;

  const loadEventsByUser = async () => {
    const response = await ApiService.get(`/tickets/list/${id}`);
    const mapped = response.data.map((b) => ({
      id: b.id,
      eventName: b.event.title,
      status: getStatus(b.event.date, b.event.time),
      date: formatDate(b.event.date),
      time: b.event.time,
      tickets: b.seats.join(", "),
      bookedOn: formatBookedOn(b.createdAt),
    }));
    setBookings(mapped);
  };

  useEffect(() => {
    loadEventsByUser();
  }, []);

  const handleDelete = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      await ApiService.delete(`/tickets/delete/${bookingId}`);
      loadEventsByUser(); 
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete booking");
    }
  };

  return (
    <div 
      className="p-8 min-h-screen bg-cover bg-center bg-no-repeat bg-fixed font-sans"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})` 
      }}
    >
      {/* Yahan 'linear-gradient' ka use kiya hai taaki background image thodi dark ho jaye 
          aur aapke white cards saaf dikhen. 
      */}

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          My Bookings
        </h1>
        <p className="text-gray-200 mt-1 font-medium drop-shadow-sm">
          Manage your upcoming and past movie experiences
        </p>
      </div>

      {/* BOOKINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white/95 backdrop-blur-sm rounded-[2rem] p-6 shadow-xl border border-white/20 
                       hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#2D2B70]">
                  {booking.eventName}
                </h2>
                <div className="flex items-center gap-1 text-slate-400 mt-1">
                  <Hash size={14} />
                  <span className="text-xs font-semibold uppercase">
                    ID: {String(booking.id).slice(-6)}
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider ${statusStyles[booking.status]}`}
              >
                {booking.status}
              </span>
            </div>

            {/* DATE & TIME */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F5F3FF] rounded-xl">
                  <Calendar size={18} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Date
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {booking.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#F5F3FF] rounded-xl">
                  <Clock size={18} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Time
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {booking.time}
                  </p>
                </div>
              </div>
            </div>

            {/* SEATS */}
            <div className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-2xl mb-6 border border-slate-50">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Ticket size={20} className="text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">
                  Seats Reserved
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {booking.tickets}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Booked on
                </p>
                <p className="text-sm font-semibold text-slate-600">
                  {booking.bookedOn}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl
                             border border-red-200 text-red-500
                             hover:bg-red-50 hover:text-red-600
                             transition-all"
                  title="Delete Booking"
                >
                  <X size={18} />
                </button>

                <button className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-200">
                  <Download size={16} />
                  Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;