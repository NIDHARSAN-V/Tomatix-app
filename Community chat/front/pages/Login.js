import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLoginUserMutation } from '../services/appApi';
import { AppContext } from '../context/appContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const { socket } = useContext(AppContext);
  const navigation = useNavigation();

  async function handleLogin() {
    try {
      const { data } = await loginUser({ email, password });
      if (data) {
        socket.emit('new-user');
        navigation.navigate('Chat');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text style={styles.text}>We'll never share your email with anyone else.</Text>

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Login" onPress={handleLogin} />

        <View style={styles.signupContainer}>
          <Text>Don't have an Account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  form: {
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  signupLink: {
    color: 'blue',
    marginLeft: 4,
  },
});

export default Login;
