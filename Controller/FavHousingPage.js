
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
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
	getHousingData = () => {

		this.setState({
			isFetchingHouseData: true,
			housingItems: []
		})

		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
			user.house_favorite.forEach((house) => {
				house.get().then((snapshot) => {
					this.state.housingItems.push(new House(snapshot.data(), snapshot.id));
					this.forceUpdate();
				})
			})
			this.setState({
				isFetchingHouseData: false
			});
		});
	}

	openHouse = (house) => {
		this.props.navigation.push("ViewHousingPage", {
			houseId: house.id,
		});
	}

	componentWillMount() {
		this.getHousingData();
	}

	render = () => {
		return (
			<SafeAreaView style={{flex: 1, backgorundColor: '#2EA9DF'}}>
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={this.state.housingItems}
					onRefresh={this.getHousingData}
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