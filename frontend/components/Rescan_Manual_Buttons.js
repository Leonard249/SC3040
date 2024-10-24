import React, { useState } from "react"; // Import useState to manage modal state
import ManualInput from "./ManualInput";
import { useRouter } from "next/navigation";

const Rescan_Manual_Buttons = ({ className, setItems }) => {
  // Manage the modal open state
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleRescan = () => {
    localStorage.clear();
    router.push("/scan-receipt");
  };

  const handleAddItem = (newItem) => {
    console.log("New item added:", newItem); // Debugging line
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <div className={className}>
      {/* Added flex and gap for spacing */}
      <button
        onClick={handleRescan}
        className="bg-red-500 text-white py-3 px-6 rounded"
      >
        Rescan Receipt
      </button>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-black text-white py-3 px-6 rounded"
      >
        Add Item Manually
      </button>

      <ManualInput
        onClick={() => setModalOpen(true)} // This can be removed if you only need it for opening the modal
        className="bg-black text-white py-3 px-6 rounded"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default Rescan_Manual_Buttons;
