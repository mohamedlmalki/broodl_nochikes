'use client'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Button from './Button'
import { Fugaz_One } from 'next/font/google'
import Link from 'next/link'

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const { resetPassword } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()

        if (!email) {
            return setError('Please enter your email address.')
        }
        try {
            setError('')
            setMessage('')
            setLoading(true)

            // Directly call the resetPassword function from AuthContext
            await resetPassword(email)

            // Always show a general message for security
            setMessage('If an account with this email exists, a password reset link has been sent.')

        } catch (err) {
            setError('Failed to send reset email. Please try again.')
            console.log(err)
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col flex-1 justify-center items-center gap-4'>
            <h3 className={'text-4xl sm:text-5xl md:text-6xl text-center ' + fugaz.className}>Reset Password</h3>
            <p>Enter your email to receive a reset link.</p>

            {error && <p className='w-full max-w-[400px] text-center p-2 bg-red-100 text-red-600 rounded-md'>{error}</p>}
            {message && <p className='w-full max-w-[400px] text-center p-2 bg-green-100 text-green-600 rounded-md'>{message}</p>}

            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none'
                placeholder='Email'
                type='email'
            />
            <div className='max-w-[400px] w-full mx-auto'>
                <Button
                    id="reset-password-button"
                    type="submit"
                    text={loading ? 'Sending...' : "Send Reset Link"}
                    full
                />
            </div>
            <Link href="/login" className='text-indigo-600 mt-4'>Back to Login</Link>
        </form>
    )
}