import { StyleSheet, ActivityIndicator, View } from "react-native";

const Loader = (props) => {
  return(
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color="#2FA8FD" />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;