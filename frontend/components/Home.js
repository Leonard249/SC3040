"use client"
import React, { useState, useEffect } from 'react';
import { GROUP_USER_ITEM } from '../lib/constant'; // Import the GROUP_USER_ITEM constant

const Home = () => {
    const userId = "6706087b1143dcab37a70f34";  // Assuming the current user has account_id 101
    const [groups, setGroups] = useState([]);
    const [totalOwed, setTotalOwed] = useState({});
    const [newGroup, setNewGroup] = useState({ groupName: '', members: [{ memberName: '', accountId: '' }] });
    const [showForm, setShowForm] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Use the data from GROUP_USER_ITEM directly
        const data = GROUP_USER_ITEM.data.groups;
        setGroups(data);

        // Find the user's name based on userId
        const foundUser = data.flatMap(group => group.users)
                               .find(member => member.user_id === userId.toString());

        if (foundUser) {
            setUserName(foundUser.memberName);
        } else {
            console.warn('User not found');
        }
    }, []);

    useEffect(() => {
        if (userName) {
            // Call calculateTotalOwed only after userName has been set
            const data = GROUP_USER_ITEM.data.groups; // Get the data again if needed
            calculateTotalOwed(data);
        }
    }, [userName]);

    const calculateTotalOwed = (data) => {
        let owed = {};
    
        // Loop through each group
        data.forEach(group => {
            let groupTotal = 0;
            let userInGroup = false; // Flag to check if the user is part of the group

            console.log(`Calculating for group: ${group.group_id}`);

            // Loop through each member in the group
            group.users.forEach(member => {
                console.log(`Processing member: ${member.memberName}, items: ${member.items}`);

                // Check if the current user is in this group
                if (member.user_id === userId.toString()) {
                    userInGroup = true;
                }

                // Loop through each item in the member's items
                member.items.forEach(item => {
                    console.log(`Item: ${JSON.stringify(item)}`);

                    // If the item is paid by the current user (userName)
                    if (member.user_id === userId) {
                        // Ignore the items paid by the current user in the total
                        if (item.paid_by !== userName) {
                            groupTotal -= item.amount; // Alice owes for this item
                            console.log(`User owes others: ${item.amount} for item: ${item.item}. New group total: ${groupTotal}`);
                        }
                    } else {
                        // For other members
                        if (item.paid_by === userName) { // If the current user paid for this item
                            groupTotal += item.amount; // Others owe Alice
                            console.log(`User owes: ${item.amount} for item: ${item.item}. New group total: ${groupTotal}`);
                        }
                    }
                });
            });

            // If the user was found in the group, update the owed object for that group
            if (userInGroup) {
                owed[group.group_id] = groupTotal;
                console.log(`Final group total for ${group.group_id}: ${groupTotal}`);
            }
        });

        setTotalOwed(owed);
        return owed; // Return the total amount owed across all groups
    };
    
    
    
    
    

   // Function to handle adding a new group
const handleAddGroup = async () => {
    // Construct the new group object in the desired format
    const formattedGroup = {
        name: newGroup.groupName,
        users: newGroup.members.map(member => ({
            user_id: member.user_id // Assuming you have a way to capture or get user_id
        })),
    };

    try {
        const response = await fetch('/api/addGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedGroup),
        });

        if (response.ok) {
            const addedGroup = await response.json();
            setGroups([...groups, addedGroup]); // Append new group to groups state
            setNewGroup({ groupName: '', members: [{ user_id: '' }] }); // Reset the newGroup state
            setShowForm(false);
        } else {
            console.error('Error adding group');
        }
    } catch (error) {
        console.error('Error adding group:', error);
    }
};

// Function to add a new member input field
const addMember = () => {
    setNewGroup({
        ...newGroup,
        members: [...newGroup.members, { user_id: '' }], // Changed memberName to user_id
    });
};

// Function to handle changes in member input
const handleMemberChange = (index, value) => {
    const updatedMembers = newGroup.members.map((member, i) =>
        i === index ? { ...member, user_id: value } : member // Update user_id directly
    );
    setNewGroup({ ...newGroup, members: updatedMembers });
};



    // Calculate total owed across all groups
    const totalAmountOwed = Object.values(totalOwed).reduce((acc, amount) => acc + amount, 0);

    return (
        <div className="flex flex-col items-center justify-center p-6 h-screen">
            <h1 className="text-2xl font-bold mb-4">Welcome {userName || 'User'}</h1>
            <div className="w-1/2 mb-8"> {/* Center the group list */}
            <h2 className="text-2xl font-bold mb-4">
                Groups:
            </h2>
            <div className="border border-black p-4 rounded-lg bg-gray-100">
                <ul className="list-none p-0">
                    {Object.keys(groups).filter(groupId => {
                        // Check if the user is a member of the group
                        const group = groups[groupId];
                        return group.users.some(member => member.user_id === userId.toString());
                    }).map(groupId => {
                        const group = groups[groupId];
                        const owedAmount = totalOwed[group.group_id] || 0;  // Ensure owedAmount is defined

                        return (
                            <li key={groupId} className="mb-2">
                                {group.group_id}: {owedAmount === 0 
                                    ? '$0.00' 
                                    : `${owedAmount > 0 ? '+' : '-'} $${Math.abs(owedAmount).toFixed(2)}`}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>


            <div className="w-1/2"> {/* Center the add group form */}
                <h2 className="text-2xl font-bold mb-4">Total expenses: {totalAmountOwed === 0 ? '$0.00' : `${totalAmountOwed > 0 ? '+' : '-'}$${Math.abs(totalAmountOwed).toFixed(2)}`}</h2>
                {totalAmountOwed === 0 ? (
                    <p>You're all settled up. Awesome!</p>
                ) : (
                    <p>You still have expenses to settle.</p>
                )}
                {/* Add Group Button */}
                <button
                    className="bg-black text-white py-2 px-4 rounded mt-4 hover:opacity-80"
                    onClick={() => setShowForm(!showForm)}
                >
                    Add Group
                </button>

                {/* Add Group form, only visible when showForm is true */}
                {showForm && (
                    <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <h3 className="text-xl font-bold mb-4">Add Group</h3>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroup.groupName}
                            onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                            className="block w-full mb-4 p-2 border border-gray-300 rounded"
                        />

                        {newGroup.members.map((member, index) => (
                            <div key={index} className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="User ID"
                                    value={member.user_id}
                                    onChange={(e) => handleMemberChange(index, e.target.value)}
                                    className="block w-1/2 mr-2 p-2 border border-gray-300 rounded"
                                />
                            </div>
                        ))}


                        {/* Button to add more members */}
                        <button
                            className="text-blue-500 mb-4"
                            onClick={addMember}
                        >
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
        </div>
    );
};

export default Home;
