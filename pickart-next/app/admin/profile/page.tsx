import UserProfile from "@/components/profile/user-profile"

export const metadata = {
  title: "My Profile | PickArt Admin",
  description: "Manage your profile and account settings",
}

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <UserProfile />
    </div>
  )
}

