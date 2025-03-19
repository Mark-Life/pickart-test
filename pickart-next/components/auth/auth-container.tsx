import React, { ReactNode } from 'react'

interface AuthContainerProps {
  title: string
  subtitle: string
  children: ReactNode
}

export default function AuthContainer({ title, subtitle, children }: AuthContainerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-gray-600">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  )
} 