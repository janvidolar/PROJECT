import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import BookingModal from "../../Components/BookingModal.jsx";
import getStatus from "../../Helper/getStatus.js";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Services/ApiService.js";
// Background image ko import karein (agar image folder me hai) ya direct URL use karein
import bgTheater from "../../assets/d.png"; 

const dashboardStats = [
  {
    id: 1,
    title: "Total Bookings (24 hours)",
    value: 0,
    bg: "bg-white/80", // Thoda transparent background stats ke liye
    iconBg: "bg-indigo-500",
  },
  {
    id: 2,
    title: "Available Movies",
    value: 0,
    tag: "Upcoming & Live",
    bg: "bg-white/80",
    iconBg: "bg-purple-500",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("authDetail-tickethub"));
  const name = user?.name?.split(" ")[0] || "Guest";

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(dashboardStats);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = async () => {
    const res = await ApiService.post("/events/list", {});
    let upcoming = 0;
    let live = 0;

    const formatted = res.data.events.map((event) => {
      const status = getStatus(event.date, event.time);
      if (status === "UPCOMING") upcoming++;
      if (status === "LIVE") live++;

      return {
        ...event,
        date: new Date(event.date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };
    });

    setEvents(formatted.slice(0, 3));

    setStats((prev) =>
      prev.map((s) => {
        if (s.id === 1) return { ...s, value: res.data.totalBookings };
        if (s.id === 2) return { ...s, value: upcoming + live };
        return s;
      })
    );
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div 
      className="min-h-screen px-6 py-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgTheater})` }}
    >
      {/* Upar 'linear-gradient' isliye dala hai taaki image ke upar halka dark layer aa jaye, 
          jisse aapka white text aur cards saaf dikhen.
      */}

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Good day, {name}</h1>
        <p className="text-gray-200">
          Hello {name}, manage your ticket bookings
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`rounded-2xl p-6 shadow-xl backdrop-blur-sm border border-white/20 ${stat.bg}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700 font-medium">{stat.title}</p>
                <h2 className="text-3xl font-bold mt-1 text-indigo-900">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.iconBg}`}
              >
                <Users size={24} />
              </div>
            </div>

            {stat.tag && (
              <span className="inline-block mt-5 text-xs font-bold
                               text-purple-700 bg-purple-100 px-3.5 py-1.5 rounded-full">
                {stat.tag}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* POPULAR MOVIES */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white drop-shadow-md">
            Popular Movies
          </h2>
          <p className="text-gray-200">Book your tickets now</p>
        </div>
        <button
          onClick={() => navigate("/user/events")}
          className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-md transition text-sm font-medium"
        >
          View All →
        </button>
      </div>

      {/* MOVIE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const bookedPercent = (event.bookingCount / event.capacity) * 100;
          const available = 100 - bookedPercent;

          return (
            <div
              key={event.id}
              className="bg-white/95 rounded-2xl p-6 border border-white/20 shadow-2xl hover:scale-[1.02] transition-transform duration-300"
            >
              <h3 className="text-xl font-bold text-indigo-900 mb-1">
                {event.title}
              </h3>

              <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2.5 text-sm text-gray-700">
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} className="text-indigo-500" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={18} className="text-indigo-500" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2.5">
                  <Users size={18} className="text-indigo-500" />
                  {event.bookingCount} / {event.capacity} booked
                </div>
              </div>

              {/* AVAILABILITY */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">Availability</span>
                  <span className="text-indigo-600 font-bold">
                    {Math.round(available)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${available}%` }}
                  />
                </div>
              </div>

              {/* PRICE + BUTTON */}
              <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
                  <p className="text-2xl font-black text-indigo-900">
                    ₹{event.price}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setOpen(true);
                  }}
                  className="px-6 py-2.5 rounded-full text-sm font-bold
                             text-white bg-gradient-to-r from-indigo-600 to-purple-600
                             hover:from-indigo-700 hover:to-purple-700
                             shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <BookingModal
          event={selectedEvent}
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;