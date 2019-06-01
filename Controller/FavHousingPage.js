
import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import HousePreviewView from '../View/HousePreviewView';

export default class FavHousingPage extends React.Component{
	state = {
		housingItems: [],
		isFetchingHouseData: true
	}

	constructor() {
		super();
	}

	// Get housing data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getHousingData = async () => {

		this.setState({
			isFetchingHouseData: true
		})

		this.unsubscribe = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
			user = new User(snapshot.data(), snapshot.id);
			this.setState({
				curUser: user
			})
			if (user.house_favorite.length == 0) {
				this.setState({isFetchingHouseData: false, housingItems: []})
			} else {
				this.state.housingItems = [];
				var loadedCount = 0;
				user.house_favorite.forEach((house) => {
					house.get().then((snapshot) => {
						this.state.housingItems.push(new House(snapshot.data(), snapshot.id));
						this.state.isFetchingHouseData = false;
						loadedCount++;
						if (loadedCount == user.house_favorite.length) {
								this.forceUpdate();
						}
					})
				})
			}
		});
	}

	openHouse = async (house) => {
		this.props.navigation.push("ViewHousingPage", {
			houseId: house.id,
		});
	}

	componentWillMount = async () => {
		this.getHousingData();
	}

	componentWillUnmount = async () => {
		this.unsubscribe();
	}

	render = () => {
		var noFavView;
		if (!this.state.housingItems || this.state.housingItems.length == 0) {
			noFavView = (
				<Text style={{
					color: '#dddddd',
					fontSize: RF(6)
				}}>You have no favorited housing. </Text>
			)
		}
		return (
			<SafeAreaView style={{flex: 1, backgorundColor: '#2EA9DF'}}>
				{noFavView}
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={this.state.housingItems}
					refreshing={this.state.isFetchingHouseData}
					renderItem={({item}) => (
							<HousePreviewView
								house={item}
								onTouch={this.openHouse}
								curUser={this.state.curUser}
							/>
					)}
				/>
      </SafeAreaView>
		);
	}

}


const styles = StyleSheet.create({
})