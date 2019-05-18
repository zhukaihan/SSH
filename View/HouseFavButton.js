// HousePreviewView will display a preview of a house. It is intended to be used with Flatlist. 
// When the preview is touched, it will call the onTouch props. 
// Usage: <HousePreviewView house={ahouse} onTouch={this.onHouseTouch} />
// The HousePreviewView will display the information about ahouse and will call this.onHouseTouch when touched. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import User from '../Model/User';
import firebase from 'firebase';

export default class HouseFavButton extends React.Component {
	state = {
		isHouseFav: false
	}

	componentWillMount() {
		if (this.props.curUser) {
			this.setState({
				isHouseFav: this.props.curUser.house_favorite.includes(this.props.house.id)
			})
		}
	}

	favHouse = (house) => {
		let failedFavHouseAlert = () => {
			Alert.alert(
				'Favorite Failed',
				'Please try agian later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		}
		if (house.id == "" || !this.props.curUser || !this.props.curUser.dbRef) {
			failedFavHouseAlert();
			return;
		}

		this.props.curUser.dbRef.update({
			house_favorite: firebase.firestore.FieldValue.arrayUnion(house.id)
		}).then(() => {
			this.setState({
				isHouseFav: true
			})
		}).catch(() => {
			failedFavHouseAlert();
			return;
		});
	}

	unfavHouse = (house) => {
		let failedFavHouseAlert = () => {
			Alert.alert(
				'Unfavorite Failed',
				'Please try agian later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		}
		if (house.id == "" || !this.props.curUser || !this.props.curUser.dbRef) {
			failedFavHouseAlert();
			return;
		}

		this.props.curUser.dbRef.update({
			house_favorite: firebase.firestore.FieldValue.arrayRemove(house.id)
		}).then(() => {
			this.setState({
				isHouseFav: false
			})
		}).catch(() => {
			failedFavHouseAlert();
			return;
		});
	}

	render() {
		item = this.props.house;

		if (!item) {
			return (<View></View>);
		}

		if (this.state.isHouseFav) {
			return (
				<TouchableOpacity onPress={() => this.unfavHouse(item)}>
						<Icon name="star" type="font-awesome" color='orange' />
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity onPress={() => this.favHouse(item)}>
						<Icon name="star-o" type="font-awesome" color='orange' />
				</TouchableOpacity>
			)
		}
	}
}