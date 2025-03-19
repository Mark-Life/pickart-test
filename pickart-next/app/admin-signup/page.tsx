import AdminSignupForm from "@/components/auth/admin-signup-form"

export const metadata = {
  title: "Admin Signup | PickArt",
  description: "Complete your admin account setup",
}

export default function AdminSignupPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Admin Account Setup</h1>
        <AdminSignupForm />
      </div>
    </div>
  )
}

