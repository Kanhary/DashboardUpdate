import React, { createContext, useContext, useState } from 'react';

// Create the User Context
const UserContext = createContext();

// User Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // user will be null if not logged in

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use User Context
export const useUser = () => useContext(UserContext);
