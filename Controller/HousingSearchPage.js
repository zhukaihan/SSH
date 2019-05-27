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
import { TouchableOpacity } from 'react-native-gesture-handler';

const Items_Per_Page = 6;

export default class HousingSearchPage extends React.Component{
	state = {
		housingItems: [],
		displayList: [],
		isFetchingHouseData: true,
		page: 0,
		searchQuery: ""
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
		console.log("getting all Data");
		this.setState({
			displayList:[],
			isFetchingHouseData: true
		})
		const zero = 0;
		this.housesRef.orderBy("post_date", "desc").get().then(snapshot => {
			let housingItems = [];
			snapshot.forEach(house => {
				var aHouse = new House(house.data(), house.id);
				housingItems.push(aHouse);
			});
			this.setState({
				housingItems: housingItems,
				page: zero,
			});
			const { page, displayList } = this.state;
			const start = page*Items_Per_Page;
			const end = (page+1)*Items_Per_Page-1;
			var newData = housingItems.slice(start,end);
			this.setState({
				displayList:[...displayList,...newData],
				page:page+1,
				isFetchingHouseData: false
			});
		});
	}

	onRefresh = () => {
		if(this.state.searchQuery == ""){
			this.getHousingData();
		}
		else{
		this.setState({
			isFetchingHouseData: true,
			page: 0,
		})
		const { page, displayList } = this.state;
		const start = page*Items_Per_Page;
		const end = (page+1)*Items_Per_Page-1;
		var newData = this.state.displayList.slice(start,end);
		this.setState({
			displayList:[...displayList,...newData],
			page:page+1,
			isFetchingHouseData: false
		});
	}
	}

	openHouse = (house) => {
		this.props.navigation.push("ViewHousingPage", {
			houseId: house.id,
		});
	}

	loadMore = () => {
		console.log("load data");
		if(this.state.housingItems == null)
		{
			this.getHousingData();
		}
		this.setState({
			isFetchingHouseData: true
		})
		const { page, displayList } = this.state;
		const start = page*Items_Per_Page;
		const end = (page+1)*Items_Per_Page-1;
		console.log("start:" + start);
		console.log("end" + end);
		if(this.state.housingItems.length > end){
		var newData = this.state.housingItems.slice(start,end);
		this.setState({
			displayList:[...displayList,...newData],
			page:page+1,
			
		});
		this.setState({
			isFetchingHouseData: false
		});
	}
	}

	componentDidMount() {
		this.getHousingData();
	}

	updateSearchQuery = searchQuery => {
		this.setState({ searchQuery });
	};

	advanceSearchFilter = () =>{

	}
	
	searchAndUpdateWithQuery = () => {
		this.setState({
			displayList:[],
			isFetchingHouseData: true
		})
		if(this.state.searchQuery == ""){
			this.getHousingData();
		}

		// Find query about bathrooms. 
		let numBathStrs = this.state.searchQuery.match(/[0-9]+( )*(Bathroom|BA|bathroom|bath|ba)[es|s]*/g);
		let numBath = numBathStrs && numBathStrs.length > 0 ? numBathStrs[0].match(/[0-9]*/g)[0] : 0;
		// Find query about bedrooms
		let numBedStrs = this.state.searchQuery.match(/[0-9]+( )*(Bedroom|BED|bedroom|bed|be)[s]*/g);
		let numBed = numBedStrs && numBedStrs.length > 0 ? numBedStrs[0].match(/[0-9]*/g)[0] : 0;
		// Find query about parkings
		let numParkStrs = this.state.searchQuery.match(/[0-9]+( )*(parking|Parking|P)[s]*/g);
		let numPark = numParkStrs && numParkStrs.length > 0 ? numParkStrs[0].match(/[0-9]*/g)[0] : 0;
		// Find query about pricing
		let pricingStrs = this.state.searchQuery.match(/[$]*[0-9]\d\d|[0-9]\d\d\d/g);
		let maxPrice = pricingStrs && pricingStrs.length > 2 ? pricingStrs.match(/[0-9]\d\d|[0-9]\d\d\d/g) : 0;

		var searchString = this.state.searchQuery.toString().split(" ");
		console.log(searchString);
		var bf = require("./bloomfilter"),
        bloom=bf.BloomFilter;
		let newHousingItems = [];
	 	this.state.housingItems.forEach(function(housingItem){

			if (numBath > 0 && housingItem.num_bathroom >= numBath) {
				// This house matches the required number of bathrooms. 
				newHousingItems.push(housingItem);
			}
			if (numBed > 0 && housingItem.num_bedroom >= numBath) {
				// This house matches the required number of bedroom. 
				newHousingItems.push(housingItem);
			}
			if (numPark > 0 && housingItem.num_parking >= numBath) {
				// This house matches the required number of parking. 
				newHousingItems.push(housingItem);
			}	
			if (maxPrice > 0 && housingItem.price+50 <= maxPrice) {
				newHousingItems.push(housingItem);
			}	// This house is within $50 dollar radius of the price people entered.

			let bloomfilterArr = JSON.parse(housingItem.bloomfilter);
			var Bloom = new bloom(bloomfilterArr,16);
			for(var i = 0; i < searchString.length; i++){
				if(Bloom.test(searchString[i])){
					newHousingItems.push(housingItem);
					console.log(housingItem.title);
					break;
				}
			}

		});
		this.setState({
				displayList: newHousingItems,
				isFetchingHouseData: false
		});

		
		// Search here with this.houseRef or with Algolia and update housing lists async. 

	}

	render = () => {

		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#2EA9DF'}}>
				<View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
					<SearchBar
						placeholder="Search Keywords"
						lightTheme={true}
						round={true}
						containerStyle={{backgroundColor: '#f7f7f7', borderTopWidth: 0}}
						inputContainerStyle={{backgroundColor: 'white', marginStart:30, marginEnd:30, width: '85%', flexDirection: 'row-reverse'}}
						onChangeText={this.updateSearchQuery}
						value={this.state.searchQuery}
						onClear={this.getHousingData}
						onSubmitEditing={this.searchAndUpdateWithQuery}

						searchIcon={
							<TouchableOpacity onPress={this.searchAndUpdateWithQuery}>
								<View style={{paddingRight: 10,}}>
									<Icon name="search" type="font-awesome" color='darkgrey' />
								</View>
							</TouchableOpacity>
						}
					/>

					<FlatList
						keyExtractor={(item, index) => index.toString()}
						data={this.state.displayList}
						onRefresh={this.onRefresh}
						refreshing={this.state.isFetchingHouseData}
						onEndReached={this.loadMore}
						onEndReachedThreshold={0.7}
						renderItem={({item}) => (
								<HousePreviewView
									house={item}
									onTouch={this.openHouse}
									curUser={this.state.curUser}
								/>
						)}
					/>
				</View>
			</SafeAreaView>
		);
	}

}


const styles = StyleSheet.create({
})
