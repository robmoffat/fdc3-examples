import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {ContactTable} from "@/components/ContactTable"
import {ContactDetails} from "@/components/ContactDetails"
import {GitHubProfiles} from "@/components/GitHubProfiles"
import {useEffect} from "react"
import {getAgent} from "@finos/fdc3"

function App() {
  useEffect(() => {
    const initFdc3 = async () => {
      try {
        await getAgent()
        console.log("FDC3 initialized successfully")
      } catch (error) {
        console.error("Error initializing FDC3:", error)
      }
    }

    initFdc3()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto py-10">
          <div className="rounded-lg bg-white dark:bg-slate-800 p-8 shadow-lg">
            <Routes>
              <Route
                path="/crm"
                element={
                  <>
                    <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Super-Duper CRM</h1>
                    <ContactTable />
                  </>
                }
              />
              <Route path="/crm/contact/:email" element={<ContactDetails />} />
              <Route path="/github" element={<GitHubProfiles />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
