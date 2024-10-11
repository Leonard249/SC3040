import React, { useState, useRef, useEffect } from "react";
import apiClient from "@/app/axios"; // Import the GROUP_USER_ITEM and ALL_USERS constants
import { useRouter } from "next/navigation"; // Import useRouter

const FileDropping = ({ className, selectedGroup, setSelectedGroup }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input
  const router = useRouter(); // Call useRouter at the top level
  const convertImageToBase64 = (file, callback) => {
    const reader = new FileReader();

    // Define the onload event for the FileReader
    reader.onloadend = () => {
      // reader.result will contain the base64 encoded string
      callback(reader.result);
    };

    // Read the file as a data URL (Base64 encoded string)
    reader.readAsDataURL(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);

    // Check if a group is selected
    if (!selectedGroup) {
      alert("Please select a group before uploading."); // Pop-out message
      window.location.reload(); // Refresh the page
      return; // Prevent routing
    }

    // Proceed to navigate if both a file and a group are selected
    if (droppedFile) {
      // Navigate to the next page if the group is selected, passing the selected group ID
      const groupId = await apiClient.get(
        `/v1/get/get-group-id/${selectedGroup}`
      );
      router.push(`/split-page?groupId=${groupId.data.group_id}`);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Check if a group is selected
    if (!selectedGroup) {
      alert("Please select a group before uploading."); // Pop-out message
      window.location.reload(); // Refresh the page
      return; // Prevent routing
    }

    // Proceed to navigate if both a file and a group are selected
    if (file) {
      console.log("doing");
      convertImageToBase64(file, async (base64String) => {
        console.log("Base64 Encoded Image:", base64String);
        // Now you can use this base64String for further processing
        localStorage.setItem("base64File", base64String); // Store in localStorage
        const groupId = await apiClient.get(
          `/v1/get/get-group-id/${selectedGroup}`
        );
        router.push(`/split-page?groupId=${groupId.data.group_id}`);
      });
      // Navigate to the next page if the group is selected, passing the selected group ID
    }
  };

  const handleClick = () => {
    fileInputRef.current.click(); // Trigger the file input when the area is clicked
  };
  return (
    <div
      className={`border-2 p-10 w-3/4 h-2/3 flex flex-col justify-center items-center cursor-pointer relative ${
        dragging ? "border-blue-500" : "border-gray-500"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden" // Hide the file input
        onChange={handleFileChange}
      />
      <p className="text-center">
        Drag & Drop your receipt here
        <br />
        <br />
        <span className="text-center">or</span>
      </p>
      {file && <p className="text-center mt-2">Receipt: {file.name}</p>}

      <button
        onClick={handleClick}
        className="mt-4 border border-black py-2 px-4 rounded"
      >
        Click to Upload
      </button>
    </div>
  );
};

export default FileDropping;
