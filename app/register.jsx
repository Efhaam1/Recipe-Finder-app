import React from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import the hook

const RegisterScreen = () => {
  const navigation = useNavigation();  // Use the hook to get the navigation prop

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Let's Get Started!</Text>
      
      <TextInput 
        placeholder="Name"
        style={styles.input}
      />
      <TextInput 
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput 
        placeholder="Create New Password"
        style={styles.input}
        secureTextEntry
      />
      <TextInput 
        placeholder="Confirm New Password"
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.registerButton} onPress={() => navigation.navigate('index')}>
        <Text style={styles.registerButtonText}>Create</Text>
      </Pressable>

      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.loginText} onPress={() => navigation.navigate('login')}>Log in here</Text>
      </Text>
    </View>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
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
  registerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ff6347',
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  loginText: {
    color: '#ff6347',
    fontWeight: 'bold',
  },
});
