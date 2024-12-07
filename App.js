import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import WebApp from './components/WebApp';

// Create Stack Navigator
const Stack = createStackNavigator();

// Shared header styles
const defaultHeaderOptions = {
  headerStyle: {
    backgroundColor: '#007bff', // Customize header background color
  },
  headerTintColor: '#fff', // Customize header text color
};

// Screen-specific options
const getHomeScreenOptions = () => ({
  title: 'SmartWeb', // Set a static title
  ...defaultHeaderOptions, // Use shared styles
});

const getWebAppScreenOptions = ({ route }) => ({
  title: route.params.name || 'WebApp', // Dynamic title from route params
  ...defaultHeaderOptions, // Use shared styles
});

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        {/* Home Screen */}
        <Stack.Screen 
          name="SmartWeb" 
          component={HomeScreen} 
          options={getHomeScreenOptions} 
        />

        {/* WebApp Screen */}
        <Stack.Screen 
          name="WebApp" 
          component={WebApp} 
          options={({ route }) => getWebAppScreenOptions({ route })} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}