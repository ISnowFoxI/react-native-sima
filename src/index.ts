import { NitroModules } from 'react-native-nitro-modules'
import type { Sima as SimaSpec } from './specs/sima.nitro'

export const Sima =
  NitroModules.createHybridObject<SimaSpec>('Sima')