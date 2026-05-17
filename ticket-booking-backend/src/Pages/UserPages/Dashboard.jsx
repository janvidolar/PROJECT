import { useState, useEffect } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import BookingModal from "../../Components/BookingModal.jsx";
import getStatus from "../../Helper/getStatus.js";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../../Services/ApiService.js";

const dashboardStats = [
    {
        id: 1,
        title: "Total Bookings",
        value: 2,
        bg: "bg-orange-50",
        iconBg: "bg-orange-500",
    },
    {
        id: 2,
        title: "Available Events",
        value: 4,
        tag: "Upcoming and Live",
        bg: "bg-purple-50",
        iconBg: "bg-purple-500",
    },
];

const Dashboard = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('authDetail-tickethub'))
    const name = user.name.split(' ')[0]
    const id = user.id;
    const [events, setEvents] = useState([])
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dashBoardStatasctics, setDashBoardStatistics] = useState(dashboardStats)

    const loadEvents = async () => {

        const res = await ApiService.post("/events/list", {})

        console.log(res)
        let status = "";
        let upcommingCount = 0
        let launchedCount = 0
        const formattedData = res.data.events.map((event) => {
            const isoDate = event.date
            const date = new Date(isoDate);
            const options = { month: "short", day: "2-digit", year: "numeric" };
            const formatted = date.toLocaleDateString("en-US", options);
            status = getStatus(event.date, event.time);
            if (status === "LIVE") launchedCount++;
            if (status === "UPCOMING") upcommingCount++;
            return { ...event, date: formatted }
        })
        setEvents(formattedData.slice(0, 3));
        const totalBookings = res?.data?.totalBookings
        const modifiedStats = dashBoardStatasctics.map((item) => {
            if (item.id == 1) {
                return { ...item, value: totalBookings }
            }
            if (item.id == 2) {
                return { ...item, value: launchedCount + upcommingCount }
            }
        })
        setDashBoardStatistics(modifiedStats)
    };

    useEffect(() => {
        loadEvents()
    }, [])

    const handleBooking = async (data) => {
        const payload = { eventId: data.id, userId: id, price: data.total, noOfTickets: data.ticketCount, seats: data.seats }
        const response = await ApiService.post("/tickets/add", payload)
        alert(response?.description)
        setOpen(false)
        loadEvents()
    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w- mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Greeting Section */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Good day, {name}!
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Here's what's happening with your bookings
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                        {dashBoardStatasctics.map((stat) => (
                            <div
                                key={stat.id}
                                className={`p-6 rounded-2xl ${stat.bg} shadow-sm flex justify-between items-center`}
                            >
                                <div className="w-full">
                                    <div className={`w-full flex justify-between items-center text-white  mb-4`}>
                                        <div className={`w-12 h-12 ${stat.iconBg}  flex items-center justify-center rounded-xl`}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            {stat.tag && (
                                                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                                    {stat.tag}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">{stat.title}</p>
                                        <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Popular Events Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-xl font-semibold">Popular Events</h2>
                            <p className="text-gray-500 text-sm">Book your tickets now</p>
                        </div>
                        <button onClick={() => navigate('/user/events')} className="text-orange-500 text-sm font-medium hover:underline">
                            View All
                        </button>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => {

                            return (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-5">
                                            {event.description}
                                        </p>

                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} /> {event.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} /> {event.time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users size={16} /> {parseInt(event.bookingCount)}/{event.capacity} booked
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Availability</span>
                                                <span>{100 - (parseInt(event.bookingCount) / event.capacity) * 100}%</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-gray-200">
                                                <div
                                                    className="h-2 bg-orange-500 rounded-full"
                                                    style={{ width: `${100 - (parseInt(event.bookingCount) / event.capacity) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t pt-4 mt-6">
                                        <div>
                                            <p className="text-xs text-gray-500">Price</p>
                                            <p className="text-xl font-bold">${event.price}</p>
                                        </div>

                                        <button className="bg-orange-500 text-white cursor-pointer px-6 py-2 rounded-full text-sm hover:bg-orange-600 transition" onClick={() => {
                                            setSelectedEvent(event);
                                            setOpen(true);
                                        }}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {open && <BookingModal
                event={selectedEvent}
                isOpen={open}
                onConfirm={handleBooking}
                onClose={() => setOpen(false)}
            />}
        </>
    );
};

export default Dashboard;
