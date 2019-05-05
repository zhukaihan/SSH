import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppNavigator from './Controller/Navigation';
import firebase from 'firebase';

var config = {
	apiKey: "AIzaSyAXbyPsfZYy9zoNaUaSGJP6Zg1T5mCE8os",
	authDomain: "project-gary.firebaseapp.com",
	databaseURL: "https://project-gary.firebaseio.com",
	projectId: "project-gary",
	storageBucket: "project-gary.appspot.com",
	messagingSenderId: "279978428336"
};
const firebaseApp = firebase.initializeApp(config);

export default class App extends React.Component {
  render() {
    return (
			<AppNavigator/>
    );
  }
}
