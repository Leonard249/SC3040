import React, { useState, useRef, useEffect } from "react";

const DropdownSelectGroup = ({
  className,
  groups,
  selectedGroup,
  setSelectedGroup,
}) => {
  const handleSelect = (e) => {
    setSelectedGroup(e.target.value); // Update the selected group
  };
  // State for the selected group
  return (
    <div className={className}>
      <img src="logo.svg" className="logo w-8 h-8 mr-2" alt="Logo" />
      <select
        value={selectedGroup}
        onChange={handleSelect}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="" disabled>
          Select Group
        </option>
        {groups.map((group) => (
          <option key={group.groupId} value={group.groupId}>
            {group.group_name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default DropdownSelectGroup;
