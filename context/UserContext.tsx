import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [globalProfilePic, setGlobalProfilePic] = useState(null);
  const [homeReloadFlag, setHomeReloadFlag] = useState(false);
  const triggerHomeReload = () => setHomeReloadFlag(prev => !prev);

  return (
    <UserContext.Provider
      value={{
        globalProfilePic,
        setGlobalProfilePic,
        homeReloadFlag,
        triggerHomeReload,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
