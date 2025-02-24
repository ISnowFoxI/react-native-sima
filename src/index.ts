import { NitroModules } from 'react-native-nitro-modules'
import type { SimaData, Sima as SimaSpec } from './specs/sima.nitro'
import { Linking, Platform } from 'react-native'

export const Sima = NitroModules.createHybridObject<SimaSpec>('Sima')

function starSimaAuthAndroid(data: SimaData): Promise<string> {
  return Sima.startSimaAuth(data)
}

async function starSimaAuthIOS(data: SimaData): Promise<string> {
  await Sima.startSimaAuth(data)
  const pendingPromise = new Promise<string>((resolve) => {
    const subscription = Linking.addEventListener('url', (event) => {
      resolve(event.url)
      subscription.remove()
    })
  })

  return pendingPromise
}

export function startSimaAuth(data: SimaData): Promise<string> {
  if (Platform.OS === 'android') {
    return starSimaAuthAndroid(data)
  } else {
    return starSimaAuthIOS(data)
  }
}
