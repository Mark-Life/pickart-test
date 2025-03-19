import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthContainer from '@/components/auth/auth-container'
import MagicLinkForm from '@/components/auth/magic-link-form'
import AuthToggle from '@/components/auth/auth-toggle'

export default async function LoginPage() {
  const supabase = await createClient()
  
  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession()
  
  // If there is a session, redirect to the platform home
  if (session) {
    redirect('/platform')
  }
  
  return (
    <AuthContainer
      title="Platform Login"
      subtitle="Sign in to access the PickArt platform"
    >
      <MagicLinkForm type="login" />
      <AuthToggle type="login" />
    </AuthContainer>
  )
} 