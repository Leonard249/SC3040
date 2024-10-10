"use client"; // Ensure this is a client component
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GROUP_USER_ITEM } from '../lib/constant';
import apiClient from "@/app/axios";

const ScanReceipt = () => {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [groups, setGroups] = useState([]);  // State to hold the user's groups
    const [selectedGroup, setSelectedGroup] = useState(''); // State for the selected group
    const fileInputRef = useRef(null); // Ref for the file input
    const router = useRouter(); // Call useRouter at the top level
    const [userId, setUserId] = useState(); // Default userId

    // Fetch user's groups when the component mounts or userId changes
    useEffect(() => {
        // Set userId based on query parameter or default value
        const queryUserId = new URLSearchParams(window.location.search).get('userId') || "6706087b1143dcab37a70f34"; // Change to valid user ID
        setUserId(queryUserId);
  
        // Fetch groups that the user belongs to from GROUP_USER_ITEM
        const fetchData = async () => {
            try {
                let responseData = await apiClient.get(`/v1/expense/all/${queryUserId}`);
                console.log(responseData)
                const userGroups = responseData.data.data.groups.filter(group =>
                    group.users.some(user => user.user_id === queryUserId)
                ).map(group => ({
                    groupId: group.group_id,
                    groupName: group.users.map(user => user.memberName).join(', ') // Combine member names
                }));

                // Log userId and fetched groups for debugging
                console.log('User ID:', queryUserId, 'Groups fetched:', userGroups);

                setGroups(userGroups);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the async function inside useEffect
      
    }, [userId]); // Ensure userId is a dependency

    const handleDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
  
      // Check if a group is selected
      if (!selectedGroup) {
          alert('Please select a group before uploading.'); // Pop-out message
          window.location.reload(); // Refresh the page
          return; // Prevent routing
      }
  
      // Proceed to navigate if both a file and a group are selected
      if (droppedFile) {
          // Navigate to the next page if the group is selected, passing the selected group ID
          router.push(`/split-page?groupId=${selectedGroup}`);
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
  
  const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Check if a group is selected
      if (!selectedGroup) {
          alert('Please select a group before uploading.'); // Pop-out message
          window.location.reload(); // Refresh the page
          return; // Prevent routing
      }

      // Proceed to navigate if both a file and a group are selected
      if (file) {
          console.log("doing")
          convertImageToBase64(file, (base64String) => {
              console.log('Base64 Encoded Image:', base64String);
              // Now you can use this base64String for further processing
              localStorage.setItem('base64File', base64String); // Store in localStorage
              router.push(`/split-page?groupId=${selectedGroup}`);
          });
          // Navigate to the next page if the group is selected, passing the selected group ID
      }
  };
  

    const handleClick = () => {
        fileInputRef.current.click(); // Trigger the file input when the area is clicked
    };

    return (
        <div className="flex justify-center items-center h-screen relative">
            {/* Dropdown for selecting group */}
            <div className="absolute top-10 z-10">
                <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="" disabled>Select Group</option>
                    {groups.map(group => (
                        <option key={group.groupId} value={group.groupId}>
                            {group.groupId}
                        </option>
                    ))}
                </select>
            </div>
            
            <div
                className={`border-2 p-10 w-3/4 h-2/3 flex flex-col justify-center items-center cursor-pointer relative ${
                    dragging ? 'border-blue-500' : 'border-gray-500'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden" // Hide the file input
                    onChange={handleFileChange}
                />
                <p className="text-center">
                    Drag & Drop your receipt here
                    <br />
                    <br />
                    <span className="text-center">or</span>
                </p>
                {file && <p className="text-center mt-2">Receipt: {file.name}</p>}
                <button onClick={handleClick} className="mt-4 border border-black py-2 px-4 rounded">
                    Click to Upload
                </button>
            </div>
        </div>
    );
};

export default ScanReceipt;
