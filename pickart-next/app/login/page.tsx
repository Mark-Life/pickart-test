import LoginForm from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In | PickArt",
  description: "Sign in to your PickArt account",
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sign In to PickArt</h1>
        <LoginForm />
      </div>
    </div>
  )
}

