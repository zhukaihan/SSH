import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './Controller/Navigation';
import firebase from 'firebase';

var firebaseConfig = {
	apiKey: "AIzaSyAJMmoUDolfe4zKdXkQblpGI75g6YaQt8g",
	authDomain: "gary-ssh.firebaseapp.com",
	databaseURL: "https://gary-ssh.firebaseio.com",
	projectId: "gary-ssh",
	storageBucket: "gary-ssh.appspot.com",
	messagingSenderId: "1005506003002",
	appId: "1:1005506003002:web:6a5023cf4eb0ec32"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default class App extends React.Component {
  render() {
    return (
			<AppNavigator/>
    );
  }
}
