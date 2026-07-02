import ProtectedRoute from "@/components/protected-route"
import ChatPageContent from "./chat-page-content"

export default async function Chat({
  params,
}: {
  params: Promise<{ ids: Array<string> }>
}) {
  const { ids } = await params

  return (
    <ProtectedRoute>
      <ChatPageContent ids={ids} />
    </ProtectedRoute>
  )
}