"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { GROUP_USER_ITEM } from "../../../lib/constant"; // Import the GROUP_USER_ITEM constant

const GroupSummaryPage = () => {
  const userId = "6706087b1143dcab37a70f34"; // Assume this is current user

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");
  const [owedAmounts, setOwedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    // Retrieve the selected group from local storage on component mount
    const storedGroupId = localStorage.getItem("selectedGroup");
    if (storedGroupId) {
      setSelectedGroup(storedGroupId);
      calculateOwedAmounts(storedGroupId); // Calculate amounts when group is selected
    }

    const data = GROUP_USER_ITEM.data.groups;
    setGroups(data);

    data.forEach((group) => {
      group.users.forEach((member) => {
        if (member.user_id === userId.toString()) {
          setUserName(member.memberName);
        }
      });
    });
  }, []); // Run only once on mount

  const calculateOwedAmounts = (groupId) => {
    const group = GROUP_USER_ITEM.data.groups.find(
      (g) => g.group_id === groupId
    );
    if (!group) return {};

    const owedAmounts = {};
    group.users.forEach((user) => {
      owedAmounts[user.memberName] = 0; // Start with zero owed
    });

    group.users.forEach((user) => {
      user.items.forEach((item) => {
        const payerName = group.users.find(
          (u) => u.user_id === item.paid_by
        )?.memberName;

        if (payerName && payerName !== user.memberName) {
          owedAmounts[user.memberName] += item.amount; // Add to what this user owes
        }
      });
    });

    setOwedAmounts(owedAmounts); // Save calculated amounts in state
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
