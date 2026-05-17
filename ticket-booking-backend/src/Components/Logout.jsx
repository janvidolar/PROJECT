// ================= Logout Confirm Modal =================
import { X, DoorOpen } from "lucide-react";
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-[90%] max-w-md p-6 shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center bg-orange-100 rounded-full">
            <DoorOpen className="text-orange-500" size={28} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center mb-2">Logout</h2>

        {/* Description */}
        <p className="text-center text-gray-500 text-sm mb-6">
          Are you sure you want to logout to TicketHub?
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button className=" cursor-pointer rounded-full px-8 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-orange-500 py-2 cursor-pointer hover:bg-orange-600 text-white rounded-full px-8"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal