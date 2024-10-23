import React, { useState } from "react";
import apiClient from "@/app/axios";

const AddGroup = ({ userId, userEmail, groups, setGroups }) => {
  const [newGroup, setNewGroup] = useState({
    groupName: "",
    members: [userEmail], // Start with the current user's email
  });

  const [showForm, setShowForm] = useState(false);

  const handleAddGroup = async () => {
    const formattedGroup = {
      name: newGroup.groupName,
      users: newGroup.members.filter(
        (email) => email !== userEmail && email !== ""
      ), // Exclude current user's email and empty emails
    };

    console.log("Sending group data:", JSON.stringify(formattedGroup, null, 2));

    try {
      const response = await apiClient.post("/v1/groups", formattedGroup, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        const addedGroup = response.data;
        setGroups([...groups, addedGroup]);
        setNewGroup({ groupName: "", members: [userEmail] }); // Reset to include current user only
        setShowForm(false);
        alert("Group created successfully");
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
      members: [...newGroup.members, ""], // Add empty string for new email input
    });
  };

  // Function to handle changes in member input
  const handleMemberChange = (index, value) => {
    const updatedMembers = newGroup.members.map((email, i) =>
      i === index ? value : email
    );
    setNewGroup({ ...newGroup, members: updatedMembers });
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

          {newGroup.members.map((email, index) => (
            <div key={index} className="flex mb-4">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded"
                required
              />
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
