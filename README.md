# react-native-sima

## Requirements

- React Native v0.76.0 or higher
- Node 18.0.0 or higher

## Installation

```bash
yarn add react-native-sima react-native-nitro-modules
```

### Ios

On ios you will need to enable deeplinks to receive the response via app schema. See [React Native Docs](https://reactnative.dev/docs/linking#enabling-deep-links) for more info.

#### About Nitro modules

This library uses nitro modules to support native features. Without it the library will not work
Make sure to checkout nitro modules [docs](https://nitro.margelo.com/docs/what-is-nitro) for more info

## Example

```
...

import {startSimaAuth, handleError} from 'react-native-sima';

...

  const [pinCode, setPinCode] = useState('1234567');
  const [clientId, setClientId] = useState('1');
  const [masterKey, setMasterKey] = useState('Your master key');
  const [serviceName, setServiceName] = useState('Your service name');
  const [appScheme, setAppScheme] = useState('react-native-sima');
  const [isLoading, setIsLoading] = useState(false);

...

const handlePress = async () => {
    try {
      setIsLoading(true);
      startSimaAuth({
        appScheme: appScheme, // your app scheme (ios only)
        serviceName: serviceName, // your service name
        userPinCode: pinCode, // user pin code
        logo: base64Example, // image must be in base64 format
        clientId: parseInt(clientId), // your client id
        masterKey: masterKey, // your master key
      })
        .then(res => {
          console.log('res', JSON.parse(res));
        })
        .catch(error => {
          handleError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.log('error', error);
    }
  };
```

## Credits

Bootstrapped with [create-nitro-module](https://github.com/patrickkabwe/create-nitro-module).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
