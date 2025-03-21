import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

    axios.defaults.withCredentials = true



    const inputRefs = useRef([]);
    const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext)
    const navigate = useNavigate()


    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            const otpArray = inputRefs.current.map(e => e.value)
            const otp = otpArray.join('')

            const { data } = await axios.post(backendUrl + '/api/v1/user/verify-account', { otp })
            if (data.success) {
                toast.success(data.message)
                getUserData()
                navigate('/')
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    useEffect(() => {
        isLoggedin && userData && userData.isAccountVerified && navigate('/')

    }, [isLoggedin, userData])

    return (
        <div className='flex flex-col gap-10 items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
            <span className='left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer font-bold text-center sm:text-3xl text-xl'>
                Mern Auth
            </span>

            <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
                <p className='text-center mb-6 text-indigo-300'>Enter the 6 digit code sent to your email</p>

                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            className='w-12 h-12 bg-[#333A5C] text-white text-center text-lg rounded-md'
                            type='text'
                            maxLength='1'
                            key={index}
                            required
                            ref={(el) => (inputRefs.current[index] = el)}
                            onInput={(e) => handleInput(e, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                        />
                    ))}
                </div>

                <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
                    Verify Email
                </button>
            </form>
        </div>
    );
};

export default EmailVerify;
