"use client";
import React, { useState, useEffect } from 'react';
import apiClient from "@/app/axios"; // Import the GROUP_USER_ITEM and ALL_USERS constants
import Link from 'next/link';


const Home = () => {
    //TODO: USERID
    const userId = "6706087b1143dcab37a70f34"; // Assuming the current user has account_id 101
    const [groups, setGroups] = useState([]);
    const [totalOwed, setTotalOwed] = useState({});
    const [newGroup, setNewGroup] = useState({ groupName: '', members: [{ user_id: userId }] }); // Default to current user
    const [showForm, setShowForm] = useState(false);
    const [userName, setUserName] = useState('');
    const [availableUsers, setAvailableUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                let responseData = await apiClient.get(`/v1/expense/all/${userId}`);
                console.log(responseData)
                const data = responseData.data.data.groups;
                setGroups(data);
                const groupNames = await Promise.all(
                    data.map(async (group) => {
                        const groupName = await getGroupName(group.group_id); // Call getGroupName
                        return { ...group, group_name: groupName }; // Add group_name to the group object
                    })
                );
                setGroups(groupNames);
                const foundUser = data.flatMap(group => group.users)
                    .find(member => member.user_id === userId.toString());

                if (foundUser) {
                    setUserName(foundUser.memberName);
                    calculateTotalOwed(data);
                } else {
                    console.warn('User not found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the async function inside useEffect

    }, []); // Add `userId` as a dependency if it changes


    const calculateTotalOwed = (data) => {
        console.log(data)
        let owed = {};
        data.forEach(group => {
            let groupTotal = 0;
            let userInGroup = false;

            group.users.forEach(member => {
                if (member.user_id === userId.toString()) {
                    userInGroup = true;
                }

                member.items.forEach(item => {
                    if (member.user_id === userId) {
                        if (item.paid_by !== userId) {
                            groupTotal -= item.amount;
                        }
                    } else {
                        if (item.paid_by === userId) {
                            groupTotal += item.amount;
                        }
                    }
                });
            });

            if (userInGroup) {
                owed[group.group_id] = groupTotal;
            }
        });

        setTotalOwed(owed);
        return owed;
    };

    // Function to handle adding a new group
    // Function to handle adding a new group
const handleAddGroup = async () => {
    const formattedGroup = {
        name: newGroup.groupName,
        users: newGroup.members
            .filter(member => member.user_id !== "") // Exclude members with empty user_id
            .map(member => ({
                user_id: member.user_id
            })),
    };

    console.log("Sending group data:", JSON.stringify(formattedGroup, null, 2));

    try {
        console.log(formattedGroup)
        const response = await apiClient.post('/v1/groups', formattedGroup, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) { // Check for success using response status
            const addedGroup = response.data; // Axios automatically parses JSON
            setGroups([...groups, addedGroup]);
            setNewGroup({ groupName: '', members: [{ user_id: userId }] }); // Reset to default with current user
            setShowForm(false);

            // Show success notification
            alert("Group created successfully");

            // Refresh the page
            window.location.reload();
        } else {
            console.error('Error adding group:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding group:', error);
    }
};

    
    
    

    // Function to add a new member input field
    const addMember = () => {
        setNewGroup({
            ...newGroup,
            members: [...newGroup.members, { user_id: '' }],
        });
    };

    // Function to handle changes in member input
    const handleMemberChange = (index, value) => {
        const updatedMembers = newGroup.members.map((member, i) =>
            i === index ? { ...member, user_id: value } : member
        );
        setNewGroup({ ...newGroup, members: updatedMembers });
    };
            const getGroupName = async (groupId) => {
        try {
            const response = await apiClient.get(`/v1/get/get-group-name/${groupId}`);
            return response.data.group_name;
        } catch (error) {
            console.error('Error fetching group name:', error);
            return "No Group Name"; // Return default in case of an error
        }
        };

    // Calculate total owed across all groups
    const totalAmountOwed = Object.values(totalOwed).reduce((acc, amount) => acc + amount, 0);

    // Function to filter available users for the dropdown
    const getAvailableUsers = (selectedMembers, currentIndex) => {
        return availableUsers.filter(user =>
            !selectedMembers.includes(user._id) || user._id === selectedMembers[currentIndex] // Allow replacing selected user
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await apiClient.get(`/v1/common/users`);
                setAvailableUsers(responseData.data.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // Call the async function inside useEffect
    }, [])

    return (
        <div className="flex flex-col items-center justify-center p-6 h-screen">
            <h1 className="text-2xl font-bold mb-4">Welcome {userName || 'User'}</h1>
            <div className="w-1/2 mb-8">
                <h2 className="text-2xl font-bold mb-4">Groups:</h2>
                <div className="border-2 border-black p-4 rounded-lg"> {/* Outer container with black border wrapping only group elements */}

                    {Object.keys(groups).filter(groupId => {
                        const group = groups[groupId];
                        return group.users.some(member => member.user_id === userId.toString());
                    }).map(groupId => {
                        const group = groups[groupId];
                        const owedAmount = totalOwed[group.group_id] || 0;

                        return (
                            <div
                                key={groupId}
                                className="mb-4 p-4 rounded border border-gray-300 bg-yellow-100 shadow-md" // Light yellow background and shadow
                            >
                                <Link href={`/groups`}>
                                    <div className="flex justify-between items-center" onClick={() => {
                                        localStorage.setItem('selectedGroupId', group.group_id);
                                    }}>
                                        <h3 className="text-lg font-semibold">{group.group_name}</h3>
                                        <p className="text-sm">
                                            {owedAmount === 0
                                                ? '$0.00'
                                                : `${owedAmount > 0 ? '+' : '-'} $${Math.abs(owedAmount).toFixed(2)}`}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-4">Total
                    expenses: {totalAmountOwed === 0 ? '$0.00' : `${totalAmountOwed > 0 ? '+' : '-'}$${Math.abs(totalAmountOwed).toFixed(2)}`}</h2>
                {totalAmountOwed === 0 ? (
                    <p>You&#39;re all settled up. Awesome!</p>
                ) : (
                    <p>You still have expenses to settle.</p>
                )}
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
                            onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                            className="block w-full mb-4 p-2 border border-gray-300 rounded"
                        />

                        {newGroup.members.map((member, index) => (
                            <div key={index} className="flex mb-4">
                                <select
                                    value={member.user_id}
                                    onChange={(e) => handleMemberChange(index, e.target.value)}
                                    className="block w-1/2 mr-2 p-2 border border-gray-300 rounded"
                                >
                                    <option value="" disabled>Select User</option>
                                    {getAvailableUsers(newGroup.members.map(m => m.user_id), index).map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

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
