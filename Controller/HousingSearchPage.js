// HousingSearchPage will be used for the user to search for a house. It will display all houses available for renting and has the ability to filter (WIP). 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight,TouchableOpacity,TextInput } from 'react-native';
import { Icon, Card, Badge, SearchBar,Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import HousePreviewView from '../View/HousePreviewView';
const Items_Per_Page = 6;

export default class HousingSearchPage extends React.Component{
	state = {
		housingItems: [],
		displayList: [],
		isFetchingHouseData: true,
		page: 0,
		searchQuery: "",
		advSearchisVisible: false,
		minPrice: null,
		maxPrice: null,
		bed: null,
		bath: null,
		parking: null,
		tenant: null,
		additional_tags: [],
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

	updateFilter = () =>{
		this.setState({
			displayList:[],
			isFetchingHouseData: true
		})
		const zero = 0;
		var filter = this.housesRef;
		if(this.state.minPrice != null){
            filter = this.housesRef.where("price", ">", parseInt(this.state.minPrice));
		}
		if(this.state.maxPrice != null){
			filter = this.housesRef.where("price", "<", parseInt(this.state.maxPrice));
		}
		if(this.state.bed != null){
			filter = this.housesRef.where("num_bedroom", ">=", parseInt(this.state.bed));
		}
		if(this.state.bath != null){
			filter = this.housesRef.where("num_bathroom", ">=", parseInt(this.state.bath));
		}
		if(this.state.parking != null){
			filter = this.housesRef.where("num_parking", ">=", parseInt(this.state.parking));
		}
		if(this.state.tenant != null){
			filter = this.housesRef.where("num_tenant", ">=", parseInt(this.state.tenant));
		}
		filter.get().then(snapshot => {
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
			});
		});
		this.setState({
            isFetchingHouseData: false
		})
	}
	
	clearFilter = () =>{  
        this.setState({
			minPrice: null,
			maxPrice: null,
			bed: null,
			bath: null,
			parking: null,
			tenant: null,
		})
	}
	applyFilter = () =>{
		this.setState({
			advSearchisVisible:false,
		})
		this.updateFilter();
	}

	cancelFilter = () =>{
		this.setState({
			advSearchisVisible:false,
		})
	}

	render = () => {

		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#2EA9DF'}}>
				<View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
					<SearchBar
						placeholder="Search Keywords"
						lightTheme={true}
						round={true}
						containerStyle={{backgroundColor: '#2EA9DF', borderTopWidth: 0}}
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
				    <TouchableOpacity onPress={()=> this.setState({advSearchisVisible:true})}>
						<Text>Advance Search</Text>
					</TouchableOpacity>
                    <Overlay
						isVisible={this.state.advSearchisVisible}
						width="auto"
						height="auto"
						onBackdropPress={() =>
							this.setState({advSearchisVisible: false})
						}
					>
					<View style={{flexDirection:"column"}}>
					    <View style={styles.OverlayContainer}>
						<Text>Price:</Text>
							<TextInput placeholder="0" style={styles.textInput} 
							onChangeText={ minPrice =>{
								if(minPrice != ""){
								this.setState({minPrice})
								}else{
									this.setState({minPrice:null})
								}
								console.log(this.state.minPrice);
								}}
							keyboardType={"number-pad"}
							value={this.state.minPrice}></TextInput>
							<Text> To </Text>
							<TextInput placeholder="0" id="maxPrice" style={styles.textInput} 
							onChangeText={maxPrice =>{
								if(maxPrice !=""){
								this.setState({maxPrice})
								}else{
									this.setState({maxPrice:null})
								}
								console.log(this.state.maxPrice);
								}}
							keyboardType={"number-pad"}
							value={this.state.maxPrice}></TextInput>
						</View>
						<View style={styles.OverlayContainer}>
						<Text>Bath:</Text>
							<TextInput placeholder="0" id="bath" style={styles.textInput} 
							onChangeText={bath =>{
								if(bath != ""){
								this.setState({bath})}
								else{
									this.setState({bath:null})
								}
								console.log(this.state.bath);
								}
				
							}
							keyboardType={"number-pad"}
							value={this.state.bath}>
							</TextInput>
						</View>
						<View style={styles.OverlayContainer}>
						<Text>Bed:</Text>
							<TextInput placeholder="0"id="bed" style={styles.textInput} 
							onChangeText={bed =>{
								if(!bed){
								this.setState({bed})}
								else{
									this.setState({bed:null})
								}
								console.log(this.state.bed);
								}}
							keyboardType={"number-pad"}
							value={this.state.bed}>
							</TextInput>
						</View>
						<View style={styles.OverlayContainer}>
						<Text>Parking:</Text>
							<TextInput placeholder="0" id="parking" style={styles.textInput} 
							onChangeText={parking =>{
								if(!parking){
								this.setState({parking})}
								else{
									this.setState({parking:null})
								}
								console.log(this.state.parking);
								}}
							keyboardType={"number-pad"}
							value={this.state.parking}></TextInput>
						</View>
						<View style={styles.OverlayContainer}>
						<Text>Tenant:</Text>
							<TextInput placeholder="0" id="tenant" style={styles.textInput} 
							onChangeText={tenant =>{
								if(!tenant){
								this.setState({tenant})}
								else{
									this.setState({tenant:null})
								}
								console.log(this.state.tenant);
								}}
							keyboardType={"number-pad"}
							value={this.state.tenant}></TextInput>
						</View>
						<View style={styles.OverlayContainer}>
						<Text>Additional Tags:</Text>
							<TextInput placeholder="0" id="additional_tags" style={styles.textInput} 
							onChangeText={additional_tags =>{
								this.setState({additional_tags})
								console.log(this.state.additional_tags);
								}}
							keyboardType={"number-pad"}
							></TextInput>
						</View>
						<TouchableOpacity onPress={()=>{
							this.applyFilter();
						}}>
							<Text>Apply Filter</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={()=>{
							this.cancelFilter();
						}}>
							<Text>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={()=>{
							this.clearFilter();
						}}>
							<Text>Clear</Text>
						</TouchableOpacity>
						</View>
					</Overlay>
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
	OverlayContainer:{
        flexDirection:"row",
	},
	textInput:{
		borderWidth:1,
		borderColor:"#fff",
	}
})
