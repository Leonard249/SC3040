import React, { useState, useEffect } from 'react';
import apiClient from "@/app/axios";

//TODO: Pass group_id to here ONLY GROUP_ID
const AddMember = ({ group_id }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false); // To manage popup visibility
    const [emailInput, setEmailInput] = useState(''); // To manage input value
    const [filteredUsers, setFilteredUsers] = useState([]); // To manage filtered user list
    const [userList, setUserList] = useState([]); // To manage full user list

    useEffect(() => {
        fetch("/userlist.json")
            .then((response) => response.json())
            .then((data) => {
                setUserList(data.data); // Set default selected group after fetching
            })
            .catch((error) => console.error("Error fetching groups:", error));
    }, []);

    const handleUserClick = (user) => {
        // Call the register API with the selected user's data
        console.log(group_id)
        apiClient.put("/v1/groups/add_user", {
            group_id: "670761b7f7d1a0abedfdb6e8",
            user_id: user._id
        })
            .then((response) => {
                if (response.status === 200) {
                    alert(`User ${user.email} registered successfully!`);
                } else {
                    alert(`Failed to register user ${user.email}`);
                }
            })
            .catch((error) => {
                console.error("Error registering user:", error);
            });
    };

    // Function to handle email input change and filter user list
    const handleEmailChange = (e) => {
        console.log(userList)
        const value = e.target.value;
        setEmailInput(value);
        // Filter users based on input
        const filtered = userList.filter(user =>
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    // Function to show the popup
    const showPopup = () => {
        setIsPopupVisible(true);
    };

    // Function to hide the popup
    const hidePopup = () => {
        console.log(userList)
        setIsPopupVisible(false);
        setEmailInput(''); // Reset input field when popup is closed
        setFilteredUsers([]); // Clear the filtered list
    };

    return (
        <div>
            {/* Button to show the popup */}
            <button className="add-member-button" onClick={showPopup}>+</button>

            {/* Popup Component */}
            {isPopupVisible && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Add Member by Email</h3>
                        <input
                            type="text"
                            placeholder="Type email to search..."
                            value={emailInput}
                            onChange={handleEmailChange}
                        />
                        {/* Display filtered list */}
                        {filteredUsers.length > 0 ? (
                            <ul className="filtered-user-list">
                                {filteredUsers.map((user, index) => (
                                    <li key={index} onClick={() => handleUserClick(user)}>
                                        {user.email}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            emailInput && <p>No matching users found.</p>
                        )}
                        {/* Button to close the popup */}
                        <button className="close-popup-button" onClick={hidePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMember;
