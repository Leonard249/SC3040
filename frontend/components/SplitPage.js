"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSearchParams } from "next/navigation";
import apiClient from "@/app/axios";
import Image from "next/image";
import Loader from "./Loader";
import ManualInput from "./ManualInput";
import Item from "./Item";
import Member from "./Member";
import Rescan_Manual_Buttons from "./Rescan_Manual_Buttons";

// Main SplitPage component
const SplitPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state to manage the loader visibility
  const [groupName, setGroupName] = useState("");

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

  useEffect(() => {
    const base64data = localStorage.getItem("base64File");
    setImage(base64data);

    // Function to handle OCR scan
    const ocrScan = () => {
      return apiClient.post("/v1/ocr/scan", {
        image: convertDataURIToPlainText(base64data),
      });
    };

    // Function to fetch group members
    const fetchMembers = () => {
      return apiClient.get(`/v1/groups/get_user/${groupId}`);
    };

    // Function to fetch username from userId
    const fetchUsername = (userId) => {
      return apiClient.get(`/v1/get/get-username-from-id/${userId}`);
    };

    const fetchGroupname = () => {
      return apiClient.get(`/v1/get/get-group-name/${groupId}`);
    };

    // Async function inside useEffect to handle promises with await
    const fetchData = async () => {
      try {
        // Execute both API requests in parallel
        const [ocrResponse, membersResponse, groupNameResponse] =
          await Promise.all([ocrScan(), fetchMembers(), fetchGroupname()]);

        // Handle OCR Scan response
        if (ocrResponse.status === 200) {
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

    // Call the async function
    fetchData();
  }, [groupId]);

  const handleDeleteItem = (id) => {
    // Update the state by filtering out the item with the given id
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Submitting the items to backend
  const handleSubmit = async () => {
    console.log(members);

    const transformedData = {
      group: groupId,
      items: members
        .filter((member) => member.items.length > 0) // Only consider members with non-empty items
        .flatMap((member) =>
          member.items.map((item) => ({
            name: item.name, // Set name of the item
            cost: item.amount, // Set cost of the item (from amount)
            user_id: member.id, // Set user_id from member id
            paid_by: "", // Placeholder for paid_by (update this as needed)
          }))
        ),
    };

    //TODO: USERID
    transformedData.items.forEach(
      (item) => (item.paid_by = "6706087b1143dcab37a70f34")
    ); // Set to a static value or adjust as needed

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
              <Image
                src={image}
                alt="Receipt"
                width={256} // Restrict width to 256px (you can adjust as needed)
                height={256} // Restrict height to 256px (adjust as needed)
                className="mb-4 object-cover" // Apply additional Tailwind CSS classes for styling
              />

              {/* Buttons Wrapper with Flexbox */}
              <Rescan_Manual_Buttons
                className="flex gap-4 mb-4"
                setItems={setItems}
              />

              {/* Displaying Items */}
              {items.map((item) => (
                <Item
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  amount={item.amount}
                  assignedCount={item.assignedCount}
                  ITEM_TYPE={ITEM_TYPE}
                  setMembers={setMembers}
                  item={item}
                  setItems={setItems}
                  onDelete={handleDeleteItem}
                />
              ))}
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
