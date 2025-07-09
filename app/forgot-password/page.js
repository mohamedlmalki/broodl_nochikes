// app/forgot-password/page.js
import ForgotPassword from '@/components/ForgotPassword'
import Main from '@/components/Main'
import React from 'react'

export const metadata = {
    title: "Broodl · Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <Main>
        <ForgotPassword />
    </Main>
  )
}