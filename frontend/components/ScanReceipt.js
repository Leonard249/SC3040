"use client"; // Ensure this is a client component
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GROUP_USER_ITEM } from '../lib/constant'; // Adjust the import path if necessary

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
        const userGroups = GROUP_USER_ITEM.data.groups.filter(group => 
            group.users.some(user => user.user_id === queryUserId)
        ).map(group => ({
            groupId: group.group_id,
            groupName: group.users.map(user => user.memberName).join(', ') // Combine member names
        }));

        // Log userId and fetched groups for debugging
        console.log('User ID:', queryUserId, 'Groups fetched:', userGroups);
      
        setGroups(userGroups);
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
      if (selectedFile) {
          // Navigate to the next page if the group is selected, passing the selected group ID
          router.push(`/split-page?groupId=${selectedGroup}`);
      }
  };
  

    const handleClick = () => {
        fileInputRef.current.click(); // Trigger the file input when the area is clicked
    };

    const encodeImageToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64data = reader.result; // This is the Base64 encoded string

            // Send the Base64 encoded image to your backend
            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        groupId: selectedGroup,
                        userId,
                        image: base64data,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Upload success:', data);
                // Redirect to the next page after successful upload
                router.push(`/split-page?groupId=${selectedGroup}`);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        };

        reader.readAsDataURL(file); // This starts the encoding process
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
