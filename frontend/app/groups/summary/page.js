"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";

const GroupSummaryPage = () => {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch("/aswe.json")
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
        const storedGroup = localStorage.getItem("selectedGroup");
        if (storedGroup && data[storedGroup]) {
          setSelectedGroup(storedGroup);
        }
      })
      .catch((error) => console.error("Error fetching groups:", error));
  }, []); // Only run once on mount

  const handleRedirect = () => {
    router.push("/groups/summary/payment");
  };

  const currentGroup = groups[selectedGroup];

  return (
    <div className="summary-page">
      <div className="box content">
        <div
          style={{ display: "flex", flexDirection: "column", padding: "20px" }}
        >
          <p className="content">Total:</p>
          {currentGroup && currentGroup.members ? (
            Object.entries(currentGroup.members).map(
              ([memberKey, memberData]) => (
                <div key={memberKey} className="member-row">
                  <span className="grouppage-font">
                    {memberData.memberName}
                  </span>
                  <ul>
                    {memberData.items.map((item) => (
                      <li key={item.id}>
                        {item.item} - ${item.amount.toFixed(2)} (Paid by{" "}
                        {item.paid_by})
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )
          ) : (
            <p>No group data available.</p>
          )}
        </div>
      </div>
      <div className="box content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            padding: "20px",
          }}
        >
          <p className="content">Total: (simplified)</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>BlueBird 5</span>
            <span style={{ textAlign: "right" }}>Owes you $5</span>
          </div>
          <button className="payment-button" onClick={handleRedirect}>
            Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSummaryPage;
