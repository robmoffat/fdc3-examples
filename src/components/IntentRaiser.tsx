import {useState} from "react"
import {Channel, getAgent, Context, IntentResolution, Instrument, AppIntent, AppMetadata} from "@finos/fdc3"

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
  const [availableIntents, setAvailableIntents] = useState<AppIntent[]>([])

  const findIntents = async () => {
    try {
      const fdc3 = await getAgent()
      const intents = await fdc3.findIntentsByContext(context)
      setAvailableIntents(intents)
      setStatus("Found available intents")
    } catch (error) {
      console.error("Failed to find intents:", error)
      setStatus("Failed to find intents. See console for details.")
    }
  }

  const raiseIntentForContext = async () => {
    try {
      const fdc3 = await getAgent()
      const resolution = await fdc3.raiseIntentForContext(context)
      handleResolution(resolution)

      setStatus("Intent raised successfully!")
    } catch (error) {
      console.error("Failed to raise intent:", error)
      setStatus("Failed to raise intent. See console for details.")
    }
  }

  const raiseSpecificIntent = async (intentName: string, app: AppMetadata) => {
    try {
      const fdc3 = await getAgent()
      const resolution = await fdc3.raiseIntent(intentName, context, app)
      handleResolution(resolution)

      setStatus(`Intent ${intentName} raised successfully for app ${app.name}!`)
    } catch (error) {
      console.error("Failed to raise intent:", error)
      setStatus("Failed to raise intent. See console for details.")
    }
  }

  const raiseGetAlerts = async () => {
    try {
      const fdc3 = await getAgent()
      const resolution = await fdc3.raiseIntent("GetAlerts", context)
      handleResolution(resolution)

      setStatus("GetAlerts intent raised successfully!")
    } catch (error) {
      console.error("Failed to raise GetAlerts intent:", error)
      setStatus("Failed to raise GetAlerts intent. See console for details.")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Intent Raiser Demo</h1>
      <pre className="mb-4">{JSON.stringify(context, null, 2)}</pre>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button onClick={raiseGetAlerts} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Raise GetAlerts Intent
          </button>
          <button onClick={raiseIntentForContext} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Raise Intent For Context
          </button>
          <button onClick={findIntents} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Find Available Intents
          </button>
        </div>

        {availableIntents.length > 0 && (
          <div className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Available Intents</h2>
            <div className="space-y-4">
              {availableIntents.map((appIntent) => (
                <div key={appIntent.intent.name} className="border rounded p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-medium text-lg">{appIntent.intent.name}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Apps:</h3>
                    {appIntent.apps.map((app) => (
                      <div key={app.appId} className="ml-4 p-2 bg-slate-50 rounded">
                        <p>
                          <span className="font-medium">Title:</span> {app.appId}
                        </p>
                        {app.instanceId ? (
                          <p>
                            <span className="font-medium">Instance ID:</span> {app.instanceId}
                          </p>
                        ) : (
                          <p>
                            <span className="font-medium">New Instance</span>
                          </p>
                        )}
                        <button
                          onClick={() => raiseSpecificIntent(appIntent.intent.name, app)}
                          className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                          Raise Intent with this App
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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

  async function handleResolution(resolution: IntentResolution) {
    const channel = (await resolution.getResult()) as Channel

    if (channel) {
      // Add new channel to state
      setChannels((prev) => [...prev, {channelId: channel.id, instrument: context, messages: []}])

      // Listen for messages on this channel
      channel.addContextListener(null, (context: Context) => {
        setChannels((prev) => prev.map((ch) => (ch.channelId === channel.id ? {...ch, messages: [...ch.messages, context]} : ch)))
      })
    }
  }
}
