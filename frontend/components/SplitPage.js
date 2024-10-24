"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSearchParams } from "next/navigation";
import apiClient from "@/app/axios";
import Image from "next/image";
import Loader from "./Loader";
import Item from "./Item";
import Member from "./Member";
import Rescan_Manual_Buttons from "./Rescan_Manual_Buttons";
import useAuth from "@/hooks/useAuth";

// Main SplitPage component
const SplitPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state to manage the loader visibility
  const [groupName, setGroupName] = useState("");
  const [assignedItems, setAssignedItems] = useState(items);
  const userId = user?.user_id;
  const fetchCalled = useRef(false);

  const ITEM_TYPE = "ITEM";

  const convertDataURIToPlainText = (dataURI) => {
    // Check if the dataURI is valid and includes base64 encoding
    if (dataURI.includes("base64,")) {
      // Split the dataURI at 'base64,' and return only the base64 string part
      return dataURI.split("base64,")[1];
    }
    // If the dataURI does not contain 'base64,', return it unchanged or handle error
    return "";
  };

  const fetchData = async () => {
    try {
      // Execute both API requests in parallel
      const [ocrResponse, membersResponse, groupNameResponse] =
        await Promise.all([ocrScan(), fetchMembers(), fetchGroupname()]);
      // Handle OCR Scan response
      if (ocrResponse.status === 200 && Array.isArray(ocrResponse.data.data)) {
        const formattedItems = ocrResponse.data.data.map((item, index) => ({
          id: index + 1,
          name: item.item,
          amount: item.price,
          assignedCount: 0,
        }));
        setItems(formattedItems);
        alert("OCR Scan Successful");
      } else {
        alert("OCR Scan Failed");
      }

      // Handle Members response and fetch usernames
      if (Array.isArray(membersResponse.data.data)) {
        const membersWithNames = await Promise.all(
          membersResponse.data.data.map(async (member) => {
            const usernameResponse = await fetchUsername(member._id);
            return {
              id: member._id,
              username: usernameResponse.data.username,
              items: [],
            };
          })
        );
        setMembers(membersWithNames);

        setGroupName(groupNameResponse.data.group_name);
      } else {
        console.error(
          "membersResponse.data is not an array:",
          membersResponse.data
        );
      }
    } catch (error) {
      console.error("Error occurred during API requests:", error);
    } finally {
      setLoading(false); // Set loading to false when all requests complete
    }
  };

  const ocrScan = () => {
    const base64data = localStorage.getItem("encodedImages");
    setImage(convertDataURIToPlainText(base64data));
    let imagesArray = [];

    if (base64data) {
      // Assuming multiple images are stored in JSON format
      try {
        imagesArray = JSON.parse(base64data); // Parse if JSON formatted
      } catch (error) {
        console.error("Error parsing base64data:", error);
      }
    }

    console.log("List of images: ", imagesArray); // Log to see the array of images
    console.log("OCR Scanned");
    return apiClient.post("/v1/ocr/scan", {
      images: imagesArray, // Send as an array
    });
  };

  // Function to fetch group members
  const fetchMembers = () => {
    console.log("Fetch Members");
    return apiClient.get(`/v1/groups/get_user/${groupId}`);
  };

  // Function to fetch username from userId
  const fetchUsername = (userId) => {
    return apiClient.get(`/v1/get/get-username-from-id/${userId}`);
  };

  const fetchGroupname = () => {
    console.log("Fetched Group name");
    return apiClient.get(`/v1/get/get-group-name/${groupId}`);
  };
  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true; // Set it to true after the first execution
      fetchData();
    }
  }, []); // Empty dependency array to run only on mount

  const handleDeleteItem = (id) => {
    // Update the state by filtering out the item with the given id
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Check if all items are assigned
  // Check if all items are assigned
  const checkAllAssigned = () => {
    const unassignedItems = items.filter((item) => item.assignedCount === 0); // Check if any item has an assignedCount of 0
    if (unassignedItems.length > 0) {
      alert("Please assign all items before proceeding.");
      return false;
    }
    return true;
  };

  // Submitting the items to backend
  const handleSubmit = async () => {
    console.log(members);
    if (checkAllAssigned()) {
      console.log("All items assigned. Proceeding with submission.");
      const transformedData = {
        group: groupId,
        items: members
          .filter((member) => member.items.length > 0) // Only consider members with non-empty items
          .flatMap((member) =>
            member.items.map((item) => ({
              name: item.name, // Set name of the item
              cost: item.amount, // Set cost of the item (from amount)
              user_id: member.id, // Set user_id from member id
              paid_by: userId, // Placeholder for paid_by (update this as needed)
            }))
          ),
      };

      try {
        const response = await apiClient.post("/v1/expense", transformedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          // Check for success using response status

          alert("Expenses submitted successfully");

          window.location.href = "/";
        } else {
          console.error("Error adding group:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding group:", error);
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Show the loader if loading is true */}
      {loading && <Loader />}

      {/* Render the main content if loading is false */}
      {!loading && (
        <div className="flex flex-col justify-start items-center h-auto space-y-8">
          <div className="text-center pt-5">
            <h2 className="text-xl font-semibold mb-4">
              Receipt for group:{" "}
              <span className="text-yellow-700">{groupName}</span>
            </h2>
          </div>
          <div className="flex justify-center items-center">
            {/* Receipt Section */}
            <div className="receipt-section p-6 border flex flex-col items-center">
              {/* Buttons Wrapper with Flexbox */}

              {/* Displaying Items */}
              {items.map((item) => (
                <Item
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  amount={item.amount}
                  originalamount={item.amount}
                  assignedCount={item.assignedCount}
                  ITEM_TYPE={ITEM_TYPE}
                  setMembers={setMembers}
                  item={item}
                  setItems={setItems}
                  onDelete={handleDeleteItem}
                  checkAllAssigned={checkAllAssigned}
                />
              ))}
              <Rescan_Manual_Buttons
                className="flex gap-4 mb-4"
                setItems={setItems}
              />
            </div>

            {/* Members Section */}
            <div className="flex flex-col items-center">
              <div className="members-section p-6 border ml-4">
                <h2 className="text-xl font-semibold mb-4">Members</h2>
                {members.map((member) => (
                  <Member
                    key={member.id}
                    member={member.username}
                    assignedItems={member.items}
                    ITEM_TYPE={ITEM_TYPE}
                    setMembers={setMembers}
                    setItems={setItems}
                  />
                ))}
              </div>

              {/* Submit Button under Members */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default SplitPage;
