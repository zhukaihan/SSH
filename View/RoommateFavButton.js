// RoommatePreviewView will display a preview of a roommate. It is intended to be used with Flatlist. 
// When the preview is touched, it will call the onTouch props. 
// Usage: <RoommatePreviewView roommate={aroommate} onTouch={this.onRoommateTouch} />
// The RoommatePreviewView will display the information about aroommate and will call this.onRoommateTouch when touched. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import User from '../Model/User';
import firebase from 'firebase';

export default class RoommateFavButton extends React.Component {
	state = {
		isRoommateFav: false
	}

	componentDidMount = () => {
		// var unsubscribe = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid)
		// .onSnapshot((snapshot) => {
		// 	snapshot.docChanges().forEach(function(change) {
		// 			if (change.type === "modified") {
		// 					console.log("Modified city: ", change.doc.data());
		// 			}
		// 			if (change.type === "removed") {
		// 					console.log("Removed city: ", change.doc.data());
		// 			}
		// 		});
		// });
		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
			user.roommate_favorite.forEach((favRoommate) => {
				if (favRoommate.isEqual(this.props.roommate.dbRef)) {
					this.setState({
						isRoommateFav: true
					})
				}
			})
		})
	}

	favRoommate = (roommate) => {
		let failedFavRoommateAlert = () => {
			Alert.alert(
				'Favorite Failed',
				'Please try agian later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		}
		if (roommate.id == "" || !this.state.curUser || !this.state.curUser.dbRef) {
			failedFavRoommateAlert();
			return;
		}

		this.state.curUser.dbRef.update({
			roommate_favorite: firebase.firestore.FieldValue.arrayUnion(roommate.dbRef)
		}).then(() => {
			this.setState({
				isRoommateFav: true
			})
		}).catch(() => {
			failedFavRoommateAlert();
			return;
		});
	}

	unfavRoommate = (roommate) => {
		let failedFavRoommateAlert = () => {
			Alert.alert(
				'Unfavorite Failed',
				'Please try agian later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		}
		if (roommate.id == "" || !this.state.curUser || !this.state.curUser.dbRef) {
			failedFavRoommateAlert();
			return;
		}

		this.state.curUser.dbRef.update({
			roommate_favorite: firebase.firestore.FieldValue.arrayRemove(roommate.dbRef)
		}).then(() => {
			this.setState({
				isRoommateFav: false
			})
		}).catch(() => {
			failedFavRoommateAlert();
			return;
		});
	}

	render() {
		let item = this.props.roommate;

		if (!item) {
			return (<View></View>);
		}

		if (this.state.isRoommateFav) {
			return (
				<TouchableOpacity onPress={() => this.unfavRoommate(item)}>
						<Icon name="star" type="font-awesome" color='orange' />
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity onPress={() => this.favRoommate(item)}>
						<Icon name="star-o" type="font-awesome" color='orange' />
				</TouchableOpacity>
			)
		}
	}
}