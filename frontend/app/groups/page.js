"use client";

import React, { useEffect, useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";
import AddMember from "@/app/groups/createGroup";
import apiClient from "@/app/axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const GroupPage = () => {
  const userId = "6706087b1143dcab37a70f34"; // Assume this is current user
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [assignedItems, setAssignedItems] = useState({});

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
    const fetchData = async () => {
      try {
        let responseData = await apiClient.get(`/v1/expense/all/${userId}`);
        const data = responseData.data.data.groups;

        const groupsWithNames = await Promise.all(
          data.map(async (group) => {
            const groupName = await getGroupName(group.group_id);
            return { ...group, group_name: groupName };
          })
        );

        setGroups(groupsWithNames);
        const storedGroupId = localStorage.getItem("selectedGroupId");
        if (storedGroupId && groupsWithNames.length > 0) {
          setSelectedGroup(storedGroupId);
        } else {
          setSelectedGroup(data[0]?.group_id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const groupIdToUse = selectedGroup;
    const selectedGroupData = groups.find(
      (group) => group.group_id === groupIdToUse
    );

    if (selectedGroupData) {
      const userItems = {};
      selectedGroupData.users.forEach((user) => {
        userItems[user.memberName] = user.items
          ? user.items.map((item) => item.item)
          : [];
      });

      setAssignedItems(userItems);
    }
  }, [selectedGroup, groups]);

  const handleRedirect = (path) => {
    localStorage.setItem("selectedGroup", JSON.stringify(currentGroup));
    router.push(path);
  };

  const handleGroupChange = (event) => {
    const newSelectedGroup = event.target.value;
    setSelectedGroup(newSelectedGroup);
    localStorage.setItem("selectedGroupId", newSelectedGroup);
  };

  const currentGroup =
    groups.find((group) => group.group_id === selectedGroup) || {};

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

  // Function to handle dragging end
  const handleDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside a droppable area

    const { source, destination } = result;
    const sourceUser = source.droppableId; // ID of the source user
    const destinationUser = destination.droppableId; // ID of the destination user

    // If dragged to the same user, do nothing
    if (sourceUser === destinationUser) return;

    // Get the item that was dragged
    const itemDragged = assignedItems[sourceUser][source.index];

    // Remove item from source user
    const updatedSourceItems = Array.from(assignedItems[sourceUser]);
    updatedSourceItems.splice(source.index, 1);

    // Add item to destination user
    const updatedDestinationItems = Array.from(assignedItems[destinationUser]);
    updatedDestinationItems.splice(destination.index, 0, itemDragged);

    // Update the state with the new items
    setAssignedItems((prevState) => ({
      ...prevState,
      [sourceUser]: updatedSourceItems,
      [destinationUser]: updatedDestinationItems,
    }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center justify-center min-h-screen p-10 space-y-8">
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
                <img src="logo.svg" className="logo w-8 h-8 mr-2" alt="Logo" />
                <span className="group-id text-sm">#{selectedGroup}</span>
              </div>
            </div>

            <Droppable droppableId="droppable-users" type="user">
              {(provided) => (
                <div
                  className="box"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {currentGroup.users &&
                    currentGroup.users.map((user, index) => (
                      <div
                        key={user.user_id}
                        className="column"
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f4f4f4" : "#d9d9d9",
                        }}
                      >
                        <div className="user-name content">
                          {user.memberName}
                        </div>
                        <Droppable droppableId={user.memberName}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="items-container"
                            >
                              {assignedItems[user.memberName]?.map(
                                (item, index) => (
                                  <Draggable
                                    key={item} // Use item name as the unique key
                                    draggableId={item}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        className="draggable"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        {item}
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              )}
                              {provided.placeholder}{" "}
                              {/* Required for the Droppable */}
                            </div>
                          )}
                        </Droppable>
                        <div
                          className="item-count content"
                          style={{ marginTop: "auto" }}
                        >
                          <p>Owes</p>
                          <p>
                            {calculateNetAmountOwed(
                              currentGroup,
                              user.memberName
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  {provided.placeholder} {/* Required for the Droppable */}
                </div>
              )}
            </Droppable>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                onClick={() => handleRedirect("/groups/settleup")}
              >
                Settle up!
              </button>
            </div>
          </div>

          <div className="right-box flex flex-col gap-4">
            <p className="font-bold">Members:</p>
            {currentGroup.users &&
              currentGroup.users.map((member, idx) => (
                <div key={idx} className="member-row">
                  <img src="avatar.svg" alt={`${member.memberName}'s avatar`} />
                  <span className="grouppage-font">{member.memberName}</span>
                </div>
              ))}
            {selectedGroup && currentGroup && (
              <AddMember group_id={selectedGroup} />
            )}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default GroupPage;
