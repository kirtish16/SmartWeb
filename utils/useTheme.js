import { useState, useEffect } from 'react';
import { Appearance } from 'react-native'; // For system theme detection

const useTheme = () => {
  const [colors, setColors] = useState({
    light: {
      bgColor : '#E8EAED',
      cmpColor : '#F9F5FF',
      txtColor : 'black'},
    dark: {
      bgColor : '#303030',
      cmpColor : '#121212',
      txtColor : 'white'},
  });
  const [currentTheme, setCurrentTheme] = useState(Appearance.getColorScheme()); // Or use Appearance.getColorScheme()

  useEffect(() => {
    const subscription = Appearance.addChangeListener((scheme) => {
      console.log("Scheme : " + scheme.colorScheme) ; 
      setCurrentTheme(scheme.colorScheme);
    });

    return () => subscription.remove(); // Cleanup
  }, []);

  return { colors: colors[currentTheme], currentTheme, toggleTheme: () => {} }; // Add toggle function if needed
};

export default useTheme;
