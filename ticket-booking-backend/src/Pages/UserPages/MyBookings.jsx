import { useEffect, useState } from "react";
import { Calendar, Clock, Ticket, Download, X } from "lucide-react";
import formatDate from "../../Helper/formatDate";
import getStatus from "../../Helper/getStatus";
import { ApiService } from "../../Services/ApiService";

const statusStyles = {
    UPCOMING: "bg-orange-100 text-orange-600",
    COMPLETED: "bg-green-100 text-green-600",
    LIVE: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
};

const formatBookedOn = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
};


const CancelModal = ({ booking, onClose, onConfirm }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-[90%] max-w-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <div className="flex justify-center mb-4">
                    <div className="cursor-pointer w-16 h-16 flex items-center justify-center rounded-full bg-orange-100">
                        <X size={36} className="text-orange-500" />
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-center mb-2">
                    Cancel Booking
                </h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to cancel this booking?
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="cursor-pointer flex-1 border rounded-full py-2 text-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(booking)}
                        className="cursor-pointer flex-1 bg-orange-500 text-white rounded-full py-2 text-sm hover:bg-orange-600"
                    >
                        Sure
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const id = JSON.parse(localStorage.getItem("authDetail-tickethub")).id;

    const loadEventsByUser = async () => {
        const response = await ApiService.get(`/tickets/list/${id}`)

        const mapped = response.data.map((b) => ({
            id: b.id,
            eventName: b.event.title,
            status: getStatus(b.event.date, b.event.time),
            date: formatDate(b.event.date),
            time: b.event.time,
            tickets: b.seats.join(', '),
            bookedOn: formatBookedOn(b.createdAt),
        }));

        setBookings(mapped);
    };

    useEffect(() => {
        loadEventsByUser();
    }, []);

    const handleDownload = async (booking) => {
        try {
            console.log(booking)
            const response = await ApiService.postBlob("/tickets/export/excel", Array.isArray(booking) ? booking : [booking])
            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "tickets.xlsx");

            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Excel download error:", error);
        }

    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">My Bookings</h1>
                <p className="text-sm text-gray-500">
                    View and manage all your ticket bookings
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="border border-gray-100 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h2 className="font-semibold text-base">
                                    {booking.eventName}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Booking ID: {booking.id}
                                </p>
                            </div>
                            <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[booking.status]}`}
                            >
                                {booking.status}
                            </span>
                        </div>

                        <div className="text-sm mb-4 space-y-4">
                            <div className="gap-2 bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center text-xs text-gray-800 space-x-2">
                                    <Calendar size={14} className="text-orange-500" />
                                    <p>Date</p>
                                </div>
                                <p>{booking.date}</p>
                            </div>

                            <div className="gap-2 bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center text-xs text-gray-800 space-x-2">
                                    <Clock size={14} className="text-blue-500" />
                                    <p>Time</p>
                                </div>
                                <span>{booking.time}</span>
                            </div>

                            <div className=" gap-2 bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center text-xs text-gray-800 space-x-2">
                                    <Ticket size={14} className="text-purple-500" />
                                    <p>Tickets</p>
                                </div>
                                <span>{booking.tickets} Seat(s)</span>
                            </div>

                            <div className="gap-2 bg-green-50 rounded-lg p-4">
                                <p className="text-xs text-gray-600">Booked On:</p>
                                <p>{booking.bookedOn}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-sm px-3 py-2 rounded-xl hover:bg-gray-200 transition"
                                onClick={() => handleDownload(booking)}>
                                <Download size={16} />
                                <p>Download</p>
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedBooking(booking);
                                    setShowCancelModal(true);
                                }}
                                className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-xl hover:bg-red-100 transition"
                            >
                                <X size={16} />
                                <p>Cancel</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {bookings.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    No bookings found.
                </div>
            )}

            {showCancelModal && (
                <CancelModal
                    booking={selectedBooking}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={async (bookingToCancel) => {
                        await ApiService.delete(`/tickets/delete/${bookingToCancel.id}`),
                        setShowCancelModal(false);
                        loadEventsByUser()
                    }}
                />
            )}
        </div>
    );
};

export default MyBookings;
