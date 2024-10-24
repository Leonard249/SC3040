"use client";

import React, { useState, useEffect } from "react";
import "./style.css";
import { GROUP_USER_ITEM, calculateNetAmountOwed } from "../../../lib/constant"; // Import GROUP_USER_ITEM

const EditAllocationPage = ({ selectedGroupId }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [assignedItems, setAssignedItems] = useState({});
  const [users, setUsers] = useState([]); // Use state to store users
  const [selectedGroup, setSelectedGroup] = useState({});

  const dummyGroupId = "group_id_1"; // Define dummy data for testing purposes

  useEffect(() => {
    const groupIdToUse = selectedGroupId || dummyGroupId; // Use dummy data if selectedGroupId is not provided

    // Find the selected group data
    const selectedGroup = GROUP_USER_ITEM.data.groups.find(
      (group) => group.group_id === groupIdToUse
    );
    setSelectedGroup(selectedGroup);

    if (selectedGroup) {
      const userItems = {};
      const userNames = []; // Temporary array to hold user names
      selectedGroup.users.forEach((user) => {
        userNames.push(user.memberName); // Add member names to users array
        userItems[user.memberName] = user.items.map((item) => item.item); // Assign items to each user
      });

      setUsers(userNames); // Set users state
      setAssignedItems(userItems); // Set the assigned items state
    }
  }, [selectedGroupId]); // Dependency on selectedGroupId

  /*const handleDrop = (e, user) => {
    e.preventDefault(); // Prevent default behavior
    const item = e.dataTransfer.getData("text/plain");
    setAssignedItems((prev) => ({
      ...prev,
      [user]: [...(prev[user] || []), item], // Ensure prev[user] is an array
    }));
  };

  const handleDelete = (item, user) => {
    setAssignedItems((prev) => ({
      ...prev,
      [user]: prev[user].filter((i) => i !== item),
    }));
  };

  const handleDuplicate = (item, user) => {
    setAssignedItems((prev) => ({
      ...prev,
      [user]: [...(prev[user] || []), item], // Ensure prev[user] is an array
    }));
  };
  */

  const calculateNetAmountOwed = (selectedGroup, userName) => {
    let totalOwed = 0;

    // Iterate through users in the selected group
    selectedGroup.users.forEach((user) => {
      // Check if the current user is not the one we are calculating for
      if (user.memberName === userName) {
        // For each item paid by this user
        user.items.forEach((item) => {
          // Add the item's amount to totalOwed for the specified user
          if (item.paid_by !== user.user_id) {
            totalOwed += item.amount;
          }
        });
      }
    });
    return totalOwed; // Return the net amount owed
  };

  return (
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
          {assignedItems[user]?.map((item, index) => (
            <div
              key={index}
              className="draggable"
              //onMouseEnter={() => setHoveredItem(item)} // Track hovered item
              //onMouseLeave={() => setHoveredItem(null)}
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
            <p>Owes</p>
            <p>{calculateNetAmountOwed(selectedGroup, user)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditAllocationPage;
