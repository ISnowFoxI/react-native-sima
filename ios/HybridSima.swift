import Foundation
import NitroModules
import CryptoKit
import CommonCrypto

class HybridSima: HybridSimaSpec {

    var SIMA_SCHEME = "sima"
    var SIMA_URL = "https://apps.apple.com/us/app/si-ma-beta/id1602500636"
    var SIGN_CHALLENGE_OPERATION = "sign-challenge"

    var EXTRA_RETURN_SCHEME_FIELD = "scheme"
    var EXTRA_CHALLENGE_FIELD = "challenge"
    var EXTRA_SIGNATURE_FIELD = "signature"
    var EXTRA_SERVICE_FIELD = "service-name"
    var EXTRA_LOGO_FIELD = "service-logo"
    var EXTRA_USER_CODE_FIELD = "user-code"
    var EXTRA_CLIENT_ID_FIELD = "client-id"
    var EXTRA_REQUEST_ID_FIELD = "request-id"
        
    var EXTRA_RETURN_SCHEME_VALUE = ""
    var EXTRA_CLIENT_ID_VALUE: Double = 1
    var EXTRA_SERVICE_VALUE = ""
    var EXTRA_USER_CODE_VALUE = ""
    var CLIENT_MASTER_KEY = ""
    var EXTRA_LOGO_VALUE = "";
 
    func startSimaAuth(data: SimaData) throws -> NitroModules.Promise<String> {
        print("here I am")
        let pendingPromise = NitroModules.Promise<String>()
      
        EXTRA_RETURN_SCHEME_VALUE = data.scheme
        EXTRA_CLIENT_ID_VALUE = data.clientId
        EXTRA_SERVICE_VALUE = data.serviceName
        EXTRA_USER_CODE_VALUE = data.userPinCode
        EXTRA_LOGO_VALUE = data.logo;
        CLIENT_MASTER_KEY = data.masterKey
      
      
        let randomBytes = Data(count: 64)
      let challenge = Data(randomBytes)
      let hash = Data(SHA256.hash(data: challenge))
      let key = SymmetricKey(data: CLIENT_MASTER_KEY.data(using: .utf8)!)
      let signature = HMAC<SHA256>.authenticationCode(for: hash, using: key)
      let requestId = UUID().uuidString
      var components = URLComponents()
        
      components.scheme = SIMA_SCHEME
      components.host = SIGN_CHALLENGE_OPERATION
      components.path = ""
      components.queryItems = [
          URLQueryItem(name: EXTRA_RETURN_SCHEME_FIELD, value: EXTRA_RETURN_SCHEME_VALUE),
          URLQueryItem(name: EXTRA_CHALLENGE_FIELD, value: challenge.base64EncodedString()),
          URLQueryItem(name: EXTRA_SERVICE_FIELD, value: EXTRA_SERVICE_VALUE),
          URLQueryItem(name: EXTRA_CLIENT_ID_FIELD, value: String(EXTRA_CLIENT_ID_VALUE)),
          URLQueryItem(name: EXTRA_SIGNATURE_FIELD, value: Data(signature).base64EncodedString()),
          URLQueryItem(name: EXTRA_LOGO_FIELD, value: EXTRA_LOGO_VALUE),
          URLQueryItem(name: EXTRA_REQUEST_ID_FIELD, value: requestId),
          URLQueryItem(name: EXTRA_USER_CODE_FIELD, value: EXTRA_USER_CODE_VALUE)]
      
    
        
        
        
        guard let url = components.url else {
            pendingPromise.reject(withError: "Invalid url to open sima" as! Error)
            return pendingPromise
        }
        
        
        if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        } else {
            UIApplication.shared.open(URL(string: SIMA_URL)!)
        }
            
        pendingPromise.resolve(withResult: components.url?.absoluteString ?? "")
        return pendingPromise
    }
}
