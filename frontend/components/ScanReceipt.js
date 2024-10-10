"use client"; // Ensure this is a client component
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ScanReceipt = () => {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [groups, setGroups] = useState([]);  // State to hold the user's groups
    const [selectedGroup, setSelectedGroup] = useState(''); // State for the selected group
    const fileInputRef = useRef(null); // Ref for the file input
    const router = useRouter(); // Call useRouter at the top level
    const [userId, setUserId] = useState(102); // Default userId

    // Fetch user's groups when the component mounts or userId changes
    useEffect(() => {
        const { query } = router;

        // Ensure query is defined before accessing its properties
        if (query) {
            // Set userId based on query parameter
            const id = query.userId ? parseInt(query.userId) : 102;
            setUserId(id);
        }

        fetch('/aswe.json')
            .then(response => response.json())
            .then(data => {
                const userGroups = [];

                // Iterate through each group
                Object.keys(data).forEach(groupId => {
                    const group = data[groupId];
                    // Check if any member's account_id matches userId
                    const hasMember = Object.values(group.members).some(member => member.account_id === userId);

                    if (hasMember) {
                        userGroups.push({ groupId, groupName: group.group_name });
                    }
                });

                console.log('User groups fetched:', userGroups); // Log fetched groups for debugging
                setGroups(userGroups);
            })
            .catch(error => console.error('Error fetching groups:', error));
    }, [router, userId]); // Ensure userId is a dependency

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
            // Navigate to the next page if the group is selected
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
            // Navigate to the next page if the group is selected
            router.push(`/split-page?groupId=${selectedGroup}`);
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
                            {group.groupName}
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
