import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import useFdc3ContactListener from "../hooks/useFdc3ContactListener"

// Assuming CRM types are similar to what ChatMessagesPage might use
interface CrmContact {
  firstName: string
  lastName: string
  email: string
  // other fields...
}

// Placeholder for a function that lists chat files
// In a real app, this would involve a backend call or a specific file system API if run in Node.js
// For this example, we'll simulate it based on the known chat files.
const listChatFiles = async (): Promise<string[]> => {
  // Simulate fetching file names. These match the files created in the previous step.
  return Promise.resolve(["eteri_dvalishvili.json", "aaron_griswold.json", "win_morgan.json", "jane_gavronsky.json"])
}

const formatChatName = (fileName: string): string => {
  const namePart = fileName.replace(".json", "")
  const parts = namePart.split("_")
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
}

const ChatList: React.FC = () => {
  useFdc3ContactListener()

  const [chats, setChats] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        const files = await listChatFiles()
        const chatNames = files.map(formatChatName)
        setChats(chatNames)
        setError(null)
      } catch (err) {
        console.error("Error fetching chat list:", err)
        setError("Failed to load chat list.")
        setChats([])
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  if (loading) {
    return <div className="p-4">Loading chats...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Chats</h1>
      {chats.length === 0 ? (
        <p>No chats found.</p>
      ) : (
        <ul className="space-y-2">
          {chats.map((chatName) => (
            <li key={chatName} className="p-2 border rounded hover:bg-gray-100">
              <Link to={`/chat/${chatName.toLowerCase().replace(/ /g, "_")}`} className="text-blue-500 hover:underline">
                {chatName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ChatList
