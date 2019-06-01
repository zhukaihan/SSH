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
		allUser:[],
		foundUsers: [],
		userInput: ""
	}
	constructor(props){
		super(props);
		this.userRef = firebase.firestore().collection("users");
		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
		});
	}

	componentDidMount(){
		let roommates = [];
		this.userRef.get().then((snapshot)=>{
			snapshot.forEach((user)=>{
				if(user.id != this.state.curUser.id){
				roommates.push(new User(user.data(),user.id));
				}
			})
		})
		this.setState({allUser:roommates})
	}

	searchUserWithName = userInput => {
		this.setState({
			userInput
		})
        const newData = this.state.allUser.filter(item =>{
            const ItemData = `${item.first_name.toUpperCase()}
            ${item.last_name.toUpperCase()}
            ${item.name_preferred.toUpperCase()}`;
            const textData = userInput.toUpperCase();
            return ItemData.indexOf(textData) > -1;
        })
        this.setState({foundUsers: newData})

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