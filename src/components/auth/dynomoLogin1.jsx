/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import 'react-phone-input-2/lib/style.css'
import { applelogo, eye, eyeoff, finabeeoutline, finabeewithline, google, logoDynomo, techLogin, logo, login_sec_img } from '../icons/icon'
import { } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, message } from 'antd'
import { CircularProgress } from '@mui/material'
import axios from 'axios'
import { dataPost } from '../utils/myAxios'
// import { apiRequest } from '../../api/auth_api'

const DynomoLogin1 = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false)
    const navigate = useNavigate()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (data) => {
        setIsProcessing(true)
        try {
            // const res = await axios.post(`${global.BASEURL}api/auth/admin`,
            //     {
            //         email: data?.email,
            //         password: data?.password,
            //     }, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // })
            let data1 = {
                email: data?.email,
                password: data?.password,
            }
            const endPoint = 'auth/admin/'
            const res = await dataPost(endPoint, data1);


            console.log(res);
            if (res?.data.success) {
                localStorage.setItem('login_admin_token', res?.data?.token)
                localStorage.setItem('token', res?.data?.token)
                localStorage.setItem('login_admin_data', JSON.stringify(res?.data?.user))
                localStorage.setItem('isLogin_finabee_admin', true)
                localStorage.setItem('user_type', res?.data?.user?.type)
                localStorage.setItem('dispatch_limit', res?.data?.user?.dispatcherAccess)
                if (res?.data?.subscription) {
                    localStorage.setItem('subscription', JSON.stringify(res?.data?.subscription))
                } else {
                    localStorage.setItem('subscription', false)
                }

                if (res?.data?.user?.type == 'super_admin') {
                    navigate('/super/dashboard')
                } else {
                    navigate('/dashboard')
                }
            } else {
                message.error(res?.data?.message)
            }
        } catch (error) {
            setIsProcessing(false)
            message.error("Invalid credentials")
            console.log(error);
        } finally {
            setIsProcessing(false)
        }
    };

    return (
        <>
            <div className='w-full h-screen overflow-hidden flex flex-row'>
                <div className='w-full lg:w-1/2 h-full overflow-y-scroll p-4'>
                    <div className='flex flex-col h-[90vh] md:h-[100%]'>
                        <div className='d-flex justify-content-end w-full mb-4'>
                            <Link to='/dashboard'>
                                <img src={logo} style={{ height: '5rem', width: 'auto' }} className='' alt="" />
                            </Link>
                        </div>
                        <div className='border border-white p-xl-4'>
                            <h2 className='poppins_semibold text-xl mb-0 md:mb-auto md:text-2xl lg:text-3xl text_black'>Login</h2>
                            <p className='text_secondary max-md:text-sm poppins_regular my-2'>Login to your account</p>
                            <Form layout='verticle' className='flex flex-wrap justify-between' onFinish={handleSubmit}>
                                <span className='plusJakara_medium mb-2 text_black text-lg w-full'>Email Address</span>
                                <Form.Item
                                    name='email'
                                    className="mb-3 w-full plusJakara_medium"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'The Input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: 'Please Input your E-mail!',
                                        },
                                    ]}>
                                    <Input size='large' placeholder='Your Email Address' />
                                </Form.Item>
                                <span className='plusJakara_medium mb-2 text_black text-lg w-full'>Password</span>
                                <Form.Item
                                    name='password'
                                    className="w-full mb-0 plusJakara_medium"
                                    rules={[
                                        { min: 6, message: "Please Enter a strong Password", required: true, whitespace: true }
                                    ]}
                                    hasFeedback>
                                    <div className="relative">
                                        <div className="flex justify-end">
                                            <img
                                                src={showPassword ? eye : eyeoff}
                                                className='absolute m-2 cursor-popoppins'
                                                alt="Toggle Password Visibility"
                                                onClick={togglePasswordVisibility}
                                            />
                                            <Input.Password size='large' placeholder='********' />
                                        </div>
                                    </div>
                                </Form.Item>
                                {/* <button type='button' className="my-[18px] md:my-[24px] text-sm text-[#0E73F6] poppins_semibold">Forgot Password?</button> */}
                                <div className='w-full my-3'>
                                    {!isProcessing ? (
                                        <button type='submit' className='w-full rounded-3 bg_darkprimary text_white p-2 text-lg plusJakara_regular flex justify-center items-center'>Login</button>
                                    ) : (
                                        <button type="button" className='w-full rounded-3 bg_darkprimary text_white p-2 flex justify-center items-center' disabled>
                                            <CircularProgress style={{ color: 'white' }} size={24} className='text_white' />
                                        </button>
                                    )
                                    }
                                </div>
                            </Form>
                        </div>
                        <p className='text_secondary max-md:text-sm poppins_regular my-2 text-center' style={{ cursor: 'pointer' }} onClick={() => {
                            navigate('/register')
                        }}>Don`t have an account?<span style={{ color: '#6688E8' }}> Sign Up</span></p>
                    </div>
                </div>
                <div className='d-none bg_darkprimary d-md-flex justify-content-center align-items-center p-1 w-full lg:w-1/2'>
                    <img src={login_sec_img} alt="ImageNotfound" className="w-full h-full object-contain" />
                </div>
            </div>
        </>
    )
}
export default DynomoLogin1;