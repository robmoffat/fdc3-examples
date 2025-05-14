import {useEffect, useState} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useNavigate} from "react-router-dom"
import crmData from "@/data/crm.json"
import {getAgent, Contact as Fdc3Contact} from "@finos/fdc3"

interface Contact {
  firstName: string
  lastName: string
  company: string
  email: string
}

export function ContactTable() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // In a real app, this would be an API call
    setContacts(crmData.contacts)
  }, [])

  const handleRaiseIntent = async (contact: Contact) => {
    try {
      const fdc3 = await getAgent()
      const context: Fdc3Contact = {
        type: "fdc3.contact",
        name: `${contact.firstName} ${contact.lastName}`,
        id: {
          email: contact.email,
        },
      }
      await fdc3.raiseIntentForContext(context)
      console.log("ViewChat intent raised for:", context)
    } catch (error) {
      console.error("Failed to raise ViewChat intent:", error)
      // Optionally, display an error to the user
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 dark:bg-slate-800">
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">First Name</TableHead>
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Last Name</TableHead>
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Company</TableHead>
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Email</TableHead>
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
              <TableCell
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate(`/crm/contact/${encodeURIComponent(contact.email)}`)}>
                {contact.firstName}
              </TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">{contact.lastName}</TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">{contact.company}</TableCell>
              <TableCell className="text-blue-600 dark:text-blue-400 hover:underline">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRaiseIntent(contact)
                  }}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                  title={`Chat with ${contact.firstName} ${contact.lastName}`}>
                  <img src="/fdc3/icon.svg" alt="Raise FDC3 Intent" className="w-5 h-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
