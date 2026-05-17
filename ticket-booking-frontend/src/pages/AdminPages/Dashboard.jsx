import { CalendarCheck, DollarSign, IndianRupee } from "lucide-react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import getStatus from "../../Helper/getStatus";
import formatDate from "../../Helper/formatDate";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Services/ApiService";
// Image import karein (path check kar lein)
import bgImage from "../../assets/o.jpg"; 

const stats = [
  {
    id: 1,
    title: "Total Bookings (24 hours)",
    value: 0,
    bg: "bg-white/80",          // Glassmorphism effect
    iconBg: "bg-[#0ea5e9]",
    icon: CalendarCheck,
  },
  {
    id: 2,
    title: "Total Revenue (24 hours)",
    value: 0,
    bg: "bg-white/80",          // Glassmorphism effect
    iconBg: "bg-[#8b5cf6]",
    icon: IndianRupee,
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashBoardStatasctics, setDashBoardStatistics] = useState(stats);
  const [events, setEvents] = useState([]);
  const [bookingCount, setBookingCount] = useState([]);
  const [bookingRevenue, setBookingRevenue] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingCapacity, setBookingCapacity] = useState([]);
  const [cancelCount, setCancelledCount] = useState([]);
  const [eventStatus, setEventStatus] = useState([]);

  const barChartOptions = {
    chart: { type: "column", backgroundColor: 'rgba(255, 255, 255, 0.9)' },
    title: { text: null },
    credits: { enabled: false },
    colors: ['#3b82f6', '#7c3aed', '#10b981', '#f43f5e'],
    xAxis: {
      categories: bookingRevenue.map((item) => item.name),
    },
    yAxis: {
      min: 0,
      title: { text: "Values" },
    },
    series: [
      { name: "Booking", data: bookingCount },
      { name: "Capacity", data: bookingCapacity },
      { name: "Cancelled", data: cancelCount },
      { name: "Revenue", data: bookingRevenue },
    ],
  };

  const pieChartOptions = {
    chart: { type: "pie", backgroundColor: 'rgba(255, 255, 255, 0.9)' },
    title: { text: "" },
    credits: { enabled: false },
    colors: ['#38bdf8', '#818cf8', '#94a3b8'],
    plotOptions: {
      pie: {
        innerSize: "60%",
        dataLabels: { enabled: true },
      },
    },
    series: [
      {
        name: "Events",
        data: eventStatus,
      },
    ],
  };

  const loadEvents = async () => {
    const res = await ApiService.post("/events/list", { isAdminEvent: true });
    const allEvents = res.data.events;
    setEvents(allEvents);

    const statusCount = { UPCOMING: 0, LIVE: 0, COMPLETED: 0 };

    const modifiedStats = stats.map((item) => {
      if (item.id === 1) {
        return { ...item, value: res.data?.totalBookings || 0 };
      }
      if (item.id === 2) {
        return { ...item, value: res.data?.totalRevenue ? `₹${res.data.totalRevenue}` : "₹0" };
      }
      return item;
    });

    const bookingCountData = allEvents.map(event => ({
      name: event.title,
      y: Number(event.bookingCount)
    }));

    const cancelledCountData = allEvents.map(event => ({
      name: event.title,
      y: Number(event.cancelledCount)
    }));

    const bookingCapacityData = allEvents.map(event => ({
      name: event.title,
      y: Number(event.capacity)
    }));

    const bookingPriceData = allEvents.map(event => ({
      name: event.title,
      y: Number(event.bookingPrice)
    }));

    allEvents.forEach(event => {
      const status = getStatus(event.date, event.time);
      statusCount[status] += 1;
    });

    const chartData = [
      { name: "UPCOMING", y: statusCount.UPCOMING },
      { name: "LIVE", y: statusCount.LIVE },
      { name: "COMPLETED", y: statusCount.COMPLETED },
    ];

    setEventStatus(chartData);
    setBookingCount(bookingCountData);
    setBookingCapacity(bookingCapacityData);
    setBookingRevenue(bookingPriceData);
    setDashBoardStatistics(modifiedStats);
    setCancelledCount(cancelledCountData);
  };

  const loadTickets = async () => {
    const response = await ApiService.get("/tickets/list");
    const tickets = response?.data;

    if (!tickets) return;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentBookings = tickets
      .filter(ticket => new Date(ticket.createdAt) >= twentyFourHoursAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const formatted = recentBookings.map((item) => ({
      id: item.id,
      user: item.user?.name,
      event: item.event?.title,
      date: formatDate(item.event?.date),
      time: item.event?.time,
      tickets: item.seats.join(', '),
      price: item.price,
      status: getStatus(item.event?.date, item.event?.time),
    }));

    setBookings(formatted);
  };

  useEffect(() => { loadEvents(); }, []);
  useEffect(() => { loadTickets(); }, []);

  return (
    <div 
      className="w-full p-6 space-y-6 min-h-screen bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${bgImage})` 
      }}
    >
      {/* HEADER */}
      <div className="backdrop-blur-sm bg-white/30 p-4 rounded-xl inline-block">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-800 font-medium">Manage your ticket booking system</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashBoardStatasctics.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`${item.bg} backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40`}>
              <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                <Icon className="text-white" size={24} />
              </div>
              <p className="text-sm text-gray-700 font-semibold">{item.title}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">{item.value}</h2>
            </div>
          );
        })}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40">
          <h3 className="font-bold text-lg mb-2 text-gray-900">Movies Bookings</h3>
          <p className="text-sm text-gray-600 mb-4">Top performing Movies</p>
          {bookingCapacity.length === 0 && bookingCount.length === 0 && bookingRevenue.length === 0 && cancelCount.length === 0 ? (
            <p className="flex items-center justify-center min-h-[300px] text-xl font-medium text-gray-400">No Data Available</p>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40">
          <h3 className="font-bold text-lg mb-2 text-gray-900">Movies Status</h3>
          <p className="text-sm text-gray-600 mb-4">Distribution overview</p>
          <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
        </div>
      </div>

      {/* RECENT BOOKINGS */}
      {bookings.length > 0 && (
        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/40">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button className="bg-white/80 px-4 py-1 rounded-full text-blue-700 hover:text-blue-900 text-sm font-bold shadow-sm" onClick={() => navigate('/admin/bookings')}>
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-5 flex justify-between items-center border border-gray-100 hover:scale-[1.01] transition-transform">
                <div>
                  <h4 className="font-bold text-gray-900">{booking.event}</h4>
                  <p className="text-sm text-gray-700 font-medium mt-1">
                    {booking.user} • {booking.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                    {booking.tickets} seats
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full capitalize font-bold ${
                    booking.status === 'UPCOMING' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;