import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import GoogleSignInButton from '../View/GoogleSignInButton';
import firebase from 'firebase';
import AppNavigator from './Navigation';


var config = {
  apiKey: "AIzaSyAXbyPsfZYy9zoNaUaSGJP6Zg1T5mCE8os",
  authDomain: "project-gary.firebaseapp.com",
  databaseURL: "https://project-gary.firebaseio.com",
  projectId: "project-gary",
  storageBucket: "project-gary.appspot.com",
  messagingSenderId: "279978428336"
};
firebase.initializeApp(config);


export default class LogInPage extends React.Component{


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
        androidClientId: "279978428336-vbepuj1iut56diuphfm1jm04chbo7o23.apps.googleusercontent.com",
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
    const { navigate } = this.props.navigation;
    const showAlert = () => {
      Alert.alert(
        'Unauthorized Account',
        'The account you attempt to login with was not an UCSD registered account',
        [
          {text: 'Okay', onPress: ()=> console.log('OK Pressed')}
        ],
          {cancelable: false},
      )
    }
		let btn;
	    if (this.state.userEmail) {
        {this.state.isUcsd? navigate('ProfilePage') : showAlert() }
        btn = <GoogleSignInButton onPress={() => this.googleLogin()} /> 
	    } else {
	      btn = <GoogleSignInButton onPress={() => this.googleLogin()} />
	    }
		return(
			<View style={styles.logInPage}>
				<StatusBar backgroundColor="#34a9e1"/>
				<Image source={require('../View/assets/appLogo.png')}/> 
				{btn}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	logInPage: {
		flex:1,
		backgroundColor: '#34a9e1',
		alignItems: 'center',
		justifyContent: 'center',
	
	}
});

