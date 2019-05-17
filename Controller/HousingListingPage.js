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
		this.housesRef = firebase.firestore().collection("houses").where("landlord", "==", "/users/" + firebase.auth().currentUser.uid);
	}

	// Get housing data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getHousingData = () => {
		this.housesRef.orderBy("post_date").get().then(snapshot => {
			let housingItems = [];
			snapshot.forEach(house => {
				var aHouse = new House(house.data(), house.id);
				housingItems.push(aHouse);
			});
			
			this.setState({
				housingItems: housingItems
			});
		});
		
	}

	editHouse(house) {
		this.props.navigation.navigate("EditHousingPage", {
			houseId: house.id,
		});
	}

	addHouse = (house) => {
		this.props.navigation.navigate("EditHousingPage", {
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
				<Button onTouch={this.addHouse()}>Add House</Button>
				<View style={{margin: 10}}>
					<SearchBar
						placeholder="Search Keywords"
						lightTheme={true}
						round={true}
						containerStyle={{backgroundColor: 'white'}}
						inputContainerStyle={{backgroundColor: 'white'}}
						onChangeText={this.updateSearchQuery}
						value={this.state.searchQuery}
					/>
				</View>
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={this.state.housingItems}
					renderItem={({item}) => (
						<HousePreviewView house={item} onTouch={this.editHouse}/>
					)}
				/>
      </SafeAreaView>
		);
	}

}
