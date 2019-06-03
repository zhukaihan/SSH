// HousingSearchPage will be used for the user to search for a house. It will display all houses available for renting and has the ability to filter (WIP). 

import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight,TouchableOpacity,TextInput } from 'react-native';
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
		minPrice: "",
		maxPrice: "",
		bed: "",
		bath: "",
		parking: "",
		tenant: "",
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
	getHousingData = async () => {
		this.setState({
			displayList:[],
			isFetchingHouseData: true
		})
		const zero = 0;
		this.housesRef.orderBy("post_date", "desc").get().then(snapshot => {
			let housingItems = [];
			snapshot.forEach(house => {
				var aHouse = new House(house.data(), house.id);
				if(aHouse.availability == false){
				housingItems.push(aHouse);
				}
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
	
	onRefresh = async () => {
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
	
	openHouse = async (house) => {
		this.props.navigation.push("ViewHousingPage", {
			houseId: house.id,
		});
	}
	
	loadMore = async () => {
		console.log("load data");
		if(this.state.housingItems == null)
		{
			this.getHousingData();
		}
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
		}
	}
	
	componentDidMount = async () => {
		this.getHousingData();
	}
	
	updateSearchQuery = async searchQuery => {
		this.setState({ searchQuery });
	};
	
	advanceSearchFilter = async () =>{
		
	}
	
	searchAndUpdateWithQuery = async () => {
		this.setState({
			isFetchingHouseData: true
		})
		if(this.state.searchQuery == ""){
			this.getHousingData();
		}
		
		// Find query about bathrooms. 
		let numBathStrs = this.state.searchQuery.match(/[0-9]+( )*(Bathroom|BA|bathroom|bath|ba)+[es|s]*/g);
		let numBath = numBathStrs && numBathStrs.length > 0 ? numBathStrs[0].match(/[0-9]*/g)[0] : 0;
		// Find query about bedrooms
		let numBedStrs = this.state.searchQuery.match(/[0-9]+( )*(Bedroom|BED|bedroom|bed|be)+[s]*/g);
		let numBed = numBedStrs && numBedStrs.length > 0 ? numBedStrs[0].match(/[0-9]*/g)[0] : 0;
		// Find query about parkings
		let numParkStrs = this.state.searchQuery.match(/[0-9]+( )*(parking|Parking|P)+[s]*/g);
		let numPark = numParkStrs && numParkStrs.length > 0 ? numParkStrs[0].match(/[0-9]*/g)[0] : 0;
		// Find query about pricing
		let pricingStrs = this.state.searchQuery.match(/\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)/g);
		console.log(this.state.searchQuery);
		console.log("pricingStr" + pricingStrs + " " + pricingStrs.length);
		let maxPrice = pricingStrs ? pricingStrs[0].match(/[0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+/g) : 0;
		console.log("maxPrice" + maxPrice);

		var searchString = this.state.searchQuery.toString().split(" ");
		console.log(searchString);
		var bf = require("./bloomfilter"),
		bloom=bf.BloomFilter;
		let newHousingItems = [];
		this.state.housingItems.forEach(function(housingItem){
			if(numBath != "" || numBed != "" || numPark != "" || maxPrice != ""){
			if (numBath > 0 && housingItem.num_bathroom == numBath) {
				// This house matches the required number of bathrooms. 
				newHousingItems.push(housingItem);
			}
			if (numBed > 0 && housingItem.num_bedroom == numBed) {
				// This house matches the required number of bedroom. 
				newHousingItems.push(housingItem);
			}
			if (numPark > 0 && housingItem.num_parking == numPark) {
				// This house matches the required number of parking. 
				newHousingItems.push(housingItem);
			}	
			if (maxPrice > 0 && housingItem.price <= parseInt(maxPrice) + 50) {
				
				newHousingItems.push(housingItem);
			}
			}	// This house is within $50 dollar radius of the price people entered.
			else{
			let bloomfilterArr = JSON.parse(housingItem.bloomfilter);
			var Bloom = new bloom(bloomfilterArr,16);
			for(var i = 0; i < searchString.length; i++){
				if(Bloom.test(searchString[i])){
					newHousingItems.push(housingItem);
					console.log(housingItem.title);
					break;
				}
			}
		}
			
		});
		console.log(newHousingItems.length)

		this.setState({
			displayList: [...newHousingItems],
			isFetchingHouseData: false
		});
		console.log(this.state.displayList.length)
		
		// Search here with this.houseRef or with Algolia and update housing lists async. 
		
	}
	
	updateFilter = async () =>{
		this.setState({
			displayList:[],
		})
		const zero = 0;
		var filter = this.housesRef;
		if(this.state.minPrice != ""){
			filter = filter.where("price", ">", parseInt(this.state.minPrice));
		}
		if(this.state.maxPrice != ""){
			filter = filter.where("price", "<", parseInt(this.state.maxPrice));
		}
		if(this.state.bed != ""){
			filter = filter.where("num_bedroom", ">=", parseInt(this.state.bed));
		}
		if(this.state.bath != ""){
			filter = filter.where("num_bathroom", ">=", parseInt(this.state.bath));
		}
		if(this.state.parking != ""){
			filter = filter.where("num_parking", ">=", parseInt(this.state.parking));
		}
		if(this.state.tenant != ""){
			filter = filter.where("num_tenant", ">=", parseInt(this.state.tenant));
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
	}
	
	clearFilter = async () =>{  
		this.setState({
			minPrice: null,
			maxPrice: null,
			bed: null,
			bath: null,
			parking: null,
			tenant: null,
		})
	}
	applyFilter = async () =>{
		this.setState({
			advSearchisVisible:false,
		})
		this.updateFilter();
	}
	
	cancelFilter = async () =>{
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
						<View style={styles.advanceContainer}>
							<Text>Advance Search</Text>
						</View>
					</TouchableOpacity>
					<Overlay
						style={styles.overlay}
						isVisible={this.state.advSearchisVisible}
						width='80%'
						height='80%'
						onBackdropPress={() =>
							this.setState({advSearchisVisible: false})
						}
					>
						<View style={{flexDirection:"column"}}>
							<View style={styles.OverlayContainer}>
								<Text style={{paddingTop: 10}}>Price:</Text>
								<TextInput
									placeholder="Min Price" style={styles.textInput}
									placeholderTextColor={'#fff'}
									onChangeText={minPrice => {
										this.setState({minPrice})
										console.log(this.state.minPrice);
									}}
									keyboardType={"number-pad"}
									value={this.state.minPrice}
								/>
								<Text style={{paddingTop: 10}}>To:</Text>
								<TextInput
									placeholder="Max Price" id="maxPrice"
									placeholderTextColor={"#fff"}
									style={styles.textInput}
									onChangeText={maxPrice =>{
											this.setState({maxPrice})
										console.log(this.state.maxPrice);
									}}
									keyboardType={"number-pad"}
									value={this.state.maxPrice}
								/>
							</View>
							<View style={styles.OverlayContainer}>
								<Text style={{paddingTop: 10}}>Bath:</Text>
								<TextInput
									placeholder="0" id="bath"
									placeholderTextColor={'#fff'}
									style={styles.textInputBath}
									onChangeText={bath =>{
											this.setState({bath})
										console.log(this.state.bath);
									}}
									keyboardType={"number-pad"}
									value={this.state.bath}
								/>
							</View>
							<View style={styles.OverlayContainer}>
								<Text style={{paddingTop: 10}}>Bed:</Text>
								<TextInput
									placeholder="0"id="bed"
									placeholderTextColor={"#fff"}
									style={styles.textInputBed}
									onChangeText={bed =>{
											this.setState({bed})
										console.log(this.state.bed);
									}}
									keyboardType={"number-pad"}
									value={this.state.bed}
								/>
							</View>
							<View style={styles.OverlayContainer}>
								<Text style={{paddingTop: 10}}>Parking:</Text>
								<TextInput
									placeholder="0" id="parking"
									placeholderTextColor={'#fff'}
									style={styles.textInputParking}
									onChangeText={parking =>{
											this.setState({parking})
										console.log(this.state.parking);
									}}
									keyboardType={"number-pad"}
									value={this.state.parking}
								/>
							</View>
							<View style={styles.OverlayContainer}>
								<Text style={{paddingTop: 10}}>Tenant:</Text>
								<TextInput
									placeholder="0" id="tenant"
									placeholderTextColor={"#fff"}
									style={styles.textInputTenant}
									onChangeText={tenant =>{
											this.setState({tenant})
										console.log(this.state.tenant);
									}}
									keyboardType={"number-pad"}
									value={this.state.tenant}
								/>
							</View>

							<TouchableOpacity onPress={
								this.applyFilter
							}>
								<Text style={styles.advanceButton}>Apply Filter</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={
								this.cancelFilter
							}>
								<Text style={styles.advanceButton}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={
								this.clearFilter
							}>
								<Text style={styles.advanceButton}>Clear</Text>
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
		height: 'auto',
		width: 'auto',

	},


	advanceContainer: {
		backgroundColor: '#E2DFDF',
		borderColor:'#E2DFDF',
		borderWidth: 10,
		borderBottomRightRadius: 10,
		borderBottomLeftRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},

	overlay: {
		borderWidth: 20,
		borderRadius: 20,
		borderColor: "#2ea9df"
	},

	textInput: {
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
		margin: 8,
		textAlign:'center',
		fontSize:RF(3),
		color: "#fff",
		height: "60%",
		width: "35%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",
	},

	textInputBath: {
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
		margin: 8,
		textAlign:'center',
		fontSize:RF(3),
		color: "#fff",
		height: "60%",
		width: "80%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",
	},

	textInputBed: {
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
		margin: 8,
		textAlign:'center',
		fontSize:RF(3),
		color: "#fff",
		height: "60%",
		width: "82%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",
	},

	textInputParking: {
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
		margin: 8,
		textAlign:'center',
		fontSize:RF(3),
		color: "#fff",
		height: "60%",
		width: "70%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",
	},

	textInputTenant: {
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
		margin: 8,
		textAlign:'center',
		fontSize:RF(3),
		color: "#fff",
		height: "60%",
		width: "70%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",
	},

	textInputTag: {
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
		marginLeft: 8,
		marginRight: 8,
		marginTop: 8,
		marginBottom: 16,
		textAlign:'center',
		fontSize:RF(3),
		color: "#fff",
		height: "60%",
		width: "60%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",

	},


	advanceButton: {
		margin: 10,
		borderWidth: 1,
		borderRadius: 10,
		textAlign: 'center',
		width: "80%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: RF(1),
		color: "#fff",
	},

})
					