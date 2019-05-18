// HousingListingPage will be a page for user to look at the houses they listed. This page has the ability to add or delete house listing. 
// To edit a house listing, the user will be navigated to EditHousingPage with fields populated. 
// To add a house listing, the user will be navigated to EditHousingPage with fields empty. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import RF from "react-native-responsive-fontsize";
import HousePreviewView from '../View/HousePreviewView';

export default class HousingListingPage extends React.Component{
	state = {
		housingItems: null
	}

	constructor() {
		super();
		let landlordRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
		this.housesRef = firebase.firestore().collection("houses").where("landlord", "==", landlordRef);
	}

	// Get housing data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getHousingData = () => {
		this.setState({
			isFetchingHouseData: true
		})
		this.housesRef.get().then(snapshot => {
			let housingItems = [];
			snapshot.forEach(house => {
				var aHouse = new House(house.data(), house.id);
				housingItems.push(aHouse);
			});
			
			this.setState({
				housingItems: housingItems,
				isFetchingHouseData: false
			});
		});
		
	}

	editHouse = (house) => {
		this.props.navigation.push("EditHousingPage", {
			houseId: house.id,
		});
	}

	addHouse = () => {
		this.props.navigation.push("EditHousingPage", {
			houseId: ""
		})
	}

	componentWillMount() {
		this.getHousingData();
	}

	render = () => {
		
		if (!this.state.housingItems) {
			return (<View></View>);
		}


		return (
			<SafeAreaView style={{flex: 1}}>
				<Button title="Add House" onPress={this.addHouse}/>
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={this.state.housingItems}
					onRefresh={this.getHousingData}
					refreshing={this.state.isFetchingHouseData}
					renderItem={({item}) => (
						<HousePreviewView house={item} onTouch={this.editHouse} favDisabled={true}/>
					)}
				/>
      </SafeAreaView>
		);
	}

}
