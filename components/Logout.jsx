'use client'
import React from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
    const { logout, currentUser } = useAuth()
    const pathname = usePathname()

    if (!currentUser) {
        return null
    }

    if (pathname === '/') {
        return (
            <Link href={'/dashboard'}>
                <Button id="go-to-dashboard-button" text="Go to dashboard" />
            </Link>
        )
    }

    return (
        <Button id="logout-button" text='Logout' clickHandler={logout} />
    )
}