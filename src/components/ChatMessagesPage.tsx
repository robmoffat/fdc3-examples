import React, {useEffect, useState} from "react"
import {useParams, Link} from "react-router-dom"
import useFdc3ContactListener from "../hooks/useFdc3ContactListener"

interface ChatMessage {
  time: string
  who_is_talking: boolean // true = this app's user, false = the contact
  message: string
}

const ChatMessagesPage: React.FC = () => {
  useFdc3ContactListener()

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
        setError(null) // Clear previous errors at the start of a fetch

        const parts = chatId.split("_")
        const formattedName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
        setContactName(formattedName)

        // Fetch chat messages
        const messagesRes = await fetch(`/chat/${chatId}.json`)

        if (!messagesRes.ok) {
          if (messagesRes.status === 404) {
            // File not found, treat as a new chat
            setMessages([])
            console.log(`No chat history found for ${chatId}. Presenting as new chat.`)
          } else {
            // Other error (e.g., server error, network issue for this specific file)
            throw new Error(`Could not load chat messages for ${chatId}. Status: ${messagesRes.status}`)
          }
        } else {
          // File found and response is OK
          const messagesData = await messagesRes.json()
          setMessages(messagesData)
        }
      } catch (err: any) {
        setMessages([]) // Ensure messages are cleared on general error
      } finally {
        setLoading(false)
      }
    }

    fetchChatData()
  }, [chatId])

  if (loading) {
    return <div className="p-4">Loading messages...</div>
  }

  // Display general error only if it's not a 'new chat' scenario (where error is null)
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
      <div className="space-y-4 bg-white p-6 rounded-lg shadow">
        {messages.length === 0 && !loading && !error && <p className="text-gray-500 text-center">No messages yet. Start a new conversation!</p>}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.who_is_talking ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xl p-3 rounded-lg shadow ${msg.who_is_talking ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs mt-1 opacity-75">{new Date(msg.time).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Placeholder for message input area */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
        <input type="text" placeholder="Type your message..." className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send</button>
      </div>
    </div>
  )
}

export default ChatMessagesPage
