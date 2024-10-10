"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import AddMember from "@/app/groups/createGroup";

const GroupPage = () => {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(""); // Initialize selectedGroup with an empty string
  const [groups, setGroups] = useState([]);

  const handleRedirect = (path) => {
    localStorage.setItem("selectedGroup", selectedGroup);
    router.push(path);
  };

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  useEffect(() => {
    fetch("/aswe.json")
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
        setSelectedGroup(Object.keys(data)[0]); // Set default selected group after fetching
      })
      .catch((error) => console.error("Error fetching groups:", error));
  }, []);

  const currentGroup = groups[selectedGroup] || {};
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
          {Object.keys(groups).map((groupKey) => (
            <option key={groupKey} value={groupKey}>
              {groups[groupKey].group_name}
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
                {currentGroup.group_name || "No group selected"}
              </span>
            </div>
            <div className="row-right">
              <img src="logo.svg" className="logo"></img>
              <span className="group-id">#{selectedGroup}</span>
            </div>
          </div>
          <div className="content">
            <p>Activity:</p>
            <p>BlueBird1 paid S$1 for bahkutteh</p>
            <p>BlueBird2 paid S$1 for bahkutteh</p>
            <p>BlueBird3 paid S$1 for bahkutteh</p>
            <p>BlueBird4 paid S$1 for bahkutteh</p>
            <p>BlueBird5 paid S$1 for bahkutteh</p>
            <p>BlueBird6 paid S$1 for bahkutteh</p>
            <p>BlueBird7 paid S$1 for bahkutteh</p>
            <p>BlueBird8 paid S$1 for bahkutteh</p>
            <p>BlueBird9 paid S$1 for bahkutteh</p>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              className="settle-up"
              onClick={() => handleRedirect("/groups/edit-allocation")}
            >
              Edit Allocation
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
          {selectedGroup &&
            currentGroup &&
            Object.values(currentGroup.members).map((member, idx) => (
              <div key={idx} className="member-row">
                <img src="avatar.svg"></img>
                <span className="grouppage-font">{member.memberName}</span>
              </div>
            ))}
          {selectedGroup && currentGroup && <AddMember group_id={selectedGroup}/>}
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
