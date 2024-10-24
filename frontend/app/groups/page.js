"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import AddMember from "@/app/groups/createGroup";
import apiClient from "@/app/axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useAuth from "@/hooks/useAuth";

const GroupPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [originalGroupData, setOriginalGroupData] = useState(null);
  const [changed, setChanged] = useState(false);
  const userId = user?.user_id;

  useEffect(() => {
    const fetchData = async () => {
      console.log("your userid", userId);
      if (loading || !userId) return;
      try {
        const responseData = await apiClient.get(`/v1/expense/all/${userId}`);
        const data = responseData.data.data.groups;

        const groupsWithNames = await Promise.all(
          data.map(async (group) => {
            const groupName = await getGroupName(group.group_id);
            return { ...group, group_name: groupName };
          })
        );

        setGroups(groupsWithNames);
        const storedGroupId = localStorage.getItem("selectedGroupId");
        setSelectedGroup(storedGroupId || data[0]?.group_id);
        localStorage.setItem("userId", userId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId, loading]);

  const getGroupName = async (groupId) => {
    try {
      const response = await apiClient.get(`/v1/get/get-group-name/${groupId}`);
      return response.data.group_name;
    } catch (error) {
      console.error("Error fetching group name:", error);
      return "Unnamed Group";
    }
  };

  useEffect(() => {
    //Store original group data when a group is selected
    const currentGroup =
      groups.find((group) => group.group_id === selectedGroup) || {};
    setOriginalGroupData(currentGroup);
  }, [selectedGroup]);

  const handleRedirect = (path) => {
    if (changed) {
      const confirmSave = window.confirm(
        "You have unsaved changes. Would you like to save before continuing?"
      );
      if (confirmSave) {
        console.log(currentGroup);
        console.log("Saving Changes...");
        localStorage.setItem("selectedGroup", JSON.stringify(currentGroup));

        apiClient
          .put("/v1/expense", {
            currentGroup,
          })
          .then((r) => router.push(path));
      } else {
        router.push(path);
      }
    } else {
      localStorage.setItem("selectedGroup", JSON.stringify(currentGroup));

      router.push(path);
    }
  };

  const handleGroupChange = (event) => {
    const newSelectedGroup = event.target.value;
    setSelectedGroup(newSelectedGroup);
    localStorage.setItem("selectedGroupId", newSelectedGroup);
  };

  const getUserNameById = (userId) => {
    const user = currentGroup.users.find((user) => user.user_id === userId);
    console.log(user);
    return user ? user.memberName : "Unknown User";
  };

  const calculateNetAmountOwed = (currentGroup, userName) => {
    let totalOwed = 0;
    currentGroup.users.forEach((user) => {
      if (user.memberName === userName) {
        user.items.forEach((item) => {
          if (item.paid_by !== user.user_id) {
            totalOwed += item.amount;
          }
        });
      }
    });
    return totalOwed;
  };

  // Handle drag end
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Find the source and destination users
    const sourceUserIndex = currentGroup.users.findIndex(
      (user) => user.user_id === source.droppableId
    );
    const destinationUserIndex = currentGroup.users.findIndex(
      (user) => user.user_id === destination.droppableId
    );

    // Get the item being dragged
    const [movedItem] = currentGroup.users[sourceUserIndex].items.splice(
      source.index,
      1
    );

    // Add the moved item to the destination user's items
    currentGroup.users[destinationUserIndex].items.splice(
      destination.index,
      0,
      movedItem
    );
    // Mark that changes were made
    setChanged(true);

    // Update state
    setGroups([...groups]);
  };

  const currentGroup =
    groups.find((group) => group.group_id === selectedGroup) || {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="USER">
        {(provided) => (
          <div
            className="flex flex-col items-center justify-center min-h-screen p-10 space-y-8"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className="group-select">
              <label htmlFor="group-dropdown" className="font-bold">
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
                    {group.group_name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="left-box bg-yellow-100 shadow-md rounded-lg p-6 max-w-3xl mx-auto">
                <div className="top-row flex justify-between items-center mb-4">
                  <div className="row-left flex space-x-2 items-center">
                    <span className="text-xl font-bold">Group Name:</span>
                    <span className="text-xl">
                      {currentGroup.group_name || "No group selected"}
                    </span>
                  </div>
                  <div className="row-right flex items-center">
                    <img
                      src="logo.svg"
                      className="logo w-8 h-8 mr-2"
                      alt="Logo"
                    />
                    <span className="group-id text-sm">#{selectedGroup}</span>
                  </div>
                </div>

                <div className="box">
                  {currentGroup.users &&
                    currentGroup.users.map((user) => (
                      <Droppable key={user.user_id} droppableId={user.user_id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="column"
                          >
                            <div className="user-name content">
                              {user.memberName}
                            </div>
                            {user.items &&
                              user.items.map((item, index) => (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id.toString()}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="draggable"
                                      title={`Amount: $${item.amount.toFixed(
                                        2
                                      )}, Paid By: ${getUserNameById(item.paid_by)}`}
                                      style={{
                                        backgroundColor:
                                          item.paid_by === user.user_id
                                            ? "#f0a500"
                                            : "#2c2c2c", // Change background if paid_by is the same user

                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.item} - Price: $
                                      {item.amount.toFixed(2)}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                            <div
                              className="item-count content"
                              style={{ marginTop: "auto" }}
                            >
                              <p>Owes</p>
                              <p>
                                {calculateNetAmountOwed(
                                  currentGroup,
                                  user.memberName
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )}
                      </Droppable>
                    ))}
                </div>

                {/* Buttons Section */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleRedirect("/groups/settleup")}
                  >
                    Settle up!
                  </button>
                </div>
              </div>

              {/* Right Box */}
              <div className="right-box flex flex-col gap-4">
                <p className="font-bold">Members:</p>
                {currentGroup.users &&
                  currentGroup.users.map((member, idx) => (
                    <div key={idx} className="member-row">
                      <img
                        src="avatar.svg"
                        alt={`${member.memberName}'s avatar`}
                      />
                      <span className="grouppage-font">
                        {member.user_id === userId
                          ? `${member.memberName} (you)`
                          : member.memberName}
                      </span>
                    </div>
                  ))}
                {selectedGroup && currentGroup && (
                  <AddMember group_id={selectedGroup} />
                )}
              </div>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default GroupPage;
