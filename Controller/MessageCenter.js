
import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight,TouchableOpacity,TextInput } from 'react-native';
import { Icon, Card, Badge, SearchBar,Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import { MessageRoom } from '../Model/Messaging';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import { ScrollView } from 'react-native-gesture-handler';


export default class MessageCenter extends React.Component{

	state = {
		roomsItems: [],
	}

	constructor() {
		super();

		this.roomsRef = firebase.firestore().collection("messages").doc(firebase.auth().currentUser.uid).collection("rooms").orderBy("last_contact_date", "desc");
	}

	openRoom = (room) => {
		this.props.navigation.push("MessageRoomView", {
			roomId: room.id,
		});
	}

	componentDidMount = async () => {
		this.observer = this.roomsRef.onSnapshot(roomsSnapshot => {
			let roomsItems = [];
			roomsSnapshot.forEach(room => {
				var aRooms = new MessageRoom(room.data(), room.id, () => {
					this.forceUpdate();
				});
				roomsItems.push(aRooms);
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

	render = () => {

		var content = []
		if (!this.state.roomsItems || this.state.roomsItems.length == 0) {
			content = (
				<Text>You have no messages. Choose a user to start. </Text>
			)
		} else {
			this.state.roomsItems.forEach((item, index) => {
				if (!item.recipient) {
					content.push((<Text key={index}>Loading...</Text>))
				} else {
					content.push((
						<TouchableOpacity key={index} onPress={() => {this.openRoom(item)}}>
							<Text>{item.recipient.first_name} {item.recipient.last_name}</Text>
						</TouchableOpacity>
					))
				}
			})
		}
		

		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#2EA9DF'}}>
				<View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
					<ScrollView>
						{content}
					</ScrollView>
				</View>
			</SafeAreaView>
		);
	}

}
