import {ContactTable} from "@/components/ContactTable"

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto py-10">
        <div className="rounded-lg bg-white dark:bg-slate-800 p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">FINOS Team Directory</h1>
          <ContactTable />
        </div>
      </div>
    </div>
  )
}

export default App
