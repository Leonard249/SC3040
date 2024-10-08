"use client";

import React from "react";
import "./style.css";
import { useRouter } from "next/navigation";

const GroupSummaryPage = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/groups/summary/payment");
  };
  return (
    <div className="summary-page">
      <div className="box content">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <p className="content">Total:</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textAlign: "left" }}>BlueBird1</span>
            <span style={{ textAlign: "right" }}>Owes you $5</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textalign: "left" }}>BlueBird2</span>
            <span style={{ textalign: "right" }}>You owe $5</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textalign: "left" }}>BlueBird3</span>
            <span style={{ textalign: "right" }}>Owes you $5</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textalign: "left" }}>BlueBird4</span>
            <span style={{ textalign: "right" }}>You owe $5</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ textalign: "left" }}>BlueBird5</span>
            <span style={{ textalign: "right" }}>Owes you $5</span>
          </div>
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
            <span style={{ textalign: "left" }}>BlueBird 5</span>
            <span style={{ textalign: "right" }}>Owes you $5</span>
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
