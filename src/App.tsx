import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {ContactTable} from "@/components/ContactTable"
import {ContactDetails} from "@/components/ContactDetails"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto py-10">
          <div className="rounded-lg bg-white dark:bg-slate-800 p-8 shadow-lg">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Super-Duper CRM</h1>
                    <ContactTable />
                  </>
                }
              />
              <Route path="/contact/:email" element={<ContactDetails />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
