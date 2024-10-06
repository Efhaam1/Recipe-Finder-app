import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, FlatList, TextInput, Modal, ActivityIndicator, ScrollView, Alert } from 'react-native';
import colors from './../constants/Colors';
import { useFonts } from 'expo-font';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
    // Hook for navigation

  const navigation = useNavigation();
  // Hook to load custom fonts

  const [fontsLoaded] = useFonts({
    'outfit-regular': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
    'outfit-semibold': require('./../assets/fonts/Outfit-SemiBold.ttf'),
    'outfit-extrabold': require('./../assets/fonts/Outfit-ExtraBold.ttf'),
    'outfit-thin': require('./../assets/fonts/Outfit-Thin.ttf'),
    'outfit-light': require('./../assets/fonts/Outfit-Light.ttf'),
  });
  // State variables

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [newRecipes, setNewRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showNewRecipes, setShowNewRecipes] = useState(true);
  // Categories data

  const categories = [
    { id: 1, name: 'Soup', icon: require('./../assets/images/hot-soup.png') },
    { id: 2, name: 'Salad', icon: require('./../assets/images/salad.png') },
    { id: 3, name: 'Pasta', icon: require('./../assets/images/pasta.png') },
    { id: 4, name: 'Bread', icon: require('./../assets/images/bread.png') },
    { id: 5, name: 'Seafood', icon: require('./../assets/images/sea-food.png') },
    { id: 6, name: 'Dessert', icon: require('./../assets/images/dessert.png') },
    { id: 7, name: 'Vegetarian', icon: require('./../assets/images/vegetarian.png') },
  ];
  // API constants

  const API_KEY = '3176241b5f0a40fd8fbe49ad805ed741';
  const BASE_URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;
  const RECIPE_DETAILS_URL = `https://api.spoonacular.com/recipes/informationBulk?apiKey=${API_KEY}`;
  // Fetch recipes based on search query

  const fetchRecipes = async (query) => {
    console.log('Fetching recipes for:', query);
    setLoading(true);
    setError(null);
    setShowNewRecipes(false);
    try {
      const response = await fetch(`${BASE_URL}&query=${query}&number=10`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error(`API response not ok: ${errorData.message}`);
      }
      const data = await response.json();
      setRecipes(data.results);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch recipes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Fetch new recipes for the 'New Recipes' section

  const fetchNewRecipes = async () => {
    console.log('Fetching new recipes');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}&number=8`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error(`API response not ok: ${errorData.message}`);
      }
      const data = await response.json();
      setNewRecipes(data.results);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch new recipes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Fetch details for a specific recipe

  const fetchRecipeDetails = async (recipeId) => {
    console.log('Fetching recipe details for ID:', recipeId);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${RECIPE_DETAILS_URL}&ids=${recipeId}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error(`API response not ok: ${errorData.message}`);
      }
      const data = await response.json();
      setSelectedRecipe(data[0]);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to fetch recipe details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Fetch new recipes on component mount

  useEffect(() => {
    fetchNewRecipes();
  }, []);

    // Fetch recipes when search text changes

  useEffect(() => {
    if (searchText.length > 2) {
      fetchRecipes(searchText);
    } else {
      setRecipes([]);
      setShowNewRecipes(true);
    }
  }, [searchText]);
  // Handle category selection

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    setSearchText(category.name);
    setShowNewRecipes(false);
  };
  // Handle search input changes

  const handleSearch = (text) => {
    setSearchText(text);
  };
  // Handle recipe selection and show modal

  const handleRecipeSelect = async (recipe) => {
    await fetchRecipeDetails(recipe.id);
    setModalVisible(true);
  };
  // Add recipe to favorites

  const handleAddToFavorites = async () => {
    try {
      const currentFavorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = currentFavorites ? JSON.parse(currentFavorites) : [];
      
      // Check if the recipe is already in favorites
      if (favoritesArray.some(fav => fav.id === selectedRecipe.id)) {
        Alert.alert('Already Added', 'This recipe is already in your favorites.');
        return;
      }
      
      favoritesArray.push(selectedRecipe);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      Alert.alert('Added to Favorites', 'Recipe has been added to your favorites');
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  // Function to remove HTML tags like <li> from instructions
  const cleanInstructions = (text) => {
    return text?.replace(/<\/?[^>]+(>|$)/g, "") || 'No instructions available';
  };
  // Render category item

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategorySelect(item)}>
      <Image source={item.icon} style={styles.categoryIcon} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );
  // Render recipe item

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity style={styles.recipe} onPress={() => handleRecipeSelect(item)}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
    // If fonts are not loaded, show a loading indicator


  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color={colors.accent} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipe Finder</Text>
      </View>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.recipeRow}
        ListHeaderComponent={
          <View>
            <View style={styles.searchContainer}>
  <Image source={require('./../assets/images/search.png')} style={styles.searchIcon} />
  <TextInput
    style={styles.searchText}
    placeholder="Search Pasta, Bread, etc."
    placeholderTextColor={colors.black}  // Placeholder color in black
    value={searchText}
    onChangeText={handleSearch}
    onFocus={() => setShowNewRecipes(false)}
  />
</View>

            <Text style={styles.categoryTitle}>Categories</Text>

            <View style={styles.categorySliderContainer}>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
            {showNewRecipes && (
              <>
                <Text style={styles.categoryTitle}>New Recipes</Text>
                <FlatList
                  data={newRecipes}
                  renderItem={renderRecipeItem}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={styles.recipeRow}
                  contentContainerStyle={styles.recipeListContainer}
                />
              </>
            )}
            {selectedCategory && !showNewRecipes && (
              <Text style={styles.categoryTitle}>{`${selectedCategory} Recipes`}</Text>
            )}
          </View>
        }
        contentContainerStyle={styles.recipeListContainer}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color={colors.accent} /> : null
        }
      />
      {selectedRecipe && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedRecipe.title}</Text>
              <Text style={styles.modalSubtitle}>Ingredients:</Text>
              <Text style={styles.modalText}>
                {selectedRecipe.extendedIngredients?.map(ingredient => ingredient.original).join(', ') || 'No ingredients available'}
              </Text>
              <Text style={styles.modalSubtitle}>Instructions:</Text>
              <Text style={styles.modalText}>{cleanInstructions(selectedRecipe.instructions)}</Text>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddToFavorites}
              >
                <Text style={styles.saveButtonText}>♡ Add to Favorites</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
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
// Styles for the component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: colors.white,
    fontFamily: 'outfit-bold',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row', // Align the search icon and text input horizontally
    alignItems: 'center', // Center the icon and text input vertically
  },
  searchIcon: {
    width: 20,   // Width of the search icon
    height: 20,  // Height of the search icon
    marginRight: 10, // Space between the icon and the text input
  },
  searchText: {
    flex: 1, // Allow the text input to take up the remaining space
    fontSize: 16,
    color: colors.black, // Text color in black
    fontFamily: 'outfit-regular',
  },
  categorySliderContainer: {
    paddingLeft :10,
    backgroundColor: colors.primary,
    paddingVertical: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'outfit-semibold',
    color: colors.text,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  categoryItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'outfit-regular',
  },
  recipe: {
    flex: 1,
    margin: 10,
    backgroundColor: colors.primary,
    borderRadius: 10,
    overflow: 'hidden',
  },
  recipeRow: {
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  recipeImage: {
    width: '100%',
    height: 150,
  },
  recipeTitle: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    color: colors.text,
    padding: 10,
  },
  recipeListContainer: {
    paddingBottom: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%', // Ensure the modal content doesn't overflow the screen
    padding: 20,
    backgroundColor: colors.background,

  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    color: colors.text,
    marginVertical: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontFamily: 'outfit-semibold',
    color: colors.text,
    marginTop: 10,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
    color: colors.text,
    marginVertical: 10,
    
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 35,
    fontFamily: 'outfit-bold',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
    marginBottom:50,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'outfit-semibold',
    color: colors.white,
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
  noRecipesText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 18,
    fontFamily: 'outfit-regular',
    marginTop: 20,
  },
});

export default App;
