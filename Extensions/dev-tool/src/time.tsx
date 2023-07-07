import { ActionPanel, Action, Icon, List, getPreferenceValues } from '@raycast/api'
import dayjs from 'dayjs'

interface Preferences {
  defaultPrefix: string
}

interface TimeFormatItem {
  id: string
  title: string
  subtitle: string
  accessory: string
}

const preferences = getPreferenceValues<Preferences>()

enum TimeFormatDefault {
  dateTime = 'YYYY-MM-DD HH:mm',
  date = 'YYYY-MM-DD',
  fullDateTime = 'YYYY-MM-DD HH:mm:ss',
}

const timeFormatDefault: string[] = Object.values(TimeFormatDefault)
const timeFormatCustom: string[] = ['YYYYMMDDHHmm']
const allTimeFormats: string[] = [...timeFormatCustom, ...timeFormatDefault]

const today: Date = new Date()
const ITEMS: TimeFormatItem[] = allTimeFormats.map(value => {
  return {
    id: value + Date.now(),
    title: dayjs(today).format(value),
    subtitle: value,
    accessory: 'Pressing enter copies the text.',
  }
})

let outputResults: TimeFormatItem[] = ITEMS
const defaultPrefix = preferences.defaultPrefix ?? ''
if (preferences.defaultPrefix) {
  outputResults.unshift({
    id: 'custom',
    title: defaultPrefix + dayjs(today).format(allTimeFormats[0]),
    subtitle: preferences.defaultPrefix + allTimeFormats[0],
    accessory: 'Pressing enter copies the text.',
  })
}

export default function Command() {
  return (
    <List>
      {outputResults.map(item => (
        <List.Item
          key={item.id}
          icon="time.png"
          title={item.title}
          accessories={[{ icon: Icon.Switch, text: item.accessory }]}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard content={item.title} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  )
}
