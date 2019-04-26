import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import firebase from 'firebase';
//import { GoogleSignIn } from 'react-native-google-signin';

var config = {
  apiKey: "AIzaSyAXbyPsfZYy9zoNaUaSGJP6Zg1T5mCE8os",
  authDomain: "project-gary.firebaseapp.com",
  databaseURL: "https://project-gary.firebaseio.com",
  projectId: "project-gary",
  storageBucket: "project-gary.appspot.com",
  messagingSenderId: "279978428336"
};
firebase.initializeApp(config);

export default class App extends React.Component {
  state = {
    userEmail: null, 
    userName: null,
    isUcsd: false
  }
  
  // Log in with Google. 
  googleLogin = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        // Client IDs, needed to be created on Google Developers Console. 
        //androidClientId: "Your Client ID",
        iosClientId: "279978428336-1qa6aneofkllp8crnlh5gsn7vngo3r8q.apps.googleusercontent.com", 
        scopes: ["profile", "email"]
      })

      if (result.type === "success") {
        this.setState({
          userEmail: result.user.email, 
          userName: result.user.displayName, 
          isUcsd: result.user.email.endsWith("@ucsd.edu")
        })

        // If user is a UCSD user, also log into firebase to access data. 
        if (this.state.isUcsd) {
          const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
          firebase.auth().signInAndRetrieveDataWithCredential(credential).then(function(result){
            //console.log(result);
          });
        }
        //this.props.navigation.navigate('Where you want to go');
      } else {
        console.log("log in cancelled")
      }
      } catch (e) {
        console.log("log in error", e)
      }
  }

  componentDidMount() {
    // Set up notification for logging into firebase. 
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      /*this.setState({
        loading: false,
        user: user,
      });*/
    });
  }

  componentWillUnmount() {
    // Remove notification for logging into firebase. 
    this.authSubscription();
  }

  render() {
    let btn;
    if (this.state.userEmail) {
      btn = <Text>Logged In with {this.state.userEmail} and {this.state.isUcsd ? "is UCSD" : "not UCSD"}</Text>
    } else {
      btn = <Button title="Log In With Google" onPress={() => this.googleLogin()} />
    }
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Currently, only log in is working. If the email address is UCSD email, the user is also logged into Firebase. The login only works on iOS because I have not yet set up the cliend ID for Android. </Text>
        {btn}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
