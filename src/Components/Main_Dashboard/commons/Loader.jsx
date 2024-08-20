import React from 'react'

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="w-16 h-16 border-4 border-solid rounded-full animate-spin border-primary border-t-transparent"></div>
        </div>
    );
}

export default Loader
