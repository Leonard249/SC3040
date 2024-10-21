"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import AddMember from "@/app/groups/createGroup";
import apiClient from "@/app/axios";

const GroupPage = () => {
  const userId = "6706087b1143dcab37a70f34"; // Assume this is current user
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(null); // Changed from "" to null
  const [groups, setGroups] = useState([]);
  //const [userName, setUserName] = useState("");
  //const [userMap, setUserMap] = useState({});
  const [assignedItems, setAssignedItems] = useState({});

  const getGroupName = async (groupId) => {
    try {
      const response = await apiClient.get(`/v1/get/get-group-name/${groupId}`);
      return response.data.group_name;
    } catch (error) {
      console.error("Error fetching group name:", error);
      return "Unnamed Group";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let responseData = await apiClient.get(`/v1/expense/all/${userId}`);
        const data = responseData.data.data.groups;

        // Fetch group names for each group
        const groupsWithNames = await Promise.all(
          data.map(async (group) => {
            const groupName = await getGroupName(group.group_id);
            return { ...group, group_name: groupName }; // Attach group name to the group object
          })
        );

        setGroups(groupsWithNames);

        const storedGroupId = localStorage.getItem("selectedGroupId");
        // Set the selected group only if groups have been successfully fetched
        if (storedGroupId && groupsWithNames.length > 0) {
          setSelectedGroup(storedGroupId);
        } else {
          setSelectedGroup(data[0]?.group_id); // Set default selected group after fetching
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []); // Run only once on mount

  useEffect(() => {
    const groupIdToUse = selectedGroup; // Use selectedGroup directly

    // Find the selected group data
    const selectedGroupData = groups.find(
      (group) => group.group_id === groupIdToUse
    );

    if (selectedGroupData) {
      const userItems = {};
      const userNames = [];
      selectedGroupData.users.forEach((user) => {
        userNames.push(user.memberName);
        userItems[user.memberName] = user.items
          ? user.items.map((item) => item.item)
          : []; // Ensure items exist before mapping
      });

      setAssignedItems(userItems); // Update assigned items
    }
  }, [selectedGroup, groups]); // Add groups as dependency

  const handleRedirect = (path) => {
    console.log("Selected group being stored:", currentGroup);
    console.log(
      "selected groupid being stored:",
      localStorage.getItem("selectedGroupId")
    );
    localStorage.setItem("selectedGroup", JSON.stringify(currentGroup));
    router.push(path);
  };

  const handleGroupChange = (event) => {
    const newSelectedGroup = event.target.value;
    setSelectedGroup(newSelectedGroup); // Store the group ID
    localStorage.setItem("selectedGroupId", newSelectedGroup); // Save group ID to localStorage
  };

  const currentGroup =
    groups.find((group) => group.group_id === selectedGroup) || {};

  const calculateNetAmountOwed = (currentGroup, userName) => {
    let totalOwed = 0;

    // Iterate through users in the selected group
    currentGroup.users.forEach((user) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-10 space-y-8">
      <div className="group-select">
        <label htmlFor="group-dropdown" className="font-bold">
          Select Group:
        </label>
        <select
          id="group-dropdown"
          value={selectedGroup}
          onChange={handleGroupChange}
          className="group-dropdown"
        >
          <option value="">Select a Group</option>
          {groups.map((group) => (
            <option key={group.group_id} value={group.group_id}>
              {group.group_name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="left-box bg-yellow-100 shadow-md rounded-lg p-6 max-w-3xl mx-auto">
          <div className="top-row flex justify-between items-center mb-4">
            <div className="row-left flex space-x-2 items-center">
              <span className="text-xl font-bold">Group Name:</span>
              <span className="text-xl">
                {currentGroup.group_name || "No group selected"}
              </span>
            </div>
            <div className="row-right flex items-center">
              <img src="logo.svg" className="logo w-8 h-8 mr-2" alt="Logo" />
              <span className="group-id text-sm">#{selectedGroup}</span>
            </div>
          </div>

          <div className="box">
            {currentGroup.users &&
              currentGroup.users.map((user, index) => (
                <div
                  key={user.user_id} // Use user_id as the unique key
                  className="column"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f4f4f4" : "#d9d9d9",
                  }}
                >
                  <div className="user-name content">{user.memberName}</div>{" "}
                  {/* Access memberName directly */}
                  {assignedItems[user.memberName]?.map((item, index) => (
                    <div key={index} className="draggable">
                      {item} {/* Render the item name */}
                    </div>
                  ))}
                  <div
                    className="item-count content"
                    style={{ marginTop: "auto" }}
                  >
                    <p>Owes</p>
                    <p>
                      {calculateNetAmountOwed(currentGroup, user.memberName)}
                    </p>{" "}
                    {/* Pass memberName */}
                  </div>
                </div>
              ))}
          </div>

          {/* Buttons Section */}
          <div className="flex justify-center space-x-4 mt-6">
            {/* Edit allocation button}
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
              onClick={() => handleRedirect("/groups/edit-allocation")}
            >
              Edit Allocation
            </button>
            {*/}
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
              onClick={() => handleRedirect("/groups/settleup")}
            >
              Settle up!
            </button>
          </div>
        </div>

        {/* Right Box */}
        <div className="right-box flex flex-col gap-4">
          <p className="font-bold">Members:</p>
          {currentGroup.users &&
            currentGroup.users.map((member, idx) => (
              <div key={idx} className="member-row">
                <img src="avatar.svg" alt={`${member.memberName}'s avatar`} />
                <span className="grouppage-font">{member.memberName}</span>
              </div>
            ))}
          {selectedGroup && currentGroup && (
            <AddMember group_id={selectedGroup} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
