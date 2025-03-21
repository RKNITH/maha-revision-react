import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {

    const naviagte = useNavigate()
    const { backendUrl, userData, setUserData, setIsLoggedin } = useContext(AppContext)


    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/v1/user/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            naviagte('/')

        } catch (error) {
            toast.error(error.message)

        }
    }


    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/v1/user/send-verify-otp')
            if (data.success) {
                naviagte('/email-verify')
                toast.success(data.message)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }


    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <div className="text-xl font-bold">
                    <span className="text-blue-500">MERN</span> Auth
                </div>

                {/* Login Button */}

                {
                    userData
                        ? <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
                            {userData.name[0].toUpperCase()}
                            <div className="absolute hidden group-hover:block top-0 right-0 text-black  rounded pt-10 z-10">
                                <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                                    {
                                        !userData.isAccountVerified && <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify email</li>
                                    }
                                    <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
                                </ul>
                            </div>
                        </div>
                        : <button onClick={() => naviagte('/login')} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition duration-300">
                            Login
                        </button>
                }
            </div>
        </nav>
    );
};

export default Navbar;
