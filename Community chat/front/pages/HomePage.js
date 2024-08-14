import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

function HomePage() {
  const [auth, setAuth] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [success, setSuccess] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5432/");
        console.log(res.data.success);

        if (res.data.success) {
          setAuth(true);
          setUserId(res);
          navigation.navigate("Home");
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [navigation]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      colors={auth ? ['#1a2a6c', '#b21f1f', '#fdbb2d'] : ['#0f2027', '#203a43', '#2c5364']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {auth ? (
          <View style={styles.homeContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome to Community Chat</Text>
              <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Chat')}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.main}>
              <Text style={styles.mainText}>We are glad to have you here. Explore our services and offerings.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.notAuthorizedContainer}>
            <Text style={styles.notAuthorizedText}>You Are Not Authorized to the Home Page</Text>
            <Text style={styles.noWayHome}>NO WAY HOME</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  getStartedButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
  },
  main: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  notAuthorizedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  notAuthorizedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  noWayHome: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomePage;
