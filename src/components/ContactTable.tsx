import {useEffect, useState} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useNavigate} from "react-router-dom"
import crmData from "@/data/crm.json"

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

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 dark:bg-slate-800">
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">First Name</TableHead>
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Last Name</TableHead>
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Company</TableHead>
            <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Email</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
