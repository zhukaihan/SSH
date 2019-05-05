import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import GoogleSignInButton from '../View/GoogleSignInButton';
import firebase from 'firebase';


export default class LogInPage extends React.Component{
	
	// Alert for non-UCSD domain accounts. 
	showAlert = () => {
		Alert.alert(
			'Unauthorized Account',
			'The account you attempt to login with was not an UCSD registered account',
			[{text: 'Okay'}],
			{cancelable: false},
		)
	}

	navigateToHome = () => {
		console.log("logged in firebase");
		this.props.navigation.navigate('TabNavigator');
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
				// If user is a UCSD user, also log into firebase to access data. 
        if (result.user.email.endsWith("@ucsd.edu")) {
					const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
					firebase.auth().signInAndRetrieveDataWithCredential(credential).then(() => this.navigateToHome());
        } else {
					this.showAlert();
				}
      } else {
        // log in cancelled
      }
		} catch (e) {
			// log in error
		}
  }

  componentDidMount() {
    // Set up notification for logging into firebase. 
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
			// This is perhaps useful to retain a log in across different app sessions. 
			// For example, I am logged in. I close the app. I open the app again. I expect myself to be logged in. 
			// So that I don't need to log in every time I start the app. 
			// Since iOS does shuts down app for extra memory, this could be user friendly. 
			// Firebase handles this automagically. It changes the user authorization state soon after initialization. 
			if (user) {
				console.log("state changed");
				//this.props.navigation.navigate('HomeTabNavigator');
			} else {
			}
      
    });
  }

  componentWillUnmount() {
    // Remove notification for logging into firebase. 
    this.authSubscription();
  }


  render = () => {
    
		return(
			<View style={styles.logInPage}>
				<StatusBar backgroundColor="#34a9e1"/>
				<Image source={require('../View/assets/appLogo.png')}/> 
				<GoogleSignInButton onPress={() => this.googleLogin()} />

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

