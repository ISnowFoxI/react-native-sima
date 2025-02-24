import {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Linking,
  Dimensions,
} from 'react-native';
import {startSimaAuth} from 'react-native-sima';
import base64Example from './assets/images/base64Example';

const Home = () => {
  const [pinCode, setPinCode] = useState('');
  const [clientId, setClientId] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [scheme, setScheme] = useState('');

  const handlePress = async () => {
    try {
      startSimaAuth({
        scheme: scheme,
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
          console.error('error', error);
        });
    } catch (error) {
      console.log('error', error);
    }
  };

  Linking.getInitialURL().then(url => {
    console.log({url});
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="grey"
        placeholder="user code (pin)"
        style={styles.input}
        onChangeText={text => setPinCode(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="clientId"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={text => setClientId(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="masterKey"
        style={styles.input}
        onChangeText={text => setMasterKey(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="serviceName"
        style={styles.input}
        onChangeText={text => setServiceName(text)}
      />
      <TextInput
        placeholderTextColor="grey"
        placeholder="scheme (ios only)"
        style={styles.input}
        onChangeText={text => setScheme(text)}
      />
      <View style={styles.buttonWrapper}>
        <Button
          disabled={
            pinCode.length !== 7 || !clientId || !masterKey || !serviceName
          }
          color="green"
          title="Sima"
          onPress={handlePress}
        />
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
