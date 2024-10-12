import React, { useState, useEffect } from "react";
import apiClient from "@/app/axios";

const AddGroup = ({ userId, groups, setGroups, availableUsers }) => {
  // Function to handle adding a new group
  const [newGroup, setNewGroup] = useState({
    groupName: "",
    members: [{ user_id: userId }],
  }); // Default to current user

  const [showForm, setShowForm] = useState(false);

  const handleAddGroup = async () => {
    const formattedGroup = {
      name: newGroup.groupName,
      users: newGroup.members
        .filter((member) => member.user_id !== "") // Exclude members with empty user_id
        .map((member) => ({
          user_id: member.user_id,
        })),
    };

    console.log("Sending group data:", JSON.stringify(formattedGroup, null, 2));

    try {
      console.log(formattedGroup);
      const response = await apiClient.post("/v1/groups", formattedGroup, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if ((response.status === 200) | (response.status === 201)) {
        // Check for success using response status
        const addedGroup = response.data; // Axios automatically parses JSON
        setGroups([...groups, addedGroup]);
        setNewGroup({ groupName: "", members: [{ user_id: userId }] }); // Reset to default with current user
        setShowForm(false);

        // Show success notification
        alert("Group created successfully");

        // Refresh the page
        window.location.reload();
      } else {
        console.error("Error adding group:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  // Function to add a new member input field
  const addMember = () => {
    setNewGroup({
      ...newGroup,
      members: [...newGroup.members, { user_id: "" }],
    });
  };

  // Function to handle changes in member input
  const handleMemberChange = (index, value) => {
    const updatedMembers = newGroup.members.map((member, i) =>
      i === index ? { ...member, user_id: value } : member
    );
    setNewGroup({ ...newGroup, members: updatedMembers });
  };

  // Function to filter available users for the dropdown
  const getAvailableUsers = (selectedMembers, currentIndex) => {
    return availableUsers.filter(
      (user) =>
        !selectedMembers.includes(user._id) ||
        user._id === selectedMembers[currentIndex] // Allow replacing selected user
    );
  };

  return (
    <div>
      <button
        className="bg-black text-white py-2 px-4 rounded mt-4 hover:opacity-80"
        onClick={() => setShowForm(!showForm)}
      >
        Add Group
      </button>

      {showForm && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-xl font-bold mb-4">Add Group</h3>
          <input
            type="text"
            placeholder="Group Name"
            value={newGroup.groupName}
            onChange={(e) =>
              setNewGroup({ ...newGroup, groupName: e.target.value })
            }
            className="block w-full mb-4 p-2 border border-gray-300 rounded"
          />

          {newGroup.members.map((member, index) => (
            <div key={index} className="flex mb-4">
              <select
                value={member.user_id}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="block w-1/2 mr-2 p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  Select User
                </option>
                {getAvailableUsers(
                  newGroup.members.map((m) => m.user_id),
                  index
                ).map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button className="text-blue-500 mb-4" onClick={addMember}>
            + Add Another Member
          </button>

          <button
            onClick={handleAddGroup}
            className="flex justify-center items-center bg-black text-white py-2 pl-4 pr-4 rounded hover:opacity-80"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AddGroup;
