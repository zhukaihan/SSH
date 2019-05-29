
import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight,TouchableOpacity,TextInput } from 'react-native';
import { Icon, Card, Badge, SearchBar,Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import { MessageRoom } from '../Model/Messaging';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";


export default class MessageCenter extends React.Component{

	static createRoomWith = (userId) => {
		console.log("createRoomWith Called");
		firebase.firestore().collection("messages").doc(firebase.auth().currentUser.uid).collection("rooms").doc(userId).set({
			last_contact_date: firebase.firestore.Timestamp.now(),
			messages: []
		});
	}

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
				var aRooms = new MessageRoom(room.data(), room.id);
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

		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#2EA9DF'}}>
				<View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
					<FlatList
						keyExtractor={(item, index) => index.toString()}
						data={this.state.roomsItems}
						renderItem={({item}) => (
								<TouchableOpacity onPress={() => {this.openRoom(item)}}>
									<Text>User ID: {item.id}</Text>
								</TouchableOpacity>
						)}
					/>
				</View>
			</SafeAreaView>
		);
	}

}
