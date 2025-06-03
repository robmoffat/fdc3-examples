import {useState} from "react"
import {Channel, getAgent, Context, IntentResolution, Instrument} from "@finos/fdc3"

const context: Instrument = {
  type: "fdc3.instrument",
  name: "Microsoft",
  id: {
    ticker: "MSFT",
  },
}

interface ChannelMessages {
  channelId: string
  instrument: Instrument
  messages: Context[]
}

export function IntentRaiser() {
  const [status, setStatus] = useState<string>("")
  const [channels, setChannels] = useState<ChannelMessages[]>([])

  const raiseIntent = async () => {
    try {
      const fdc3 = await getAgent()
      const resolution = await fdc3.raiseIntentForContext(context)
      const channel = (await resolution.getResult()) as Channel

      // Add new channel to state
      setChannels((prev) => [...prev, {channelId: channel.id, instrument: context, messages: []}])

      // Listen for messages on this channel
      channel.addContextListener(null, (context: Context) => {
        setChannels((prev) => prev.map((ch) => (ch.channelId === channel.id ? {...ch, messages: [...ch.messages, context]} : ch)))
      })

      setStatus("Intent raised successfully!")
    } catch (error) {
      console.error("Failed to raise intent:", error)
      setStatus("Failed to raise intent. See console for details.")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Intent Raiser Demo</h1>
      <pre className="mb-4">{JSON.stringify(context, null, 2)}</pre>
      <button onClick={raiseIntent} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Raise Intent
      </button>
      {status && <p className="mt-4 text-slate-600">{status}</p>}

      <div className="mt-8 space-y-4">
        {channels.map((channel) => (
          <div key={channel.channelId} className="border rounded p-4">
            <h3 className="font-bold mb-2">Channel: {channel.channelId}</h3>
            <div className="space-y-2">
              {channel.messages.map((msg, index) => (
                <pre key={index} className="bg-slate-100 p-2 rounded">
                  {JSON.stringify(msg, null, 2)}
                </pre>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
