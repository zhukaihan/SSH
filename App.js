import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import AppNavigator from './Controller/Navigation';
import firebase from 'firebase';

// Main Database. 
//  var firebaseConfig = {
//  	apiKey: "AIzaSyAJMmoUDolfe4zKdXkQblpGI75g6YaQt8g",
//  	authDomain: "gary-ssh.firebaseapp.com",
//  	databaseURL: "https://gary-ssh.firebaseio.com",
//  	projectId: "gary-ssh",
// 	storageBucket: "gary-ssh.appspot.com",
//  	messagingSenderId: "1005506003002",
// 	appId: "1:1005506003002:web:6a5023cf4eb0ec32"
//  };
// // // Initialize Firebase
//  firebase.initializeApp(firebaseConfig);

// Backup Database. 
var firebaseConfig = {
	apiKey: "AIzaSyBhFXFnGYQFC0srAKt8v_RTtplQZWmUXC8",
	authDomain: "gary-ssh-2.firebaseapp.com",
	databaseURL: "https://gary-ssh-2.firebaseio.com",
	projectId: "gary-ssh-2",
	storageBucket: "gary-ssh-2.appspot.com",
	messagingSenderId: "356347240170",
	appId: "1:356347240170:web:65c2050fc61b708e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  render() {
    return (
			<View style={{flex: 1}}>
				<StatusBar barStyle="light-content" />
				<AppNavigator/>
			</View>
    );
  }
}
