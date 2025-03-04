# react-native-sima

## Requirements

- React Native v0.76.0 or higher
- Node 18.0.0 or higher

## Installation

```bash
yarn add react-native-sima react-native-nitro-modules
```

#### About Nitro modules

This library uses nitro modules to support native features. Without it the library will not work
Make sure to checkout nitro modules [docs](https://nitro.margelo.com/docs/what-is-nitro) for more info

## Example

```
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
