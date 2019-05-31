import { AppRegistry, Platform, Picker, TextInput, Button, View, FlatList, ActivityIndicator, Text, StyleSheet, Image, Dimensions} from 'react-native';
import { ListItem, List , SearchBar, Input} from 'react-native-elements';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-navigation'
import RF from 'react-native-responsive-fontsize';
import 'firebase/firestore' //Must import if you're using firestoreee
import firebase from 'firebase';
import User from '../Model/User';
import { ScrollView } from 'react-native-gesture-handler';
import UserPreviewView from '../View/UserPreviewView';

export default class RoomateSearchPage extends React.Component{
	state = {
		foundUsers: [],
		userInput: ""
	}
	constructor(props){
		super(props);
		this.usersRef = firebase.firestore().collection("users");
	}

	searchUserWithName = (name) => {
		this.setState({
			userInput: name
		})

		let names = name.split(" ");
		var userRef = this.usersRef.where("first_name", "==", names[0])
		if (names.length > 1) {
			userRef = userRef.where("last_name", "==", names[1]);
		}

		userRef.get().then((snapshot) => { // Getting a collection. 
			var foundUsers = [];
			snapshot.forEach((user) => {
				foundUsers.push(new User(user.data(), user.id));
			})
			if (foundUsers.length > 0) {
				this.setState({
					foundUsers: foundUsers
				})
			}
			
		})
	}
	
	selectUser = (user) => {
		let callback = this.props.navigation.getParam("callback");
		if (callback) {
			callback(user);
		}
		this.props.navigation.goBack();
	}
	
	render = () => {

		var userScrollView = [];
		this.state.foundUsers.forEach((user, index) => {
			userScrollView.push((
				<View key={index} style={{
					padding: '2.5%',
					width: '100%',
					borderBottomColor: '#dddddd',
					borderBottomWidth: 1,
					flexDirection: 'row',
					justifyContent: 'space-between'
				}}>
					<UserPreviewView user={user} onPress={() => {this.selectUser(user)}}/>
				</View>
			))
		})

		return (

			<SafeAreaView style={{flex: 1}}>
				<SearchBar
					placeholder="FirstName LastName"
					lightTheme={true}
					round={true}
					onChangeText={this.searchUserWithName}
					value={this.state.userInput}
				/>
				<ScrollView>
					{userScrollView}
				</ScrollView>
      		</SafeAreaView>

		)
	}
}