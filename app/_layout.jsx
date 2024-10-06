// In _layout.jsx
const RootLayout = ({ navigation }) => { 
  return (
    <View style={styles.container}>
      <Text>Welcome to the App!</Text>
      <Button
        title="Go to Index"
        onPress={() => navigation.navigate('Index')} 
      />
    </View>
  );
};