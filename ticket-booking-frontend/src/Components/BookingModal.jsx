import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Armchair } from "lucide-react";
import generateSeats from "../Helper/generateSeat";

const BookingModal = ({ event, isOpen, onClose, onConfirm }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockTimer, setLockTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!event) return;

    const generated = generateSeats(event.capacity || 0);
    const bookedSeats = (event.allSeats || []).flat();

    const finalSeats = generated.map((s) =>
      bookedSeats.includes(s.number) ? { ...s, isBooked: true } : s
    );

    setSeats(finalSeats);
  }, [event]);

  useEffect(() => {
    if (selectedSeats.length === 0) return;

    if (lockTimer) clearTimeout(lockTimer);
    setTimeLeft(120);

    const timer = setTimeout(() => {
      setSeats((prev) =>
        prev.map((s) =>
          selectedSeats.includes(s.number) ? { ...s, isBooked: false } : s
        )
      );
      setSelectedSeats([]);
    }, 2 * 60 * 1000);

    setLockTimer(timer);
  }, [selectedSeats]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  if (!isOpen || !event) return null;
  const toggleSeat = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seat.number)
        ? prev.filter((num) => num !== seat.number)
        : [...prev, seat.number]
    );
  };

  const pricePerTicket = event.price;
  const total = (selectedSeats.length * pricePerTicket).toFixed(2);

  const groupedSeats = seats.reduce((group, seat) => {
    const row = seat.number.charAt(0);
    if (!group[row]) group[row] = [];
    group[row].push(seat);
    return group;
  }, {});

  return (
    <div className="fixed overflow-scroll inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-5 rounded-xl shadow-xl">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <button
            className="text-gray-600 hover:text-black text-xl"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* EVENT INFO */}
        <div className="grid grid-cols-2 bg-orange-50 p-3 rounded-lg text-sm space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={18} /> {event.date}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} /> {event.time}
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={18} />{" "}
            {event.capacity - (event.allSeats || []).flat().length} seats
            available
          </div>
          {timeLeft > 0 && (
            <div className="text-center text-red-600 font-semibold mr-6">
              Seats will be released in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>

        {/* SCREEN */}
        <div className="mt-4">
          <div className="text-center text-gray-500 text-sm mb-1">SCREEN</div>
          <div className="mx-auto w-2/3 h-2 bg-gray-300 rounded-full"></div>
        </div>

        {/* SEAT SELECTION */}
        <div className="mt-6 space-y-10 max-h-[250px] overflow-y-auto pr-2">
          {Object.keys(groupedSeats).map((rowKey) => {
            const rowSeats = groupedSeats[rowKey];

            // Auto-shrink seat size based on capacity
            const seatSize =
              seats.length > 300
                ? "w-7 h-7"
                : seats.length > 150
                ? "w-8 h-8"
                : seats.length > 80
                ? "w-9 h-9"
                : "w-10 h-10";

            return (
              <div key={rowKey} className="grid place-items-center relative">
                {/* Dynamic grid */}
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(
                      12,
                      rowSeats.length
                    )}, 1fr)`,
                  }}
                >
                  {rowSeats.map((seat) => (
                    <div
                      key={seat.number}
                      className="flex flex-col items-center"
                    >
                      <button
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.isBooked}
                        className={`
                  ${seatSize}
                  flex items-center justify-center rounded-lg border transition
                  ${
                    seat.isBooked
                      ? "bg-gray-300 border-gray-400 cursor-not-allowed"
                      : selectedSeats.includes(seat.number)
                      ? "bg-orange-500 text-white border-orange-600 scale-105 shadow"
                      : "bg-orange-100 border-orange-300 hover:bg-orange-200"
                  }
                `}
                      >
                        <Armchair
                          size={
                            seatSize.includes("w-7")
                              ? 12
                              : seatSize.includes("w-8")
                              ? 14
                              : 18
                          }
                          className={`
                    ${seat.isBooked ? "text-gray-500" : ""}
                    ${
                      selectedSeats.includes(seat.number)
                        ? "text-white"
                        : "text-orange-700"
                    }
                  `}
                        />
                      </button>

                      <span className="mt-1 text-[10px] font-medium text-gray-700">
                        {seat.number}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* PRICE BOX */}
        <div className="bg-orange-50 border p-3 mt-5 rounded-lg text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Seats:</span>
            <span>{selectedSeats.join(", ") || "None"}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Price:</span>
            <span>${pricePerTicket}</span>
          </div>
          <div className="flex justify-between font-bold text-orange-600 text-lg mt-1">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="w-[48%] py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm({ ...event, total, seats: selectedSeats })}
            disabled={selectedSeats.length === 0}
            className="w-[48%] py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 font-semibold disabled:opacity-40"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
