// UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a User Context
const UserContext = createContext();

// UserProvider component to wrap around the app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the User Context
export const useUser = () => useContext(UserContext);
