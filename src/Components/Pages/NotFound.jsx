import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>404</h1>
        <p className='text-lg'>Page Not Found</p>
        <Link to='/dashboard' className='text-blue-500'>Go to Dashboard</Link>
      </div>
    </div>
  );
};
export default NotFound;
