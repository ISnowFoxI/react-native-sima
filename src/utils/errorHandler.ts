import { Alert } from 'react-native'

function getErrorText(error: string) {
  switch (error) {
    case 'operation-canceled':
      return 'Operation has been canceled by user'
    case 'wrong-operation-type':
      return 'Empty or unknown operation type'
    case 'empty-data':
      return 'Empty signing data (document or challenge)'
    case 'empty-service':
      return 'Empty service'
    case 'empty-client-id':
      return 'Empty client id'
    case 'empty-signature':
      return 'Empty signature'
    case 'empty-user-code':
      return 'Empty user code (FIN)'
    case 'wrong-user-code':
      return 'User code (FIN) does not match'
    case 'wrong-logo-format':
      return 'Wrong logo format'
    case 'wrong-logo-size':
      return 'Logo size too big (>500KB)'
    case 'document-processing-error':
      return 'Error processing document data'
    case 'challenge-processing-error':
      return 'Error processing сhallenge data'
    case 'validate-request-error':
      return 'Error validating signing request (wrong client id or signature)'
    case 'timestamp-request-error':
      return 'Error requesting timestamp for document signing'
    case 'approve-request-error':
      return 'Error approving signing request'
    case 'sign-document-error':
      return 'Error singing document'
    case 'sign-challenge-error':
      return 'Error singing challenge'
    case 'internal-error':
      return 'Internal Sima error'
    default:
      return 'Unknow error'
  }
}

function handleError(error: string) {
  const errorText = getErrorText(error)
  setTimeout(() => {
    Alert.alert('Error', errorText)
  }, 300)
}

export { handleError }
