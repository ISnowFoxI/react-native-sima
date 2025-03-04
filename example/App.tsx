import {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {startSimaAuth, handleError} from 'react-native-sima';
import base64Example from './assets/images/base64Example';

const Home = () => {
  const [pinCode, setPinCode] = useState('1234567');
  const [clientId, setClientId] = useState('1');
  const [masterKey, setMasterKey] = useState('Your master key');
  const [serviceName, setServiceName] = useState('Your service name');
  const [appScheme, setAppScheme] = useState('react-native-sima');
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    try {
      setIsLoading(true);
      startSimaAuth({
        appScheme: appScheme,
        serviceName: serviceName,
        userPinCode: pinCode,
        logo: base64Example,
        clientId: parseInt(clientId),
        masterKey: masterKey,
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

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="grey"
        placeholder="user code (pin)"
        style={styles.input}
        value={pinCode}
        onChangeText={text => setPinCode(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="clientId"
        value={clientId}
        style={styles.input}
        keyboardType="numeric"
        onChangeText={text => setClientId(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="masterKey"
        style={styles.input}
        value={masterKey}
        onChangeText={text => setMasterKey(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="serviceName"
        style={styles.input}
        value={serviceName}
        onChangeText={text => setServiceName(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="scheme (ios only)"
        style={styles.input}
        value={appScheme}
        onChangeText={text => setAppScheme(text)}
      />
      <View style={styles.buttonWrapper}>
        {isLoading ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <Button
            disabled={
              pinCode.length !== 7 || !clientId || !masterKey || !serviceName
            }
            color="green"
            title="Sima"
            onPress={handlePress}
          />
        )}
      </View>
    </View>
  );
};

export default function App() {
  return <Home />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: 'white',
  },
  input: {
    width: Dimensions.get('window').width * 0.8,
    height: 40,
    backgroundColor: 'gainsboro',
    color: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  buttonWrapper: {
    width: Dimensions.get('window').width * 0.8,
  },
});
