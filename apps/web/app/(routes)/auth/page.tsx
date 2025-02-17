import AuthPage from '@/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Auth | Advanced Beauty`,
  description:
    'Access your account at Advanced Beauty. Sign in or create an account to manage appointments, explore services, and enjoy exclusive member benefits.',
}

const page = () => {
  return <AuthPage />
}

export default page
