import React, { useState, useEffect, useRef, useContext, } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext'

const ResetPassword = () => {

    axios.defaults.withCredentials = true

    const [email, setEmmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState('')
    const [otp, setOtp] = useState(0)
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

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




    const onSubmitOtp = async (e) => {
        e.preventDefault()
        const otpArray = inputRefs.current.map(e => e.value)
        const otp1 = otpArray.join('')
        setOtp(otp1)
        setIsOtpSubmitted(true)

    }


    const onSubmitEmail = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post(backendUrl + '/api/v1/user/send-reset-otp', { email })
            if (data.success) {
                toast.success(data.message)
                setIsEmailSent(true)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    const onSubmitNewPassword = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axios.post(backendUrl + '/api/v1/user/reset-password', { email, otp, newPassword })
            if (data.success) {
                toast.success(data.message)
                navigate('/login')
            } else {
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
        <div className='flex items-center flex-col gap-20 justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
            <span onClick={() => navigate('/')} className='text-gray-700 font-bold text-5xl cursor-pointer'>Mern Auth</span>


            {/*  email form */}

            {!isEmailSent &&
                <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter your register email address</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <input className='outline-none bg-transparent text-white w-full'
                            type='email'
                            placeholder='email'
                            value={email}
                            onChange={e => setEmmail(e.target.value)}
                            required
                        />
                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>

                </form>
            }


            {/* otp inout form */}

            {!isOtpSubmitted && isEmailSent &&
                <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
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
                        submit
                    </button>
                </form>

            }

            {/* new password */}

            {isOtpSubmitted && isEmailSent &&
                <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
                    <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
                    <p className='text-center mb-6 text-indigo-300'>Enter the new password below</p>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <input className='outline-none bg-transparent text-white w-full'
                            type='password'
                            placeholder='Password'
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>

                </form>
            }



        </div>
    )
}

export default ResetPassword