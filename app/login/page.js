// app/login/page.js
import Login from '@/components/Login'
import Main from '@/components/Main'
import React from 'react'

export const metadata = {
    title: "Broodl · Login",
};

export default function LoginPage() {
  return (
    <Main>
        <Login />
    </Main>
  )
}