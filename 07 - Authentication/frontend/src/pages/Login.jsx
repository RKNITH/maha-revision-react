import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [state, setState] = useState("sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            axios.defaults.withCredentials = true;

            // Input validation
            if (!email || !password || (state === "sign Up" && !name)) {
                return toast.error("Please fill in all fields");
            }

            let response;
            if (state === "sign Up") {
                response = await axios.post(`${backendUrl}/api/v1/user/register`, { name, email, password });
            } else {
                response = await axios.post(`${backendUrl}/api/v1/user/login`, { email, password });
            }

            if (response?.data?.success) {
                setIsLoggedin(true);
                getUserData()
                navigate("/");
                toast.success(response.data.message || "Login successful");
            } else {
                throw new Error(response.data.message || "An error occurred");
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                toast.error(error.response.data.message || "Server error");
            } else if (error.request) {
                // No response received
                toast.error("No response from server. Please try again.");
            } else {
                // Other errors
                toast.error(error.message || "Something went wrong");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
            {/* Logo */}
            <span onClick={() => navigate('/')} className="text-4xl font-bold text-blue-500 mb-6 cursor-pointer">
                MERN Auth
            </span>

            {/* Form Container */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-2">
                    {state === "sign Up" ? "Create Account" : "Login"}
                </h2>
                <p className="text-gray-400 text-center mb-6">
                    {state === "sign Up" ? "Create your account" : "Login to your account"}
                </p>

                <form onSubmit={onSubmitHandler} className="space-y-4">
                    {state === "sign Up" && (
                        <div>
                            <label className="block text-gray-300">Name</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                className="w-full p-2 rounded bg-gray-700 focus:outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-gray-300">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
                        />
                    </div>

                    <p onClick={() => navigate('/reset-password')} className="text-blue-400 text-sm text-right cursor-pointer hover:underline">
                        Forgot Password?
                    </p>

                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition duration-300">
                        {state}
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-4">
                    {state === "sign Up" ? "Already have an account? " : "Don't have an account? "}
                    <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => setState(state === "sign Up" ? "Login" : "sign Up")}>
                        {state === "sign Up" ? "Login here" : "Sign up here"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
