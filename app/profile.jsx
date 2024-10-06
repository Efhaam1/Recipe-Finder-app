import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from './../constants/Colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const [favorites, setFavorites] = useState([]); // State to hold favorite recipes
  const [userRecipes, setUserRecipes] = useState([]); // State to hold user-added recipes
  const navigation = useNavigation(); // Navigation hook for navigating between screens

  useEffect(() => {
    // Function to load favorite recipes from AsyncStorage
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    // Function to load user-added recipes from AsyncStorage
    const loadUserRecipes = async () => {
      try {
        const savedUserRecipes = await AsyncStorage.getItem('userRecipes');
        if (savedUserRecipes) {
          setUserRecipes(JSON.parse(savedUserRecipes));
        }
      } catch (error) {
        console.error('Error loading user recipes:', error);
      }
    };

    loadFavorites();
    loadUserRecipes();
  }, []); // Empty dependency array to run effect only once on mount

  // Function to handle removing a recipe from favorites
  const handleRemoveFavorite = async (id) => {
    try {
      const updatedFavorites = favorites.filter(item => item.id !== id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      Alert.alert('Removed', 'Recipe has been removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // Function to handle removing a recipe from user recipes
  const handleRemoveUserRecipe = async (id) => {
    try {
      const updatedUserRecipes = userRecipes.filter(item => item.id !== id);
      setUserRecipes(updatedUserRecipes);
      await AsyncStorage.setItem('userRecipes', JSON.stringify(updatedUserRecipes));
      Alert.alert('Removed', 'Recipe has been removed from your recipes');
    } catch (error) {
      console.error('Error removing user recipe:', error);
    }
  };

  // Render function for each favorite recipe item
  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipe}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  // Render function for each user-added recipe item
  const renderUserRecipeItem = ({ item }) => (
    <View style={styles.recipe}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveUserRecipe(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Section for favorite recipes */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorite Recipes</Text>
        </View>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.recipeListContainer}
          />
        ) : (
          <Text style={styles.noFavoritesText}>No favorite recipes saved yet.</Text>
        )}
      </View>

      {/* Section for user-added recipes */}
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Added Recipes</Text>
        </View>
        {userRecipes.length > 0 ? (
          <FlatList
            data={userRecipes}
            renderItem={renderUserRecipeItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.recipeListContainer}
          />
        ) : (
          <Text style={styles.noFavoritesText}>No recipes added yet.</Text>
        )}
      </View>

      {/* Footer with navigation icons */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  section: {
    flex: 1,
    marginBottom: 16,
  },
  header: {
    backgroundColor: colors.primary, // Header background color
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: colors.white,
    textAlign: 'center',
  },
  recipe: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontFamily: 'outfit-semibold',
    color: colors.text,
    marginVertical: 10,
  },
  removeButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'outfit-medium',
  },
  noFavoritesText: {
    fontSize: 18,
    fontFamily: 'outfit-regular',
    color: colors.text,
    textAlign: 'center',
    marginTop: 50,
  },
  recipeListContainer: {
    paddingBottom: 60,
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

export default Profile;
