"use client";
import React, { useState, useEffect } from "react";
import apiClient from "@/app/axios";
import Link from "next/link";
import ListOfGroups from "./ListOfGroups";
import AddGroup from "./AddGroup";

const Home = () => {
  //TODO: USERID
  const userId = "6706087b1143dcab37a70f34"; // Assuming the current user has account_id 101
  const [groups, setGroups] = useState([]);
  const [totalOwed, setTotalOwed] = useState({});
  const [userName, setUserName] = useState("");
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let responseData = await apiClient.get(`/v1/expense/all/${userId}`);
        let responseData2 = await apiClient.get(`/v1/common/users`);
        console.log(responseData);
        console.log(responseData2);
        const data = responseData.data.data.groups;
        const data2 = responseData2.data.data;
        setGroups(data);
        setAvailableUsers(data2);
        const groupNames = await Promise.all(
          data.map(async (group) => {
            const groupName = await getGroupName(group.group_id); // Call getGroupName
            return { ...group, group_name: groupName }; // Add group_name to the group object
          })
        );
        setGroups(groupNames);

        const foundUser = data
          .flatMap((group) => group.users)
          .find((member) => member.user_id === userId.toString());

        if (foundUser) {
          setUserName(foundUser.memberName);
          calculateTotalOwed(data);
        } else {
          console.warn("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []); // Add `userId` as a dependency if it changes

  const getGroupName = async (groupId) => {
    try {
      const response = await apiClient.get(`/v1/get/get-group-name/${groupId}`);
      return response.data.group_name;
    } catch (error) {
      console.error("Error fetching group name:", error);
      return "No Group Name"; // Return default in case of an error
    }
  };

  const calculateTotalOwed = (data) => {
    console.log(data);
    let owed = {};
    data.forEach((group) => {
      let groupTotal = 0;
      let userInGroup = false;

      group.users.forEach((member) => {
        if (member.user_id === userId.toString()) {
          userInGroup = true;
        }

        member.items.forEach((item) => {
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

  // Calculate total owed across all groups
  const totalAmountOwed = Object.values(totalOwed).reduce(
    (acc, amount) => acc + amount,
    0
  );

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome {userName || "User"}</h1>

      <ListOfGroups
        className="w-1/2 mb-8"
        groups={groups}
        totalOwed={totalOwed}
        userId={userId}
      ></ListOfGroups>

      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">
          Total expenses:{" "}
          {totalAmountOwed === 0
            ? "$0.00"
            : `${totalAmountOwed > 0 ? "+" : "-"}$${Math.abs(
                totalAmountOwed
              ).toFixed(2)}`}
        </h2>
        {totalAmountOwed === 0 ? (
          <p>You&#39;re all settled up. Awesome!</p>
        ) : (
          <p>You still have expenses to settle.</p>
        )}

        <AddGroup
          userId={userId}
          groups={groups}
          setGroups={setGroups}
          availableUsers={availableUsers}
        />
      </div>
    </div>
  );
};

export default Home;
