import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from './../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';

const AddRecipe = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();

  const handleAddRecipe = async () => {
    if (!title || !ingredients || !instructions) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newRecipe = {
      id: Date.now().toString(),
      title,
      ingredients,
      instructions,
      image: imageUri || 'https://via.placeholder.com/150',
    };

    try {
      const existingRecipes = await AsyncStorage.getItem('userRecipes');
      const recipesArray = existingRecipes ? JSON.parse(existingRecipes) : [];
      recipesArray.push(newRecipe);
      await AsyncStorage.setItem('userRecipes', JSON.stringify(recipesArray));
      Alert.alert('Success', 'Recipe added successfully');
      navigation.navigate('profile');
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'There was an issue saving your recipe');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add a New Recipe</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipe Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ingredients</Text>
          <TextInput
            style={styles.input}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cooking Instructions</Text>
          <TextInput
            style={styles.input}
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        </TouchableOpacity>

        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <AntDesign name="closecircle" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe}>
          <Text style={styles.addButtonText}>Add Recipe</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('index')}>
            <FontAwesome5 name="home" size={24} color={colors.iconColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('addrecipe')}>
            <Ionicons name="add-circle" size={24} color={colors.iconColor} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon} onPress={() => navigation.navigate('profile')}>
            <Ionicons name="person" size={24} color={colors.iconColor} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    backgroundColor: colors.primary, // Added background color to header
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: colors.white,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginTop:20,
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: colors.text,
    marginBottom: 5,
    marginLeft: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 10,
    fontFamily: 'outfit-regular',
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: colors.white,
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 5,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontFamily: 'outfit-bold',
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  footerIcon: {
    alignItems: 'center',
  },
});

export default AddRecipe;
