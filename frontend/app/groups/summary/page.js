"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import apiClient from "@/app/axios"; // Import the GROUP_USER_ITEM constant

const GroupSummaryPage = () => {
  //TODO: USERID
  const userId = "6706087b1143dcab37a70f35"; // Assume this is current user

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");
  const [owedAmounts, setOwedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {

    const updateGroups = async () => {
      let responseData = await apiClient.get(`/v1/expense/all/${userId}`);
      const data = responseData.data.data.groups;
      setGroups(data);  // This updates the state, but won't immediately reflect in `groups`
    };

    updateGroups(); // Call the async function inside useEffect
  }, []); // Run only once on mount

  // This effect will run whenever the `groups` state is updated
  useEffect(() => {
    groups.forEach((group) => {
      group.users.forEach((member) => {
        if (member.user_id === userId.toString()) {
          setUserName(member.memberName);
        }
      });
    });

    // Retrieve the selected group from local storage on component mount
    const storedGroupId = localStorage.getItem("selectedGroup");
    if (storedGroupId) {
      setSelectedGroup(storedGroupId);
      calculateOwedAmounts(storedGroupId); // Calculate amounts when group is selected
    }

  }, [groups]); // Dependency array with `groups` ensures it runs when `groups` changes

  const calculateOwedAmounts = (groupId) => {

    const group = groups.find(
      (g) => g.group_id === groupId
    );

    if (!group) return {};

    const owedAmounts = {};
    group.users.forEach((user) => {
      owedAmounts[user.memberName] = 0; // Start with zero owed
    });

    group.users.forEach((user) => {
      user.items.forEach((item) => {
        if (item === []) {
          return
        }
        const payerName = group.users.find(
          (u) => u.user_id === item.paid_by
        )?.memberName;

        if (payerName && payerName !== user.memberName) {
          owedAmounts[user.memberName] += item.amount; // Add to what this user owes
        }
      });
    });

    const filteredData = Object.entries(owedAmounts)
        .filter(([key, value]) => value !== 0) // Keep only entries with value not equal to 0
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});


    setOwedAmounts(filteredData); // Save calculated amounts in state
  };

  const handlePaymentClick = (memberName) => {
    //setSelectedMember(memberName); // Set the selected member for payment
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="summary-page">
      <div className="box content">
        <div
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          <p className="content">Total:</p>
          {Object.entries(owedAmounts).map(([member, amount]) => (
            <p key={member}>
              You owe {member} ${amount.toFixed(2)}
            </p>
          ))}
        </div>
      </div>
      <div className="box content">
        <div
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          <p className="content">Payment:</p>
          {Object.entries(owedAmounts).map(([member, amount]) => (
            <div key={member} style={{ marginBottom: "10px" }}>
              <span>
                {member} owes ${amount.toFixed(2)}
              </span>
              <button
                className="payment-button"
                onClick={() => handlePaymentClick(member)}
              >
                Payment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Payment */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img src="/paymentqr.jpg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSummaryPage;
