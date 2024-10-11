"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import AddMember from "@/app/groups/createGroup";
import apiClient from "@/app/axios";


const GroupPage = () => {
  //TODO: USERID
  const userId = "6706087b1143dcab37a70f34"; // Assume this is current user
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(""); // Initialize selectedGroup with an empty string
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");
  const [userMap, setUserMap] = useState({});

  const getGroupName = async (groupId) => {
    try {
      const response = await apiClient.get(`/v1/get/get-group-name/${groupId}`);
      return response.data.group_name;
    } catch (error) {
      console.error("Error fetching group name:", error);
      return "Unnamed Group";
    }
  };
  // Function to save user_id and memberName
  const saveUserMapping = (userId, memberName) => {
    if (!userId || !memberName) {
      console.error("Both userId and memberName are required.");
      return;
    }

    userMap[userId] = memberName; // Save the mapping
    setUserMap(userMap);
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
        let foundUser = false;
        data.forEach((group) => {
          group.users.forEach((member) => {
            if (member.user_id === userId.toString()) {
              setUserName(member.memberName);
              foundUser = true;
            }
          });
        });

        data.forEach((group) => {
          group.users.forEach((user) => {
            saveUserMapping(user.user_id, user.memberName);
          });
        });

        if (!foundUser) {
          console.warn("User not found");
        }

        // Optionally set a default group if none is selected
        if (data.length > 0 && !storedGroupId) {
          setSelectedGroup(data[0].group_id); // Set default selected group after fetching
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (localStorage.getItem('selectedGroupId')) {
      setSelectedGroup(localStorage.getItem('selectedGroupId'))
    }

    fetchData(); // Call the async function inside useEffect
  }, []); // Run only once on mount

  const handleRedirect = (path) => {
    localStorage.setItem("selectedGroup", selectedGroup); // Store in local storage
    router.push(path);
  };

  const handleGroupChange = (event) => {
    const newSelectedGroup = event.target.value;
    setSelectedGroup(newSelectedGroup);
    localStorage.setItem("selectedGroup", newSelectedGroup); // Store the new selection in local storage
  };

  const currentGroup =
    groups.find((group) => group.group_id === selectedGroup) || {};

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="group-select">
        <label htmlFor="group-dropdown" className="grouppage-font">
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
          {/* Header Section */}
          <div className="top-row flex justify-between items-center mb-4">
            <div className="row-left flex space-x-2 items-center">
              <span className="text-xl font-bold">Group Name:</span>
              <span className="text-xl font-semibold">
        {currentGroup.group_name || "No group selected"}
      </span>
            </div>
            <div className="row-right flex items-center">
              <img src="logo.svg" className="logo w-8 h-8 mr-2" alt="Logo"/>
              <span className="group-id font-semibold text-sm">#{selectedGroup}</span>
            </div>
          </div>

          {/* Activity Section */}
          <div className="content mb-6">
            <p className="font-semibold text-lg">Activity:</p>
            <div className="activity-list mt-2 space-y-2 text-sm">
              {currentGroup.users &&
                  currentGroup.users.map((user) =>
                      user.items.map((item) => (
                          <p key={item.id}>
                            <span className="font-bold">{user.memberName}</span> bought
                            <span className="font-semibold"> {item.item}</span> for
                            <span className="font-semibold"> S${item.amount}</span>, paid for by
                            <span className="font-semibold"> {userMap[item.paid_by]}</span>
                          </p>
                      ))
                  )}
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition"
                onClick={() => handleRedirect("/groups/edit-allocation")}
            >
              Edit Allocation
            </button>
            <button
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                onClick={() => handleRedirect("/groups/summary")}
            >
              Settle up!
            </button>
          </div>
        </div>
        <div className="right-box">
          <p className="grouppage-font">Members:</p>
          {currentGroup.users &&
              currentGroup.users.map((member, idx) => (
                  <div key={idx} className="member-row">
                    <img
                        src="avatar.svg"
                        alt={`${member.memberName}'s avatar`}
                    ></img>
                    <span className="grouppage-font">{member.memberName}</span>
                  </div>
              ))}
          {selectedGroup && currentGroup && (
              <AddMember group_id={selectedGroup}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
