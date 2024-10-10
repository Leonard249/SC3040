import React, { createContext, useContext, useState } from "react";

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  return (
    <GroupContext.Provider value={{ selectedGroupId, setSelectedGroupId }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);
