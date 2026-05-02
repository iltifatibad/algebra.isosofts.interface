import React, { createContext, useContext } from "react";

export const UserContext = createContext({ isSuperAdmin: false });

export const UserProvider = ({ children, value }) => (
  <UserContext.Provider value={value}>{children}</UserContext.Provider>
);

export const useUser = () => useContext(UserContext);
