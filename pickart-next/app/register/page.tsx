import RegisterForm from "@/components/auth/register-form"

export const metadata = {
  title: "Create Account | PickArt",
  description: "Create a new PickArt account",
}

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Join PickArt</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

