import { type HybridObject } from 'react-native-nitro-modules'

export interface SimaData {
  /**
   * The name of the service to be used in the sign in challenge.
   */
  serviceName: string
  /**
   * The scheme to be used in the sign in challenge.
   * @platform ios
   */
  appScheme: string
  /**
   * The pin code of the user to be used in the sign in challenge.
   */
  userPinCode: string
  /**
   * The logo to be used in the sign in challenge.
   * @type base64 string
   */
  logo: string
  /**
   * The client id to be used in the sign in challenge.
   */
  clientId: number
  /**
   * The master key to be used in the sign in challenge.
   */
  masterKey: string
}

export interface Sima
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  startSimaAuth(data: SimaData): Promise<string>
}
