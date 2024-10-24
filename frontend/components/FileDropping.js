import React, { useState, useRef } from "react";
import apiClient from "@/app/axios"; // Import the GROUP_USER_ITEM and ALL_USERS constants
import { useRouter } from "next/navigation"; // Import useRouter

const FileDropping = ({ className, selectedGroup, setSelectedGroup }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]); // Changed to an array to hold multiple files
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
    const droppedFiles = Array.from(e.dataTransfer.files); // Get all dropped files
    setFiles(droppedFiles); // Store all files

    // Check if a group is selected
    if (!selectedGroup) {
      alert("Please select a group before uploading."); // Pop-out message
      window.location.reload(); // Refresh the page
      return; // Prevent routing
    }

    // Proceed to navigate if both files and a group are selected
    if (droppedFiles.length > 0) {
      await handleFiles(droppedFiles); // Handle the dropped files
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Get all selected files
    setFiles(selectedFiles); // Store all files

    // Check if a group is selected
    if (!selectedGroup) {
      alert("Please select a group before uploading."); // Pop-out message
      window.location.reload(); // Refresh the page
      return; // Prevent routing
    }

    // Proceed to navigate if both files and a group are selected
    if (selectedFiles.length > 0) {
      handleFiles(selectedFiles); // Handle the selected files
    }
  };

  const handleFiles = async (files) => {
    const encodedImages = [];

    for (const file of files) {
      console.log("Processing file:", file.name); // Log the file name

      // Convert each image to Base64 and add to the array
      await new Promise((resolve) => {
        convertImageToBase64(file, (base64String) => {
          encodedImages.push({
            filename: file.name,
            data: base64String,
          });
          resolve();
        });
      });
    }

    console.log("Encoded Images:", encodedImages);

    // Send the list of encoded images to the backend
    try {
      const groupId = await apiClient.get(
        `/v1/get/get-group-id/${selectedGroup}`
      );

      // Send the images and the groupId to the backend
      const response = await apiClient.post("/v1/upload-images", {
        groupId: groupId.data.group_id,
        images: encodedImages, // Sending all encoded images
      });

      if (response.status === 200 || response.status === 201) {
        console.log("Images uploaded successfully");
        router.push(`/split-page?groupId=${groupId.data.group_id}`);
      } else {
        console.error("Error uploading images:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
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
        multiple // Allow multiple file selection
      />
      <p className="text-center">
        Drag & Drop your receipts here
        <br />
        <br />
        <span className="text-center">or</span>
      </p>
      {files.length > 0 && (
        <div className="text-center mt-2">
          {files.map((file, index) => (
            <p key={index}>Receipt: {file.name}</p>
          ))}
        </div>
      )}

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
