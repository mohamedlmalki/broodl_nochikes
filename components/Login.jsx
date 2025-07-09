'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react'
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login({ isRegisterPage = false }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authenticating, setAuthenticating] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const router = useRouter()

    const { signup, login } = useAuth()

    async function handleSubmit() {
        if (!email || !password || password.length < 6) {
            setError('Please provide a valid email and a password of at least 6 characters.')
            return
        }
        setAuthenticating(true)
        setError('')
        setMessage('')
        try {
            if (isRegisterPage) {
                await signup(email, password)
                setMessage('Signup successful! A verification link has been sent to your email address.')
            } else {
                await login(email, password)
                router.push('/dashboard')
            }

        } catch (err) {
            console.log(err.message)
            setError(err.message.replace('Firebase: ', ''))
        } finally {
            setAuthenticating(false)
        }

    }

    return (
        <div className='flex flex-col flex-1 justify-center items-center gap-4'>
            <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>{isRegisterPage ? 'Register' : 'Log In'}</h3>
            <p>You&#39;re one step away!</p>

            {error && <p className='w-full max-w-[400px] text-center p-2 bg-red-100 text-red-600 rounded-md'>{error}</p>}
            {message && <p className='w-full max-w-[400px] text-center p-2 bg-green-100 text-green-600 rounded-md'>{message}</p>}

            <input value={email} onChange={(e) => {
                setEmail(e.target.value)
            }} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Email' />
            
            <input value={password} onChange={(e) => {
                setPassword(e.target.value)
            }} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Password' type='password' />
            
            {/* ADD THIS FOR THE FORGOT PASSWORD LINK */}
            <div className='w-full max-w-[400px] mx-auto text-right px-2'>
                {!isRegisterPage && (
                    <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                        Forgot Password?
                    </Link>
                )}
            </div>

            <div className='max-w-[400px] w-full mx-auto mt-2'>
                <Button 
                    id={isRegisterPage ? 'signup-submit-button' : 'login-submit-button'}
                    clickHandler={handleSubmit} 
                    text={authenticating ? 'Submitting' : "Submit"} 
                    full 
                />
            </div>

            {isRegisterPage ? (
                <p className='text-center'>Already have an account? <Link href="/login" className='text-indigo-600'>Sign in</Link></p>
            ) : (
                <p className='text-center'>Don't have an account? <Link href="/signup" className='text-indigo-600'>Sign up</Link></p>
            )}
        </div>
    )
}