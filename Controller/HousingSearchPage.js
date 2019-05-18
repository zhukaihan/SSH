// HousingSearchPage will be used for the user to search for a house. It will display all houses available for renting and has the ability to filter (WIP). 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import HousePreviewView from '../View/HousePreviewView';

export default class HousingSearchPage extends React.Component{
	state = {
		housingItems: null,
		isFetchingHouseData: true
	}

	constructor() {
		super();

		this.housesRef = firebase.firestore().collection("houses");
		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
		});
	}

	// Get housing data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getHousingData = () => {
		this.setState({
			isFetchingHouseData: true
		})
		this.housesRef.orderBy("post_date").get().then(snapshot => {
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

	openHouse = (house) => {
		this.props.navigation.push("ViewHousingPage", {
			houseId: house.id,
		});
	}

	componentWillMount() {
		this.getHousingData();
		this.componentDidFocus = this.props.navigation.addListener(
			'didFocus',
			payload => {
				this.getHousingData();
			}
		);
	}

	componentWillUnmount = () => {
		this.componentDidFocus.remove();
	}

	updateSearchQuery = searchQuery => {
		this.setState({ searchQuery });
		this.searchAndUpdateWithQuery(this.state.searchQuery);
	};
	
	searchAndUpdateWithQuery = async (searchQuery) => {
		// Search here with this.houseRef or with Algolia and update housing lists async. 
	}

	render = () => {

		if (!this.state.housingItems) {
			return (<View></View>);
		}


		return (
			<SafeAreaView style={{flex: 1}}>
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