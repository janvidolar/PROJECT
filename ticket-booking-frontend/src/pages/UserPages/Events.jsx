import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import BookingModal from "../../Components/BookingModal.jsx";
import { ApiService } from "../../Services/ApiService.js";
// Apni image ka sahi path yahan check karein
import bgTheater from "../../assets/d.png"; 

const Events = () => {
  const user = JSON.parse(localStorage.getItem("authDetail-tickethub"));
  const id = user.id;

  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const loadEvents = async () => {
    const res = await ApiService.post("/events/list", {});
    const formattedData = res.data.events.map((event) => {
      const date = new Date(event.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      return { ...event, date };
    });
    setEvents(formattedData);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleBooking = async (data) => {
    const payload = {
      eventId: data.id,
      userId: id,
      price: data.total,
      noOfTickets: data.ticketCount,
      seats: data.seats,
    };
    await ApiService.post("/tickets/add", payload);
    loadEvents();
    setOpen(false);
  };

  return (
    <div 
      className="p-8 min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgTheater})` 
      }}
    >
      {/* PAGE HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg">
          Movies
        </h1>
        <p className="text-gray-200 font-medium mt-2 text-lg drop-shadow-md">
          Discover & book your favorite movies now
        </p>
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => {
          const booked =
            (parseInt(event.bookingCount) / event.capacity) * 100;
          const available = Math.round(100 - booked);

          return (
            <div
              key={event.id}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-7
                         border border-white/20 shadow-2xl
                         hover:shadow-indigo-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                {event.title}
              </h3>

              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {event.description}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                  <Calendar size={18} className="text-cyan-500" />
                  {event.date}
                </div>

                <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                  <Clock size={18} className="text-cyan-500" />
                  {event.time}
                </div>

                <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                  <Users size={18} className="text-cyan-500" />
                  <span>
                    {event.bookingCount}/{event.capacity} booked
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold uppercase mb-2.5 tracking-wide">
                  <span className="text-gray-500">Availability</span>
                  <span className="text-cyan-600 font-extrabold">
                    {available}%
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${available}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Price
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    ₹{event.price}
                  </p>
                </div>

                <button
                  className="px-8 py-3 rounded-full text-sm font-semibold
                               bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                               hover:from-indigo-600 hover:to-purple-700
                               transition-all duration-300 shadow-lg hover:shadow-xl
                               active:scale-95"
                  onClick={() => {
                    setSelectedEvent(event);
                    setOpen(true);
                  }}
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
          onConfirm={handleBooking}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default Events;