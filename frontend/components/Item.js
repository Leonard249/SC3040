import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { AiOutlineDelete } from "react-icons/ai"; // Import the delete icon

// Item component
const Item = ({
  id,
  name,
  amount,
  assignedCount,
  ITEM_TYPE,
  setMembers,
  item,
  setItems,
  onDelete,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id, name, amount },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Calculate display amount based on assigned count
  const displayAmount =
    assignedCount > 0 ? (amount / assignedCount).toFixed(2) : amount.toFixed(2);

  const handlePutBack = () => {
    setMembers((prevMembers) =>
      prevMembers.map((m) => {
        // Find the item by matching the id directly
        if (m.items.find((i) => i.id === id)) {
          return {
            ...m,
            items: m.items.filter((i) => i.id !== id), // Use the passed 'id' to filter out the item
          };
        }
        return m;
      })
    );

    setItems((prevItems) => {
      // Check if the item already exists in the items array
      const existingItem = prevItems.find((i) => i.id === id);
      if (existingItem) {
        return prevItems;
      }
      // Add the item back to the list
      return [...prevItems, { id, name, amount, assignedCount: 0 }];
    });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
    if (confirmDelete) {
      // Call the onDelete function passed from the parent component
      onDelete(id);
    }
  };

  return (
    <div
      ref={drag}
      className={`flex justify-between items-center p-2 mb-2 bg-blue-500 text-white rounded ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <span>
        {name} - ${displayAmount}
      </span>
      <div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <AiOutlineDelete />
        </button>
        {assignedCount > 0 && (
          <button
            onClick={handlePutBack}
            className="text-green-500 hover:text-green-700 ml-2"
          >
            Put Back
          </button>
        )}
      </div>
    </div>
  );
};
export default Item;
