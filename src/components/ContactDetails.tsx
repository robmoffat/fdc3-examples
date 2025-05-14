import {useEffect, useState} from "react"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {useNavigate, useParams} from "react-router-dom"
import crmData from "@/data/crm.json"
import {getAgent} from "@finos/fdc3"

interface Interaction {
  date: string
  notes: string
}

interface Contact {
  firstName: string
  lastName: string
  company: string
  email: string
  linkedinUrl: string
  notes: string
  interactions: Interaction[]
}

export function ContactDetails() {
  const {email} = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)

  useEffect(() => {
    const foundContact = crmData.contacts.find((c) => c.email === email)
    setContact(foundContact || null)
  }, [email])

  useEffect(() => {
    if (contact) {
      // Broadcast contact information using FDC3
      const fdc3Contact = {
        type: "fdc3.contact",
        name: `${contact.firstName} ${contact.lastName}`,
        id: {
          email: contact.email,
        },
      } as const

      const broadcastContact = async () => {
        try {
          const agent = await getAgent()
          await agent.broadcast(fdc3Contact)
          console.log("Successfully broadcast contact:", contact.email)
        } catch (error) {
          console.error("Error broadcasting contact:", error)
        }
      }

      broadcastContact()
    }
  }, [contact])

  if (!contact) return <div>Contact not found</div>

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
        ← Back to Directory
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {contact.firstName} {contact.lastName}
          </h2>

          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Company:</span> {contact.company}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Email:</span>{" "}
              <a href={`mailto:${contact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {contact.email}
              </a>
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold">LinkedIn:</span>{" "}
              <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Profile
              </a>
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Notes</h3>
            <p className="text-slate-600 dark:text-slate-300 italic">"{contact.notes}"</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Interaction History</h3>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 dark:bg-slate-800">
                  <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Date</TableHead>
                  <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contact.interactions.map((interaction, index) => (
                  <TableRow key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-200">{new Date(interaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{interaction.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
