'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface MagicLinkFormProps {
  type: 'login' | 'signup'
  redirectTo?: string
}

export default function MagicLinkForm({ type, redirectTo = '/platform' }: MagicLinkFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const isLogin = type === 'login'
  const buttonText = isLogin ? 'Send Magic Link' : 'Create Account'
  const successMessage = isLogin 
    ? 'Check your email for the login link!' 
    : 'Check your email for the signup link!';
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      })
      
      if (error) {
        setError(error.message)
      } else {
        setMessage(successMessage)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-500 text-center">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 p-4 rounded-md text-green-600 text-center">
            {message}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-black focus:border-black"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                        shadow-sm text-sm font-medium text-white bg-black 
                        hover:bg-gray-800 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-black ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Sending...' : buttonText}
          </button>
        </div>
      </form>
    </div>
  )
} 