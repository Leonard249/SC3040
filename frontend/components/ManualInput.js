import React, { useEffect, useState } from "react";

const ManualInput = ({ onClick, className, isOpen, onClose, onAddItem }) => {
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName && amount) {
      const newItem = {
        id: Date.now(),
        name: itemName,
        amount: parseFloat(amount),
        assignedCount: 0,
      };
      console.log("Adding item:", newItem);
      onAddItem(newItem);
      setItemName("");
      setAmount("");
      onClose();
    } else {
      alert("Please fill in all fields");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualInput;
