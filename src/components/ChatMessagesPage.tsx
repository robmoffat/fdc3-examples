import React, {useEffect, useState} from "react"
import {useParams, Link} from "react-router-dom"

interface ChatMessage {
  time: string
  who_is_talking: boolean // true = this app's user, false = the contact
  message: string
}

const ChatMessagesPage: React.FC = () => {
  const {chatId} = useParams<{chatId: string}>()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [contactName, setContactName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChatData = async () => {
      if (!chatId) return
      try {
        setLoading(true)
        // Fetch chat messages
        const messagesRes = await fetch(`/chat/${chatId}.json`)
        if (!messagesRes.ok) {
          throw new Error(`Could not load chat messages for ${chatId}. Status: ${messagesRes.status}`)
        }
        const messagesData = await messagesRes.json()
        setMessages(messagesData)

        // Derive contactName from chatId
        const parts = chatId.split("_")
        const formattedName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
        setContactName(formattedName)

        setError(null)
      } catch (err: any) {
        console.error("Error fetching chat data or formatting name:", err)
        setError(err.message || "Failed to load chat messages.")
        setMessages([])
      } finally {
        setLoading(false)
      }
    }

    fetchChatData()
  }, [chatId])

  if (loading) {
    return <div className="p-4">Loading messages...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link to="/chat" className="text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-150 ease-in-out">
          &larr; Back to Chats
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Chat with {contactName}</h1>
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.who_is_talking ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl p-3 rounded-lg ${msg.who_is_talking ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs mt-1 opacity-75">{new Date(msg.time).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatMessagesPage
