// HousingListingPage will be a page for user to look at the houses they listed. This page has the ability to add or delete house listing. 
// To edit a house listing, the user will be navigated to EditHousingPage with fields populated. 
// To add a house listing, the user will be navigated to EditHousingPage with fields empty. 

import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, Button, Alert, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar, withTheme } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import RF from "react-native-responsive-fontsize";
import HousePreviewView from '../View/HousePreviewView';

export default class HousingListingPage extends React.Component{
	static navigationOptions = ({ navigation }) => ({
    headerTitle: 
			<Text style={{
				color: 'white', fontSize: RF(3)
			}}>
				Listings
			</Text>,
		headerStyle: {
      backgroundColor: '#2EA9DF',
		},
		headerRight:
			<TouchableOpacity onPress={() => {navigation.navigate("EditHousingPage", {houseId: ""})}}>
				<View style={styles.addButton}>
					<Icon name="plus-circle" type="font-awesome" color='white' size={30}/>
				</View>
			</TouchableOpacity>
		
	});

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
			<View>

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
			</View>
		);
	}

}

const {width, height, scale} = Dimensions.get('window');

const styles = StyleSheet.create({

	addButton: {
		paddingRight: 15,
	},

	buttonContainer: {
		backgroundColor: '#f7f7f7',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},

})
