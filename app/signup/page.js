// app/signup/page.js
import Login from '@/components/Login'
import Main from '@/components/Main'
import React from 'react'

export const metadata = {
    title: "Broodl · Register",
};

export default function SignupPage() {
  return (
    <Main>
        <Login isRegisterPage={true} />
    </Main>
  )
}