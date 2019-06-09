
import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Icon, Card, Badge, SearchBar,Overlay, Image, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import { MessageRoom } from '../Model/Messaging';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import UserPreviewView from '../View/UserPreviewView';
import Swipeout from 'react-native-swipeout';


export default class MessageCenter extends React.Component{
	static navigationOptions = ({ navigation }) => ({
    headerTitle: 
			<Text style={{
				color: 'white', fontSize: RF(3)
			}}>
				Messages
			</Text>,
		headerStyle: {
      backgroundColor: '#2EA9DF',
    },
	});

	static createRoomWith = (navigation, user) => {
		navigation.navigate("MessageRoomView", {
			roomId: user.id,
			recipient: user
		});
	}

	state = {
		roomsItems: [],
	}
	recipientUsersItems = {};

	constructor() {
		super();

		this.roomsRef = firebase.firestore().collection("messages").doc(firebase.auth().currentUser.uid).collection("rooms").orderBy("last_contact_date", "desc");
	}

	openRoom = (recipient) => {
		this.props.navigation.navigate("MessageRoomView", {
			roomId: recipient.id,
			recipient: recipient
		});
	}

	componentDidMount = async () => {
		this.observer = this.roomsRef.onSnapshot(roomsSnapshot => {
			let roomsItems = [];
			roomsSnapshot.forEach(room => {
				var aRoom = new MessageRoom(room.data(), room.id);
				if (!this.recipientUsersItems[room.id]) {
					User.getUserWithUID(room.id, (user) => {
						this.recipientUsersItems[user.id] = user
						this.forceUpdate();
					})
				}
				roomsItems.push(aRoom);
			});
			this.setState({
				roomsItems: roomsItems
			});
		}, err => {
			console.log(`Encountered error: ${err}`);
		});
	}

	componentWillUnmount = async () => {
		this.observer();
	}

	removeRecipient= (user) => {
		firebase.firestore().collection("messages").doc(firebase.auth().currentUser.uid).collection("rooms").doc(user.id).delete().then(() => {
			var filtered_cur_items = this.state.roomsItems.filter((value) => {
				return !(value === user);
			});
			this.setState({
				roomsItems: filtered_cur_items
			})
		}).catch((error) => {
			Alert.alert(
				'Delete Failed',
				'Please try again later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		});
	}

	render = () => {
		

		var content = []
		if (!this.state.roomsItems || this.state.roomsItems.length == 0) {
			content = (
				<Text style={{
					color: '#dddddd',
					fontSize: RF(6)
				}}>You have no messages. Choose a user to start. </Text>
			)
		} else {
			this.state.roomsItems.forEach((item, index) => {
				itemRecipient = this.recipientUsersItems[item.id]
				let swipeBtns = [{
					text: 'Delete',
					backgroundColor: 'red',
					underlayColor: 'rgba(0, 0, 0, 0.6)',
					onPress: () => {this.removeRecipient(item)}
				}];
				content.push((
					<Swipeout key={index} right={swipeBtns}
        autoClose = {true}
        backgroundColor= 'transparent'>
					<View style={{
						padding: '2.5%',
						width: '95%',
						borderBottomColor: '#dddddd',
						borderBottomWidth: 1,
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}>
						<View style={{
								width: '90%',
							}}>
							<UserPreviewView user={itemRecipient} onPress={this.openRoom} hasAlertDot={item.last_contact_date > item.last_read_time}/>
						</View>
						<View style={{
							flexDirection: 'row',
							width: '10%',
							height: 75,
							margin: 5,
							alignItems: 'center'
						}}>
							<Icon name="chevron-right" type="font-awesome"/>
						</View>
					</View>
					</Swipeout>
				))
			})
		}
		

		return (
			<View style={{flex: 1}}>
				<View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
					<ScrollView style={{flex: 1}}>
						{content}
					</ScrollView>
				</View>
			</View>
		);
	}

}

const styles = StyleSheet.create({

})
