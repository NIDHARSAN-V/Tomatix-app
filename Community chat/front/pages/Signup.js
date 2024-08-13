import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // For selecting images
import axios from 'axios';
import { useSignupUserMutation } from '../services/appApi';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [signupUser] = useSignupUserMutation();
  const navigation = useNavigation();

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets[0].fileSize > 1048576) {
        Alert.alert('Max File Size Exceeded', 'Max file size is 1MB');
        return;
      }
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Image Required', 'Please upload your profile image');
      return;
    }
    const imageUrl = await uploadImage(image);
    signupUser({ name, email, password, picture: imageUrl }).then(({ data }) => {
      if (data) {
        navigation.navigate('Login');
      }
    });
  };

  const uploadImage = async (uri) => {
    const data = new FormData();
    data.append('file', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });
    data.append('upload_preset', 'ppjnbsqt');
    try {
      setUploading(true);
      const res = await axios.post('https://api.cloudinary.com/v1_1/dvdbbzqys/image/upload', data);
      setUploading(false);
      return res.data.secure_url;
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
        <Image source={image ? { uri: image } : require('./favicon.png')} style={styles.profileImage} />
        <Text style={styles.imageText}>Upload Image</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={uploading ? "Signing you Up..." : "Signup"} onPress={handleSubmit} />
      <View style={styles.footer}>
        <Text>Already have an Account</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}> Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    marginTop: 10,
    color: 'blue',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: 'blue',
    marginLeft: 4,
  },
});

export default Signup;
