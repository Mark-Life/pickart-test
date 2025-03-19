import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ArtworksComponent from '@/components/platform/artwork'

export const metadata = {
  title: "Artwork Management | PickArt Platform",
  description: "Manage your artworks on the PickArt platform",
}

export default async function ArtworksPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // If not authenticated, redirect to login
    redirect('/platform/login')
  }
  
  return <ArtworksComponent user={user} />
} 