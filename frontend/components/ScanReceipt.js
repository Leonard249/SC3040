"use client"; // Ensure this is a client component

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ScanReceipt = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null); // Ref for the file input

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);

    // Simulate an upload process or any validation here
    if (droppedFile) {
      // Navigate to SplitPage once a receipt is dropped
      router.push('/split-page');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Navigate to SplitPage once a file is selected
    if (selectedFile) {
      router.push('/split-page');
    }
  };

  const handleClick = () => {
    fileInputRef.current.click(); // Trigger the file input when the area is clicked
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`border-2 p-10 w-3/4 h-2/3 flex flex-col justify-center items-center cursor-pointer ${
          dragging ? 'border-blue-500' : 'border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        
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
        <button onClick={handleClick} className="mt-4 border border-black py-2 px-4 rounded">
          Click to Upload
        </button>
      </div>
    </div>
  );
};

export default ScanReceipt;
