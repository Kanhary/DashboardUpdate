import React from 'react';
import { useUser } from './UserContext';

const Profile = () => {
    const { user } = useUser();

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-2xl">Welcome, {user.username}!</h1>
                <p className="mt-4">This is your profile page.</p>
            </div>
        </div>
    );
};

export default Profile;
