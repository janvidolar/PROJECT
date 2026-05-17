import { useState, useEffect } from "react";
import { Armchair, X } from "lucide-react";
import generateSeats from "../Helper/generateSeat";

const EditBookingModal = ({
    isEditOpen,
    selectedBooking,
    closeModal,
    handleChange,
    handleSave
}) => {

    if (!isEditOpen || !selectedBooking) return null;

    const initialSeats = selectedBooking.tickets
        ? selectedBooking.tickets.split(",").map(s => s.trim())
        : [];

    const [selectedSeats, setSelectedSeats] = useState(initialSeats);

    useEffect(() => {
        setSelectedSeats(
            selectedBooking.tickets
                ? selectedBooking.tickets.split(",").map(s => s.trim())
                : []
        );
    }, [selectedBooking]);

    const allSeats = generateSeats(selectedBooking.capacity);

    const bookedSeatsInEvent = selectedBooking.allSeats
        ? selectedBooking.allSeats.flat()
        : [];

    const disabledSeats = bookedSeatsInEvent.filter(
        seat => !initialSeats.includes(seat)
    );

    const toggleSeat = (seat) => {
        if (disabledSeats.includes(seat)) return;

        setSelectedSeats(prev =>
            prev.includes(seat)
                ? prev.filter(s => s !== seat)
                : [...prev, seat]
        );
    };

    const saveBooking = () => {
        handleSave({
            ...selectedBooking,
            seats: selectedSeats,
            tickets: selectedSeats.join(", ")
        });
    };

    const seatSize =
        allSeats.length > 300 ? "w-7 h-7"
            : allSeats.length > 150 ? "w-8 h-8"
                : allSeats.length > 80 ? "w-9 h-9"
                    : "w-10 h-10";



    const groupedSeats = {};

    for (let seat of allSeats) {
        const row = seat.number[0];
        if (!groupedSeats[row]) {
            groupedSeats[row] = [];
        }
        groupedSeats[row].push(seat);
    }

    return (
        <div className="fixed min-h-80 inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative shadow-xl
                max-h-[90vh] flex flex-col">

                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={22} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800">Edit Booking</h2>
                <p className="text-sm text-gray-500 mb-5">Update the booking details below</p>

                <div className="space-y-4 overflow-hidden flex-1">

                    <div>
                        <label className="text-sm font-medium">Event Title</label>
                        <input
                            name="event"
                            value={selectedBooking.event || ""}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Date</label>
                            <input
                                name="date"
                                value={selectedBooking.date || ""}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Time</label>
                            <input
                                name="time"
                                value={selectedBooking.time || ""}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Price (₹)</label>
                        <input
                            name="price"
                            value={selectedBooking.price || ""}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Select Seats</label>

                        <div className="mt-4 overflow-y-auto max-h-[250px] space-y-10 bg-orange-50 pr-2 rounded-lg">

                            {Object.keys(groupedSeats).map((rowKey) => {
                                const rowSeats = groupedSeats[rowKey];

                                return (
                                    <div key={rowKey} className="grid place-items-center">

                                        <div
                                            className="grid gap-3"
                                            style={{
                                                gridTemplateColumns: `repeat(${Math.min(12, rowSeats.length)}, 1fr)`
                                            }}
                                        >
                                            {rowSeats.map((seat) => {

                                                const isDisabled = disabledSeats.includes(seat.number);
                                                const isSelected = selectedSeats.includes(seat.number);

                                                return (
                                                    <div key={seat.number} className="flex flex-col items-center">

                                                        <button
                                                            onClick={() => toggleSeat(seat.number)}
                                                            disabled={isDisabled}
                                                            className={`
                    ${seatSize}
                    flex items-center justify-center rounded-lg border transition
                    ${isDisabled
                                                                    ? "bg-gray-300 border-gray-400 cursor-not-allowed"
                                                                    : isSelected
                                                                        ? "bg-orange-500 text-white border-orange-600 scale-105 shadow"
                                                                        : "bg-orange-100 border-orange-300 hover:bg-orange-200"}
                  `}
                                                        >
                                                            <Armchair
                                                                size={
                                                                    seatSize.includes("w-7") ? 12
                                                                        : seatSize.includes("w-8") ? 14
                                                                            : seatSize.includes("w-9") ? 16
                                                                                : 18
                                                                }
                                                                className={` 
                      ${isDisabled ? "text-gray-500" : ""} 
                      ${isSelected ? "text-white" : "text-orange-700"} 
                    `}
                                                            />
                                                        </button>

                                                        <span className="mt-1 text-[10px] font-medium text-gray-700">
                                                            {seat.number}
                                                        </span>

                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-3 text-sm">
                            Selected: {selectedSeats.length ? selectedSeats.join(", ") : "None"}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 shrink-0">
                    <button onClick={closeModal} className="border px-5 py-2 rounded-full">
                        Cancel
                    </button>
                    <button
                        onClick={saveBooking}
                        className="bg-orange-500 text-white px-6 py-2 rounded-full"
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EditBookingModal;
