import Link from 'next/link'

interface AuthToggleProps {
  type: 'login' | 'signup'
}

export default function AuthToggle({ type }: AuthToggleProps) {
  const isLogin = type === 'login'
  
  return (
    <div className="text-center mt-4">
      <p className="text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <Link 
          href={isLogin ? "/platform/signup" : "/platform/login"} 
          className="text-black font-semibold"
        >
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  )
} 