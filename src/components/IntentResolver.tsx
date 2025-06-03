import {useEffect, useState} from "react"
import {Channel, getAgent, Instrument} from "@finos/fdc3"

export function IntentResolver() {
  const [status, setStatus] = useState<string>("")
  const [messagesSent, setMessagesSent] = useState<number>(0)

  useEffect(() => {
    const startPublishing = async (channel: Channel, instrument: Instrument) => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const nc = {
            type: "fidelity.trade-signal",
            name: "Mean Reversion",
            instrument: instrument,
            action: "BUY",
            confidence: 0.78,
            "price-target": 535.0 + Math.random() * 10,
          }
          channel.broadcast(nc)
          setMessagesSent((prev) => prev + 1)
        }, 1000 * i)
      }
    }

    const setupIntentListener = async () => {
      try {
        const fdc3 = await getAgent()
        await fdc3.addIntentListener("GetAlerts", async (context) => {
          setStatus(`Received intent with context: ${JSON.stringify(context)}`)
          if (context.type == "fdc3.instrument") {
            const privateChannel = await fdc3.createPrivateChannel()
            startPublishing(privateChannel, context.instrument)
            return privateChannel
          }
        })
        setStatus("Intent listener set up successfully")
      } catch (error) {
        console.error("Failed to set up intent listener:", error)
        setStatus("Failed to set up intent listener. See console for details.")
      }
    }

    setupIntentListener()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Intent Resolver Demo</h1>
      {status && <p className="mt-4 text-slate-600">{status}</p>}
      <div className="mt-4 p-4 bg-slate-100 rounded-lg">
        <p className="text-lg font-semibold">Messages Sent: {messagesSent}</p>
      </div>
    </div>
  )
}
