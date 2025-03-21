import React from "react";

const Header = () => {
    return (
        <header className="bg-gray-800 text-white h-screen flex flex-col justify-center items-center text-center p-6">
            <h1 className="text-4xl font-bold mb-4">Welcome to MERN Auth System</h1>
            <p className="text-lg mb-6 max-w-2xl">
                Secure and efficient authentication system built with MongoDB, Express.js, React, and Node.js.
            </p>
            <p className="text-sm text-gray-300 max-w-lg">
                Experience seamless user registration, login, and authentication with modern security practices.
            </p>
        </header>
    );
};

export default Header;