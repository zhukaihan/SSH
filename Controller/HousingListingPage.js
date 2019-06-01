// HousingListingPage will be a page for user to look at the houses they listed. This page has the ability to add or delete house listing. 
// To edit a house listing, the user will be navigated to EditHousingPage with fields populated. 
// To add a house listing, the user will be navigated to EditHousingPage with fields empty. 

import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, Button, Alert, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import RF from "react-native-responsive-fontsize";
import HousePreviewView from '../View/HousePreviewView';

export default class HousingListingPage extends React.Component{
	state = {
		housingItems: [],
		isFetchingHouseData: true
	}

	constructor() {
		super();
		let landlordRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
		this.housesRef = firebase.firestore().collection("houses").where("landlord", "==", landlordRef);
	}

	// Get housing data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getHousingData = async () => {
		this.setState({
			isFetchingHouseData: true
		}, () => {
			this.flatList && this.flatList.scrollToOffset({offset: -65});
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
			houseId: house.id
		});
	}

	addHouse = () => {
		this.props.navigation.push("EditHousingPage", {
			houseId: ""
		})
	}

	componentDidMount = async () => {
		if (this.flatList) {
			this.flatList.recordInteraction();
			this.flatList.scrollToOffset({offset: -60})
		}
		this.getHousingData();
	}

	componentWillMount = async () => {
		this.getHousingData();
	}

	render = () => {

		return (
			<SafeAreaView style={{flex: 1}} backgroundColor='#2ea9df'>

				<View style={styles.header}>
					<View style={styles.titleContainer}>	
						<Text style={styles.title}>Listings</Text>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<View style={{borderBottomWidth: 1,}}>
						<Button title="Add House" onPress={this.addHouse}/>
					</View>
				</View>

				<FlatList
					backgroundColor='#f7f7f7'
					keyExtractor={(item, index) => index.toString()}
					data={this.state.housingItems}
					onRefresh={this.getHousingData}
					refreshing={this.state.isFetchingHouseData}
					contentOffset={{ y: -60, x: 0 }}
					renderItem={({item}) => (
						<HousePreviewView house={item} onTouch={this.editHouse} favDisabled={true}/>
					)}
					ref={(flatList) => this.flatList = flatList}
				/>
      </SafeAreaView>
		);
	}

}

const {width, height, scale} = Dimensions.get('window');

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

	buttonContainer: {
		backgroundColor: '#f7f7f7',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},

})
