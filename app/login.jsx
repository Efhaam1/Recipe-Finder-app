import React from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import the hook

const LoginScreen = () => {
  const navigation = useNavigation();  // Use the hook to get the navigation prop

  return (
    <View style={styles.container}>
      <Image 
        source={require('./../assets/images/Profile.png')}
        style={styles.logo}
      />
      <Text style={styles.welcomeText}>Welcome Back!</Text>
      <TextInput 
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />
      <Pressable style={styles.loginButton} onPress={() => navigation.navigate('index')}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </Pressable>
      <Text style={styles.footerText}>
        New here? <Text style={styles.signupText} onPress={() => navigation.navigate('register')}>Sign up now!</Text>
      </Text>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ff6347',
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  signupText: {
    color: '#ff6347',
    fontWeight: 'bold',
  },
});
