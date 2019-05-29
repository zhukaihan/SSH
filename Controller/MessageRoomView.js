import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Icon, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';
import HouseFavButton from '../View/HouseFavButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-gesture-handler';
import { Message, MessageRoom } from '../Model/Messaging';


export default class MessageRoomView extends React.Component{
	state = {
		room: new MessageRoom()
	}

	constructor() {
		super();
	}

	componentDidMount = async () => {
		let roomId = this.props.navigation.getParam("roomId", "");
		if (roomId == "") {
			return
		}
		this.roomRef = firebase.firestore().collection("messages").doc(firebase.auth().currentUser.uid).collection("rooms").doc(roomId);
		this.oppositeSideRoomRef = firebase.firestore().collection("messages").doc(roomId).collection("rooms").doc(firebase.auth().currentUser.uid);
		this.observer = this.roomRef.onSnapshot(roomSnapshot => {
			var room = new MessageRoom(roomSnapshot.data(), roomSnapshot.id);
			this.setState({
				room: room
			});
		}, err => {
			console.log(`Encountered error: ${err}`);
		});

	}

	componentWillUnmount = async () => {
		this.observer();
	}

	sendMessage = (txt) => {
		this.roomRef.update({
			messages: firebase.firestore.FieldValue.arrayUnion({
				timestamp: firebase.firestore.Timestamp.now(),
				message: txt,
				isRead: true,
				isSentByUser: true
			}),
			last_contact_date: firebase.firestore.Timestamp.now()
		})
		this.oppositeSideRoomRef.update({
			messages: firebase.firestore.FieldValue.arrayUnion({
				timestamp: firebase.firestore.Timestamp.now(),
				message: txt,
				isRead: false,
				isSentByUser: false
			}),
			last_contact_date: firebase.firestore.Timestamp.now()
		})
	}

	render = () => {
		var content;
		
		if (this.state.room) {
			let item = this.state.room;

			var messages = [];
			this.state.messages.forEach((msg, index) => {
				messages.push((
					<View
						key={index}
					>
						<Text>{msg.timestamp} {msg.isSentByUser ? "me: " : "they: "} {msg.message}</Text>
					</View>
				));
				msg.isRead = true;
			});
			

			content = (
				<View style={{flex: 1}}>
						{messages}
				</View>
			);
		}
		// this.updateReadMessage();

		return (
			<SafeAreaView style={{flex: 1}} forceInset={{top: 'never'}}>
				<KeyboardAwareScrollView>
					<ScrollView style={{flex: 1}}>
						{content}
					</ScrollView>
					<TextInput onSubmitEditing={({event}) => {
						this.sendMessage(event.text)
					}}/>
				</KeyboardAwareScrollView>
      </SafeAreaView>
		);
	}

}
const styles = StyleSheet.create({
	roomTitleView: {
		margin: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	roomTitleText: {
		fontSize: RF(2.5), 
		fontWeight: 'bold'
	},
	roomInfoView: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	roomInfoLeftView: {
		flex: 2
	},
	roomInfoRightView: {
		flex: 1
	},
	roomInfoRightImage: {
		flex: 9,
		margin: 5
	},
	roomInfoRightNameText: {
		flex: 1,
		margin: 5
	},
	roomInfoLeftSpecsView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 5,
		marginBottom: 5
	},
	roomInfoLeftSpecDetailsView: {
		width: '45%',
		marginLeft: '2.5%',
		marginRight: '2.5%',
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
})