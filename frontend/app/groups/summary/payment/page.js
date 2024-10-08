"use client";

import React, { useState } from "react";
import "./style.css";

const initialItems = ["Item 1", "Item 2", "Item 3"];
const users = ["BlueBird1", "BlueBird2", "BlueBird3", "BlueBird4", "BlueBird5"];

const GroupPaymentPage = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const [unassignedItems, setUnassignedItems] = useState(initialItems);

  const [assignedItems, setAssignedItems] = useState({
    BlueBird1: [],
    BlueBird2: [],
    BlueBird3: [],
    BlueBird4: [],
    BlueBird5: [],
  });

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", item);
  };

  const handleDrop = (e, user) => {
    const item = e.dataTransfer.getData("item");

    // Check if the item is already assigned to the user
    const isAlreadyAssigned = assignedItems[user].includes(item);

    if (!isAlreadyAssigned) {
      setAssignedItems((prev) => ({
        ...prev,
        [user]: [...prev[user], item],
      }));

      // Remove the item from unassignedItems only if it's being assigned
      setUnassignedItems((prev) => prev.filter((i) => i !== item));
    }
  };

  const handleDelete = (item, user) => {
    const newAssignedItems = assignedItems[user].filter((i) => i !== item);

    // Check if the item is the last one assigned to this user
    const itemCount = assignedItems[user].length;
    if (itemCount === 1) {
      // If this is the last item
      setAssignedItems((prev) => ({
        ...prev,
        [user]: newAssignedItems,
      }));
      setUnassignedItems((prev) => [...prev, item]); // Return to unassigned
    } else {
      // If it's not the last item, simply remove it from assigned items
      setAssignedItems((prev) => ({
        ...prev,
        [user]: newAssignedItems,
      }));
    }
  };

  const handleDuplicate = (item) => {
    // Add a duplicate of the item to unassignedItems
    setUnassignedItems((prev) => [...prev, item]);
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "10px",
        flexDirection: "row",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p className="content">Unassigned:</p>
        {unassignedItems.map((item) => (
          <div
            key={item}
            className="draggable"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="box">
        {users.map((user, index) => (
          <div
            key={user}
            className="column"
            style={{
              backgroundColor: index % 2 === 0 ? "#f4f4f4" : "#d9d9d9", // Alternating colors
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, user)}
          >
            <div className="user-name content">{user}</div>
            {assignedItems[user].map((item, index) => (
              <div
                key={index}
                className="draggable"
                onMouseEnter={() => setHoveredItem(item)} // track hovered item
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item}
                {hoveredItem === item && (
                  <>
                    <button onClick={() => handleDelete(item, user)}>
                      Delete
                    </button>
                    <button onClick={() => handleDuplicate(item, user)}>
                      Duplicate
                    </button>
                  </>
                )}
              </div>
            ))}
            <div className="item-count content" style={{ marginTop: "auto" }}>
              Owes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPaymentPage;
