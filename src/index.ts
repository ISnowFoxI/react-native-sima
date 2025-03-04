import { NitroModules } from 'react-native-nitro-modules'
import type { SimaData, Sima as SimaSpec } from './specs/sima.nitro'
import { Linking, Platform } from 'react-native'
import { parseUrlQueryParams } from './utils/urlUtils'
import { handleError } from './utils/errorHandler'
export const Sima = NitroModules.createHybridObject<SimaSpec>('Sima')

// Export the URL utility function
export { parseUrlQueryParams } from './utils/urlUtils'

function starSimaAuthAndroid(data: SimaData): Promise<string> {
  return Sima.startSimaAuth(data)
}

async function starSimaAuthIOS(data: SimaData): Promise<string> {
  await Sima.startSimaAuth(data)
  const pendingPromise = new Promise<string>((resolve, reject) => {
    const subscription = Linking.addEventListener('url', (event) => {
      const url = event.url
      const params = parseUrlQueryParams(url)
      const status = params.status
      if (status !== 'success') {
        reject(new Error(params.message))
      } else {
        resolve(JSON.stringify(params))
      }

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

export { handleError }
