"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";

const GroupSummaryPage = () => {
  const userId = "6706087b1143dcab37a70f34"; // Assume this is current user
  const router = useRouter();
  const [owedAmounts, setOwedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedMember, setSelectedMember] = useState(""); // State to store selected member for payment

  useEffect(() => {
    // Retrieve the selected group from local storage on component mount
    const groupData = JSON.parse(localStorage.getItem("selectedGroup"));
    if (groupData) {
      calculateOwedAmounts(groupData);
    }
    console.log(groupData);
  }, []); // Run only once on mount

  const calculateOwedAmounts = (groupData) => {
    const owedAmounts = {};
    groupData.users.forEach((user) => {
      owedAmounts[user.memberName] = 0; // Start with zero owed
    });

    groupData.users.forEach((user) => {
      user.items.forEach((item) => {
        const payerName = groupData.users.find(
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
    setSelectedMember(memberName); // Set the selected member for payment
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="summary-page">
      <button
        className="back-button bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
        onClick={() => router.back()}
      >
        Back
      </button>{" "}
      <div className="box content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <p className="content">Total:</p>
          {Object.entries(owedAmounts).map(([member, amount]) => (
            <div
              key={member}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <p>
                You owe {member} ${amount.toFixed(2)}
              </p>
              <button
                className="payment-button bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition"
                onClick={() => handlePaymentClick(member)}
              >
                Pay {member}
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
            <p>Payment QR code for {selectedMember}</p>
            <img src="/paymentqr.jpg" alt="Payment QR Code" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSummaryPage;
