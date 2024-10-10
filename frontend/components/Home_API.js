"use client"
import React, { useState, useEffect } from 'react';

const Home = () => {
    const userId = 102;  // Assuming the current user has account_id 102
    const [groups, setGroups] = useState([]);
    const [totalOwed, setTotalOwed] = useState({});
    const [newGroup, setNewGroup] = useState({ groupName: '', members: [{ memberName: '', accountId: '' }] });
    const [showForm, setShowForm] = useState(false);
    const [userName, setUserName] = useState('');
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        // Fetch group data from the database
        fetch('/api/groups')  // Assuming this endpoint returns GROUP_USER_ITEM data
            .then(response => response.json())
            .then(data => {
                setGroups(data.groups);  // Set the groups from the fetched data
                calculateTotalOwed(data.groups);

                // Find the user's name based on userId
                let foundUser = false;
                data.groups.forEach(group => {
                    group.users.forEach(member => {
                        if (member.user_id === userId) {
                            setUserName(member.memberName);  // Set the user's name in state
                            foundUser = true;
                        }
                    });
                });

                // Optional: If no user was found, handle it
                if (!foundUser) {
                    console.warn('User not found');
                }
            })
            .catch(error => console.error('Error fetching data:', error));

        // Fetch all users (this replaces fetching from aswe.json)
        fetch('/api/users')  // Assuming this endpoint returns ALL_USERS data
            .then(response => response.json())
            .then(data => {
                setAllUsers(data);  // Set all users from the fetched data
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleNavigate = () => {
        router.push(`/scan-receipt?userId=${userId}`);
    };

    // Calculate total money owed by the user (account_id 102)
    const calculateTotalOwed = (groupsData) => {
        let owed = {};
        let total = 0;

        groupsData.forEach(group => {
            let groupTotal = 0;
            let userInGroup = false;

            group.users.forEach(member => {
                member.items.forEach(item => {
                    if (item.paid_by === userId) {
                        groupTotal -= item.amount;  // User is owed money
                        total -= item.amount;
                        userInGroup = true;
                    } else if (member.user_id === userId) {
                        groupTotal += item.amount;  // User owes money
                        total += item.amount;
                        userInGroup = true;
                    }
                });
            });

            if (userInGroup) {
                owed[group.group_id] = groupTotal;
            }
        });

        setTotalOwed(owed);
        return total;  // Return the total amount owed across all groups
    };

    // Function to handle adding a new group
    const handleAddGroup = async () => {
        try {
            const response = await fetch('/api/addGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });

            if (response.ok) {
                const addedGroup = await response.json();
                setGroups([...groups, addedGroup]);  // Append new group to groups state
                setNewGroup({ groupName: '', members: [{ memberName: '', accountId: '' }] });
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
            members: [...newGroup.members, { memberName: '', accountId: '' }],
        });
    };

    // Function to handle changes in member input
    const handleMemberChange = (index, field, value) => {
        const updatedMembers = newGroup.members.map((member, i) =>
            i === index ? { ...member, [field]: value } : member
        );
        setNewGroup({ ...newGroup, members: updatedMembers });
    };

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
                        {groups.map(group => {
                            const owedAmount = totalOwed[group.group_id] || 0;

                            return (
                                <li key={group.group_id} className="mb-2">
                                    {group.group_name}: {owedAmount === 0 
                                        ? '$0.00' 
                                        : `${owedAmount > 0 ? '-' : '+'} $${Math.abs(owedAmount).toFixed(2)}`}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="w-1/2"> {/* Center the add group form */}
                <h2 className="text-2xl font-bold mb-4">Total expenses: {totalAmountOwed === 0 ? '$0.00' : `${totalAmountOwed > 0 ? '-' : '+'}$${Math.abs(totalAmountOwed).toFixed(2)}`}</h2>
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
                                    placeholder="Member Name"
                                    value={member.memberName}
                                    onChange={(e) => handleMemberChange(index, 'memberName', e.target.value)}
                                    className="block w-1/2 mr-2 p-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Account ID"
                                    value={member.accountId}
                                    onChange={(e) => handleMemberChange(index, 'accountId', e.target.value)}
                                    className="block w-1/2 p-2 border border-gray-300 rounded"
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
