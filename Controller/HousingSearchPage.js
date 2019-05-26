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
		var newData = this.state.housingItems.slice(start,end);
		this.setState({
			displayList:[...displayList,...newData],
			page:page+1,
			isFetchingHouseData: false
		});
	}

	componentWillMount() {
		this.getHousingData();
	}

	updateSearchQuery = searchQuery => {
		this.setState({ searchQuery });
	};
	
	searchAndUpdateWithQuery = () => {
		this.setState({
			isFetchingHouseData: true
		})
		if(this.state.searchQuery == ""){
			this.getHousingData();
		}
		var searchString = this.state.searchQuery.toString().split(" ");
		console.log(searchString);
		var bf = require("./bloomfilter"),
        bloom=bf.BloomFilter;
		let newHousingItems = [];
	 	this.state.housingItems.forEach(function(housingItem){
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

		if (!this.state.housingItems) {
			return (<View></View>);
		}


		return (
			<SafeAreaView style={{flex: 1}}>
				<View style={{margin: 0}}>
					<SearchBar
						placeholder="Search Keywords"
						lightTheme={true}
						round={true}
						containerStyle={{backgroundColor: '#2EA9DF', height: 100}}
						inputContainerStyle={{backgroundColor: 'white', marginTop: 30, width: '80%'}}
						onChangeText={this.updateSearchQuery}
						value={this.state.searchQuery}
					/>
					<TouchableOpacity onPress={this.searchAndUpdateWithQuery}>
							<View>
								<Text>Search</Text>
							</View>
					</TouchableOpacity>
				</View>
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={this.state.displayList}
					onRefresh={this.getHousingData}
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
      </SafeAreaView>
		);
	}

}


const styles = StyleSheet.create({
})