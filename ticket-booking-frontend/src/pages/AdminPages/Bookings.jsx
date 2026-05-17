import { useEffect, useState } from "react";
import { Pencil, X, Download, ChevronDown, Search, XCircle } from "lucide-react";
import getStatus from "../../Helper/getStatus";
import formatDate from "../../Helper/formatDate";
import EditBookingModal from "../../Components/EditBookingModal";
import { ApiService } from "../../Services/ApiService";
// Image path check kar lein
import bgImage from "../../assets/o.jpg"; 

export default function ManageBookings() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [eventFilter, setEventFilter] = useState("");

    const loadTickets = async () => {
        const response = await ApiService.get("/tickets/list");
        const tickets = response?.data;
        if (!tickets) return;

        const formatted = tickets.map((item) => ({
            id: item.id,
            user: item.user?.name,
            event: item.event?.title,
            date: formatDate(item.event?.date),
            rawDate: item.event?.date,
            time: item.event?.time,
            tickets: item.seats.join(', '),
            price: item.price,
            status: getStatus(item.event?.date, item.event?.time),
            capacity: item?.event?.capacity
        }));

        setBookings(formatted);
        setFilteredBookings(formatted);
    };

    useEffect(() => { loadTickets(); }, []);

    useEffect(() => {
        let temp = [...bookings];
        if (searchTerm.trim() !== "") {
            temp = temp.filter((b) =>
                b.id.toString().includes(searchTerm) ||
                b.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.event.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (statusFilter !== "") temp = temp.filter((b) => b.status === statusFilter);
        if (eventFilter !== "") temp = temp.filter((b) => b.event === eventFilter);
        setFilteredBookings(temp);
    }, [searchTerm, statusFilter, eventFilter, bookings]);

    const openEditModal = (booking) => { setSelectedBooking(booking); setIsEditOpen(true); };
    const closeModal = () => { setIsEditOpen(false); setSelectedBooking(null); };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedBooking((prev) => ({ ...prev, [name]: value }));
    };
    const handleSave = async (data) => {
        await ApiService.put(`/tickets/update/${data.id}`, data);
        loadTickets();
        closeModal();
    };
    const deleteBooking = async (booking) => {
        await ApiService.delete(`/tickets/delete/${booking.id}`);
        loadTickets();
    };

    const handleExport = async (booking) => {
        try {
            const response = await ApiService.postBlob("/tickets/export/excel", Array.isArray(booking) ? booking : [booking]);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "tickets.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) { console.error("Excel download error:", error); }
    };

    const uniqueEvents = [...new Set(bookings.map((b) => b.event))];

    return (
        <div 
            className="w-full p-6 min-h-screen bg-cover bg-center bg-fixed"
            style={{ 
                backgroundImage: `linear-gradient(rgba(241, 245, 249, 0.9), rgba(241, 245, 249, 0.9)), url(${bgImage})` 
            }}
        >
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Manage Bookings</h1>
                <p className="text-slate-500 mt-1">View, create, and manage all ticket bookings</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex items-center">
                        <span className="absolute left-2 bg-sky-500 text-white rounded-full p-1.5 shadow-sm">
                            <Search size={14} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by ID, user..."
                            className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm w-64 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none px-4 py-2 pr-10 rounded-full border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-600 font-medium"
                        >
                            <option value="">All Status</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="LIVE">Live</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {/* All Events Dropdown */}
                    <div className="relative">
                        <select
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value)}
                            className="appearance-none px-4 py-2 pr-10 rounded-full border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-600 font-medium"
                        >
                            <option value="">All Movies</option>
                            {uniqueEvents.map((event, index) => (
                                event && <option key={index} value={event}>{event}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition font-medium text-sm text-slate-700"
                    onClick={() => handleExport(filteredBookings)}>
                    <Download size={16} className="text-sky-500" /> Export
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
                <table className="w-full text-sm">
                    <thead className="bg-[#60a5fa] text-white">
                        <tr>
                            <th className="p-4 text-left font-semibold">Booking ID</th>
                            <th className="p-4 text-left font-semibold">User</th>
                            <th className="p-4 text-left font-semibold">Movies</th>
                            <th className="p-4 text-left font-semibold">Date</th>
                            <th className="p-4 text-left font-semibold">Time</th>
                            <th className="p-4 text-left font-semibold">Tickets</th>
                            <th className="p-4 text-left font-semibold">Status</th>
                            <th className="p-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-600 font-medium">{booking.id}</td>
                                <td className="p-4 text-slate-700">{booking.user}</td>
                                <td className="p-4 font-medium text-slate-800">{booking.event}</td>
                                <td className="p-4 text-slate-500">{booking.date}</td>
                                <td className="p-4 text-slate-500">{booking.time}</td>
                                <td className="p-4 font-medium">{booking.tickets}</td>
                                <td className="p-4">
                                    <span className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-sm ${
                                        booking.status === "UPCOMING" ? "bg-rose-400" : 
                                        booking.status === "LIVE" ? "bg-amber-400" : "bg-emerald-400"
                                    }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center gap-1">
                                        <button onClick={() => openEditModal(booking)} className="p-2 text-slate-400 hover:text-sky-600 transition cursor-pointer">
                                            <Pencil size={18} />
                                        </button>
                                        <button onClick={() => deleteBooking(booking)} className="p-2 text-slate-400 hover:text-rose-600 transition cursor-pointer">
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EditBookingModal
                isEditOpen={isEditOpen}
                selectedBooking={selectedBooking}
                closeModal={closeModal}
                handleChange={handleChange}
                handleSave={handleSave}
            />
        </div>
    );
}