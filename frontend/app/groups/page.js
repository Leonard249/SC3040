import React from "react";
import "./style.css";

const GroupPage = () => {
  return (
    <div className="group-page">
      <div className="left-box">
        <div className="top-row">
          <div className="row-left">
            <span className="grouppage-font">Group Name:</span>
            <span className="grouppage-font">我爱蓝鸟</span>
          </div>
          <div className="row-right">
            <img src="logo.svg" className="logo"></img>
            <span className="group-id">#123456</span>
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
        <button className="settle-up">Settle up!</button>
      </div>
      <div className="right-box">
        <p className="grouppage-font">Members:</p>
        <div className="member-list">
          <div className="member-row">
            <img src="avatar.svg"></img>
            <span className="grouppage-font">BlueBird1</span>
          </div>
          <div className="member-row">
            <img src="avatar.svg"></img>
            <span className="grouppage-font">BlueBird2</span>
          </div>
          <div className="member-row">
            <img src="avatar.svg"></img>
            <span className="grouppage-font">BlueBird3</span>
          </div>
          <div className="member-row">
            <img src="avatar.svg"></img>
            <span className="grouppage-font">BlueBird4</span>
          </div>
        </div>
        <button className="add-member-button">+</button>
      </div>
    </div>
  );
};

export default GroupPage;
