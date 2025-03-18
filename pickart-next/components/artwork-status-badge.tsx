import { Badge } from "@/components/ui/badge"

type ArtworkStatus = "DRAFT" | "PENDING" | "READY" | "ALLOCATED" | "DELIVERED" | "LIVE"

interface ArtworkStatusBadgeProps {
  status: ArtworkStatus
}

export function ArtworkStatusBadge({ status }: ArtworkStatusBadgeProps) {
  const getStatusConfig = (status: ArtworkStatus) => {
    switch (status) {
      case "DRAFT":
        return { label: "Draft", className: "bg-gray-100 text-gray-800 hover:bg-gray-200" }
      case "PENDING":
        return { label: "Pending Approval", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" }
      case "READY":
        return { label: "Ready for Allocation", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" }
      case "ALLOCATED":
        return { label: "Allocated", className: "bg-purple-100 text-purple-800 hover:bg-purple-200" }
      case "DELIVERED":
        return { label: "Delivered", className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" }
      case "LIVE":
        return { label: "Live", className: "bg-green-100 text-green-800 hover:bg-green-200" }
      default:
        return { label: status, className: "bg-gray-100 text-gray-800 hover:bg-gray-200" }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

