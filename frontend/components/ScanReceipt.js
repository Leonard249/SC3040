"use client"; // Ensure this is a client component
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/axios";
import DropdownSelectGroup from "./DropdownSelectGroup";
import FileDropping from "./FileDropping";

const ScanReceipt = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [groups, setGroups] = useState([]); // State to hold the user's groups
  const [selectedGroup, setSelectedGroup] = useState(""); // State for the selected group
  const fileInputRef = useRef(null); // Ref for the file input
  const router = useRouter(); // Call useRouter at the top level
  const [userId, setUserId] = useState(); // Default userId

  // Fetch user's groups when the component mounts or userId changes
  useEffect(() => {
    // Set userId based on query parameter or default value
    //TODO: USERID
    const queryUserId =
      new URLSearchParams(window.location.search).get("userId") ||
      "6706087b1143dcab37a70f34"; // Change to valid user ID
    setUserId(queryUserId);

    // Fetch groups that the user belongs to from GROUP_USER_ITEM
    const fetchData = async () => {
      try {
        let responseData = await apiClient.get(
          `/v1/expense/all/${queryUserId}`
        );
        console.log(responseData);
        const userGroups = responseData.data.data.groups.filter((group) =>
          group.users.some((user) => user.user_id === queryUserId)
        );
        setGroups(userGroups);

        const groupsWithNames = await Promise.all(
          userGroups.map(async (group) => {
            console.log("Fetching group name for groupId:", group.group_id); // Debugging log
            const groupName = await getGroupName(group.group_id); // Fetch group name
            return {
              ...group,
              group_name: groupName, // Add group name to group object
            };
          })
        );
        // Log userId and fetched groups for debugging
        console.log("User ID:", queryUserId, "Groups fetched:", userGroups);

        setGroups(groupsWithNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, [userId]); // Ensure userId is a dependency

  const getGroupName = async (groupId) => {
    try {
      const response = await apiClient.get(`/v1/get/get-group-name/${groupId}`);
      return response.data.group_name;
    } catch (error) {
      console.error("Error fetching group name:", error);
      return "No Group Name"; // Return default in case of an error
    }
  };

  const convertImageToBase64 = (file, callback) => {
    const reader = new FileReader();

    // Define the onload event for the FileReader
    reader.onloadend = () => {
      // reader.result will contain the base64 encoded string
      callback(reader.result);
    };

    // Read the file as a data URL (Base64 encoded string)
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex justify-center items-center h-screen relative">
      {/* Dropdown for selecting group */}
      <DropdownSelectGroup
        className="absolute top-10 z-10 flex items-center space-x-4"
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      ></DropdownSelectGroup>

      <FileDropping
        className={`border-2 p-10 w-3/4 h-2/3 flex flex-col justify-center items-center cursor-pointer relative ${
          dragging ? "border-blue-500" : "border-gray-500"
        }`}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      ></FileDropping>
    </div>
  );
};

export default ScanReceipt;
