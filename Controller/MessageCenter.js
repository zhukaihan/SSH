
import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Icon, Card, Badge, SearchBar,Overlay, Image, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import { MessageRoom } from '../Model/Messaging';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";


export default class MessageCenter extends React.Component{

	state = {
		roomsItems: [],
	}
	recipientUsersItems = {};

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

	render = () => {

		var content = []
		if (!this.state.roomsItems || this.state.roomsItems.length == 0) {
			content = (
				<Text>You have no messages. Choose a user to start. </Text>
			)
		} else {
			this.state.roomsItems.forEach((item, index) => {
				itemRecipient = this.recipientUsersItems[item.id]
				content.push((
					<TouchableOpacity key ={index} onPress={() => {this.openRoom(item)}} style={{
						padding: '2.5%',
						width: '95%',
						elevation: 2,
						borderBottomColor: '#dddddd',
						borderBottomWidth: 1,
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}>
						<View style={{
							flexDirection: 'row'
						}}>
							<View style={{
								height: 75,
								margin: 5,
								aspectRatio: 1
							}}>
								<Avatar
									rounded
									source={{
										uri: itemRecipient ? itemRecipient.profileimage : "uri shouldn't be an empty string so I put sth here",
										cache: 'force-cache'
									}}
									size="large"
								/>
								{item.last_contact_date > item.last_read_time ? 
									(
										<Badge
											status="error"
											containerStyle={{ position: 'absolute', top: 0, right: 0 }}
										/>
									) : (
										<View />
									)
								}
								
							</View>
							<View style={{
								flexDirection: 'column',
								height: 75,
								margin: 5,
								justifyContent: 'center'
							}}>
								<Text style={{
									color: 'black',
									fontSize: RF(2.5)
								}}>{itemRecipient ? itemRecipient.first_name + " " + itemRecipient.last_name : "Loading..."}</Text>
								<Text style={{
									color: 'grey',
									fontSize: RF(2)
								}}>{itemRecipient ? itemRecipient.graduation : "Loading..."}</Text>
								<Text style={{
									color: 'grey',
									fontSize: RF(2)
								}}>{itemRecipient ? itemRecipient.major : "Loading..."}</Text>
							</View>
						</View>
						<View style={{
							flexDirection: 'row',
							height: 75,
							margin: 5,
							alignItems: 'center'
						}}>
							<Icon name="chevron-right" type="font-awesome"/>
						</View>
					</TouchableOpacity>
				))
			})
		}
		

		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#2EA9DF'}}>
				<View style={styles.header}>
					<View style={styles.titleContainer}>	
						<Text style={styles.title}>Messages</Text>
					</View>
				</View>
				
				<View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
					<ScrollView style={{

					}}
					contentContainerStyle={{

					}}>
						{content}
					</ScrollView>
				</View>
			</SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({

	header:{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2ea9df',
		paddingTop: RF(1),
		paddingBottom: RF(1),
	},

	titleContainer:{
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},

	title:{
		color: "white",
		fontSize: RF(4),
	},

})
