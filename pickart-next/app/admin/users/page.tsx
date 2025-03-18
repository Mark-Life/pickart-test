import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search, ArrowUpDown, User, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Manage Users | PickArt Admin",
  description: "Add, edit, and manage users in the PickArt platform",
}

export default function UsersPage() {
  // Mock users data
  const users = [
    {
      id: "1",
      firstName: "Emma",
      lastName: "Johnson",
      email: "emma.johnson@example.com",
      phone: "+1 (555) 123-4567",
      type: "artist",
      status: "active",
      createdAt: "2023-01-15",
      displayName: "Emma Johnson",
      contractSigned: true,
    },
    {
      id: "2",
      firstName: "Marcus",
      lastName: "Chen",
      email: "marcus.chen@example.com",
      phone: "+1 (555) 234-5678",
      type: "artist",
      status: "active",
      createdAt: "2023-02-20",
      displayName: "Marcus Chen",
      contractSigned: true,
    },
    {
      id: "3",
      firstName: "Olivia",
      lastName: "Parker",
      email: "olivia.parker@example.com",
      phone: "+1 (555) 345-6789",
      type: "artist",
      status: "pending",
      createdAt: "2023-03-10",
      displayName: "Olivia Parker",
      contractSigned: false,
    },
    {
      id: "4",
      firstName: "James",
      lastName: "Wilson",
      email: "james.wilson@example.com",
      phone: "+1 (555) 456-7890",
      type: "host",
      status: "active",
      createdAt: "2023-01-25",
      businessName: "Grand Hotel",
      contractSigned: true,
    },
    {
      id: "5",
      firstName: "Sophia",
      lastName: "Martinez",
      email: "sophia.martinez@example.com",
      phone: "+1 (555) 567-8901",
      type: "host",
      status: "active",
      createdAt: "2023-02-05",
      businessName: "Skyline Apartments",
      contractSigned: true,
    },
    {
      id: "6",
      firstName: "David",
      lastName: "Lee",
      email: "david.lee@example.com",
      phone: "+1 (555) 678-9012",
      type: "host",
      status: "pending",
      createdAt: "2023-03-20",
      businessName: "Tech Hub Offices",
      contractSigned: false,
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Add, edit, and manage users. Approve registrations and manage contracts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search users..." className="pl-8" />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" className="md:w-auto">
              <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="artists">Artists</TabsTrigger>
              <TabsTrigger value="hosts">Hosts</TabsTrigger>
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Contact</th>
                        <th className="py-3 px-4 text-left font-medium">Type</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Contract</th>
                        <th className="py-3 px-4 text-left font-medium">Joined</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="bg-gray-100 rounded-full p-2 mr-2">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {user.type === "artist" ? user.displayName : user.businessName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1 text-gray-500" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Phone className="h-3 w-3 mr-1 text-gray-500" />
                                <span>{user.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={
                                user.type === "artist"
                                  ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              }
                            >
                              {user.type === "artist" ? "Artist" : "Host"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={
                                user.status === "active"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                              }
                            >
                              {user.status === "active" ? "Active" : "Pending"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {user.contractSigned ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                                Signed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-100">
                                Not Signed
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">{user.createdAt}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </Link>
                              {user.status === "pending" && (
                                <button className="text-xs text-green-600 hover:text-green-800">Approve</button>
                              )}
                              <button className="text-xs text-red-600 hover:text-red-800">Deactivate</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Other tab contents would be similar but filtered */}
            <TabsContent value="artists" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only artist users</div>
            </TabsContent>
            <TabsContent value="hosts" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only host users</div>
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <div className="p-8 text-center text-gray-500">Filter to show only pending approval users</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

