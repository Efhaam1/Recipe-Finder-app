import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './index';  // Import the main App component (home screen)
import Profile from './profile';  // Import the Profile screen component
import AddRecipe from './addrecipe';  // Import the AddRecipe screen component

// Create bottom tab navigator
const Tab = createBottomTabNavigator();
// Create native stack navigator (currently not used in this example)
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* Define the bottom tab navigation */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,  // Hide the header on all screens
          tabBarStyle: { backgroundColor: '#fff' },  // Set tab bar background color to white
        }}
      >
        {/* Define each tab screen */}
        <Tab.Screen 
          name="Home" 
          component={App}  // Home screen component
        />
        <Tab.Screen 
          name="AddRecipe" 
          component={AddRecipe}  // AddRecipe screen component
        />
        <Tab.Screen 
          name="Profile" 
          component={Profile}  // Profile screen component
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
