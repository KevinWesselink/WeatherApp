import { View, Text, TouchableHighlight, TextInput, Button, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';

export default function HomeScreen() {
  const [name, setName] = useState('');

  const showAlert = () => {
    if (!name) {
      return Alert.alert('Please enter your name!');
    }
    Alert.alert(`Your name is ${name}!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World!</Text>

      <TextInput 
        style={styles.input}
        placeholder='Enter your name'
        value={name}
        onChangeText={text => setName(text)}
      />

      <TouchableHighlight
        style={styles.touchable}
        onPress={showAlert}
        underlayColor='#2e8b57'
      >
        <Text style={styles.touchableText}>Show name</Text>
      </TouchableHighlight>

      <Button title="Press here" onPress={() => Alert.alert('Button Pressed!')} />

      <Text style={styles.footer}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#2e8b57',
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 20,
    borderRadius: 5,
  },

  touchable: {
    backgroundColor: '#4682b4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },

  touchableText: {
    color: '#ffffff',
    fontSize: 16,
  },

  footer: {
    fontSize: 12,
    color: '#696969',
  },
});
