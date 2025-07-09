'use client'
import Link from 'next/link'
import React from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'

export default function CallToAction() {
    const { currentUser } = useAuth()

    if (currentUser) {
        return (
            <div className='max-w-[600px] mx-auto w-full'>
                <Link href={'/dashboard'}>
                    <Button id="cta-dashboard-button" dark full text="Go to dashboard" />
                </Link>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 gap-4 w-fit mx-auto'>
            <Link href={'/signup'}>
                <Button id="cta-signup-button" text="Sign Up" />
            </Link>
            <Link href={'/login'}>
                <Button id="cta-login-button" text="Login" dark />
            </Link>
        </div>
    )
}