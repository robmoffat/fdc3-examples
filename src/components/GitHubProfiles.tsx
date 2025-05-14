import {useEffect, useState} from "react"
import {getAgent} from "@finos/fdc3"
import {Card} from "@/components/ui/card"

interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  type: string
  score: number
}

interface GitHubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GitHubUser[]
}

export function GitHubProfiles() {
  const [users, setUsers] = useState<GitHubUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupFdc3 = async () => {
      try {
        const agent = await getAgent()
        await agent.addContextListener("fdc3.contact", async (context) => {
          setLoading(true)
          setError(null)

          try {
            // Extract name from context and create search query
            const name = context.name?.replace(/\s+/g, "+")
            const response = await fetch(`https://api.github.com/search/users?q=${name}`)

            if (!response.ok) {
              throw new Error("Failed to fetch GitHub users")
            }

            const data: GitHubSearchResponse = await response.json()
            setUsers(data.items)
          } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
            setUsers([])
          } finally {
            setLoading(false)
          }
        })

        console.log("FDC3 context listener set up successfully")
      } catch (error) {
        console.error("Error setting up FDC3:", error)
        setError("Failed to initialize FDC3")
      }
    }

    setupFdc3()
  }, [])

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-slate-600 dark:text-slate-300">Loading GitHub profiles...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">GitHub Profiles</h1>

      {users.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-300">No GitHub profiles to display. Select a contact to search for their GitHub profile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{user.login}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{user.type}</p>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block">
                    View Profile →
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
