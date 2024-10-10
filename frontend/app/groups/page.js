"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import AddMember from "@/app/groups/createGroup";
import { GROUP_USER_ITEM } from "../../lib/constant"; // Import the GROUP_USER_ITEM constant
import EditAllocationPage from "./edit-allocation/page"; // Adjust path as necessary

const GroupPage = () => {
  const userId = "6706087b1143dcab37a70f34"; // Assume this is current user
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(""); // Initialize selectedGroup with an empty string
  const [groups, setGroups] = useState([]);
  const [userName, setUserName] = useState("");

  const handleRedirect = (path) => {
    localStorage.setItem("selectedGroup", selectedGroup);
    router.push(path);
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  useEffect(() => {
    const data = GROUP_USER_ITEM.data.groups;
    setGroups(data);

    let foundUser = false;
    data.forEach((group) => {
      group.users.forEach((member) => {
        if (member.user_id === userId.toString()) {
          setUserName(member.memberName);
          foundUser = true;
        }
      });
    });

    if (!foundUser) {
      console.warn("User not found");
    }

    if (data.length > 0) {
      setSelectedGroup(data[0].group_id); // Set default selected group after fetching
    }
  }, []);

  const currentGroup =
    groups.find((group) => group.group_id === selectedGroup) || {};

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="group-select">
        <label htmlFor="group-dropdown" className="grouppage-font">
          Select Group:
        </label>
        <select
          id="group-dropdown"
          value={selectedGroup}
          onChange={handleGroupChange}
          className="group-dropdown"
        >
          <option value="">Select a Group</option>
          {groups.map((group) => (
            <option key={group.group_id} value={group.group_id}>
              {group.group_id}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div className="left-box">
          <div className="top-row">
            <div className="row-left">
              <span className="grouppage-font">Group Name:</span>
              <span className="grouppage-font">
                {currentGroup.group_id || "No group selected"}
              </span>
            </div>
            <div className="row-right">
              <img src="logo.svg" className="logo" alt="Logo"></img>
              <span className="group-id">#{selectedGroup}</span>
            </div>
          </div>
          <div className="content">
            <p>Activity:</p>
            {currentGroup.users &&
              currentGroup.users.map((user) =>
                user.items.map((item) => (
                  <p key={item.id}>
                    {user.memberName} paid S${item.amount} for {item.item}
                  </p>
                ))
              )}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              className="settle-up"
              onClick={() => handleRedirect("/groups/edit-allocation")}
            >
              View Allocation
            </button>
            <button
              className="settle-up"
              onClick={() => handleRedirect("/groups/summary")}
            >
              Settle up!
            </button>
          </div>
        </div>
        <div className="right-box">
          <p className="grouppage-font">Members:</p>
          {currentGroup.users &&
            currentGroup.users.map((member, idx) => (
              <div key={idx} className="member-row">
                <img
                  src="avatar.svg"
                  alt={`${member.memberName}'s avatar`}
                ></img>
                <span className="grouppage-font">{member.memberName}</span>
              </div>
            ))}
          {selectedGroup && currentGroup && (
            <AddMember group_id={selectedGroup} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
