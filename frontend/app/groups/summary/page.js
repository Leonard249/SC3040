"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import apiClient from "@/app/axios"; // Import the GROUP_USER_ITEM constant

const GroupSummaryPage = () => {
  //TODO: USERID
  const userId = "6706087b1143dcab37a70f34"; // Assume this is current user

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");
  const [owedAmounts, setOwedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [userMap, setUserMap] = useState({});


  // Function to save user_id and memberName
  const saveUserMapping = (userId, memberName) => {
    if (!userId || !memberName) {
      console.error("Both userId and memberName are required.");
      return;
    }

    userMap[userId] = memberName; // Save the mapping
    setUserMap(userMap);
  };

  useEffect(() => {

    const updateGroups = async () => {
      let responseData = await apiClient.get(`/v1/expense/all/${userId}`);
      const data = responseData.data.data.groups;
      setGroups(data);  // This updates the state, but won't immediately reflect in `groups`
      data.forEach((group) => {
        group.users.forEach((user) => {
          saveUserMapping(user.user_id, user.memberName);
        });
      });
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


    const forUser = group.users.find(
        (u) => u.user_id === userId
    )

    const owedAmounts = {};
    forUser.items.forEach((item) => {
      owedAmounts[item.paid_by] = 0; // Start with zero owed
    });
    forUser.items.forEach((item) => {
      owedAmounts[item.paid_by] += item.amount;
    })

    /*group.users.forEach((user) => {
      user.items.forEach((item) => {
        if (item === []) {
          return
        }
        const payerName = group.users.find(
          (u) => u.user_id === item.paid_by
        )?.memberName;

        if (payerName && payerName !== userId) {
          owedAmounts[payerName] += item.amount; // Add to what this user owes
        }
      });
    });

    const filteredData = Object.entries(owedAmounts)
        .filter(([key, value]) => value !== 0) // Keep only entries with value not equal to 0
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
*/
setOwedAmounts(owedAmounts)
    //setOwedAmounts(filteredData); // Save calculated amounts in state

    console.log(owedAmounts);
  };

  const handlePaymentClick = (memberName) => {
    //setSelectedMember(memberName); // Set the selected member for payment
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
      <div className="summary-page flex justify-center items-start gap-8 p-10 min-h-screen">
        {/* Total Owed Box */}
        <div className="box bg-yellow-100 border border-yellow-400 p-6 rounded-lg shadow-lg w-1/3">
          <div className="flex flex-col">
            <p className="text-2xl font-bold mb-4">Total:</p>
            {Object.entries(owedAmounts).map(([member, amount]) => (
                <p key={member} className="text-lg mb-2 py-1.5">
                  You owe <span className="font-semibold">{userMap[member]}</span> ${amount.toFixed(2)}
                </p>
            ))}
          </div>
        </div>

        {/* Payment Box */}
        <div className="box bg-yellow-100 border border-yellow-400 p-6 rounded-lg shadow-lg w-1/3">
          <div className="flex flex-col">
            <p className="text-2xl font-bold mb-4">Payment:</p>
            {Object.entries(owedAmounts).map(([member, amount]) => (
                <div key={member} className="flex items-center justify-between mb-4">
            <span className="text-lg">
              <span className="font-semibold">{userMap[member]}</span>
            </span>
                  <button
                      className="ml-4 py-2 px-4 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition duration-200"
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="modal-content bg-white p-8 rounded-lg shadow-lg">
          <span
              className="close text-2xl cursor-pointer text-gray-600 absolute top-4 right-4"
              onClick={closeModal}
          >
            &times;
          </span>
                <h2 className="text-xl font-semibold mb-4">Scan the QR Code to Make a Payment</h2>
                <p className="text-gray-700 mb-4">
                  Please use your mobile banking app or a QR code scanner to scan the code below and complete your
                  payment.
                </p>
                <img src="/paymentqr.jpg" className="w-64 h-64" alt="QR Code"/>
              </div>
            </div>
        )}
      </div>
  );

};

export default GroupSummaryPage;
