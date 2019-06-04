// HousingSearchPage will be used for the user to search for a house. It will display all houses available for renting and has the ability to filter (WIP). 

import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight,TouchableOpacity, TextInput, RefreshControl } from 'react-native';
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
		isFetchingHouseData: false,
		page: 0,
		searchQuery: "",
		advSearchisVisible: false,
		noResult: false,
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
	}
	
	// Get housing data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getHousingData = async (callback) => {
		this.setState(() => {return {
			isFetchingHouseData: false
		}})
		this.housesRef.where("availability", "==", true).orderBy("post_date", 'desc').get().then((snapshot) => {
			this.state.housingItems = [];
			snapshot.forEach((aHouse) => {
				house = new House(aHouse.data(), aHouse.id);
				this.state.housingItems.push(house);
			})
			if (callback) {
				callback();
				this.setState(() => {return {
					isFetchingHouseData: false
				}})
			} else {
				this.setState(() => {return {
					isFetchingHouseData: false
				}})
			}
		}).catch((e) => {
			this.setState(() => {return {
				isFetchingHouseData: false
			}})
		})
	}

	filterHouse = () => {
		var filter = {
		}
		if(this.state.minPrice != ""){
			// filter = filter.where("price", ">", parseInt(this.state.minPrice));
			filter.minPrice = parseInt(this.state.minPrice);
		}
		if(this.state.maxPrice != ""){
			// filter = filter.where("price", "<", parseInt(this.state.maxPrice));
			filter.maxPrice = parseInt(this.state.maxPrice);
		}
		if(this.state.bed != ""){
			// filter = filter.where("num_bedroom", ">=", parseInt(this.state.bed));
			filter.numBed = parseInt(this.state.bed);
		}
		if(this.state.bath != ""){
			// filter = filter.where("num_bathroom", ">=", parseInt(this.state.bath));
			filter.numBath = parseInt(this.state.bath);
		}
		if(this.state.parking != ""){
			// filter = filter.where("num_parking", ">=", parseInt(this.state.parking));
			filter.numParking = parseInt(this.state.parking);
		}
		if(this.state.tenant != ""){
			// filter = filter.where("num_tenant", ">=", parseInt(this.state.tenant));
			filter.numTenant = parseInt(this.state.tenant);
		}

		var searchString = []
		var doingFreeTextSearch = false;
		if (this.state.searchQuery != "") {
			// Find query about bathrooms. 
			let numBathStrs = this.state.searchQuery.match(/[0-9]+( )*(Bathroom|BA|bathroom|bath|ba)+[es|s]*/g);
			let numBath = numBathStrs && numBathStrs.length > 0 ? numBathStrs[0].match(/[0-9]*/g)[0] : null;
			// filter = filter.where("num_bathroom", "==", parseInt(numBath));
			if (numBath) {
				filter.numBath = parseInt(numBath);
				doingFreeTextSearch = true;
			}

			// Find query about bedrooms
			let numBedStrs = this.state.searchQuery.match(/[0-9]+( )*(Bedroom|BED|bedroom|bed|be)+[s]*/g);
			let numBed = numBedStrs && numBedStrs.length > 0 ? numBedStrs[0].match(/[0-9]*/g)[0] : null;
			// filter = filter.where("num_bedroom", "==", parseInt(numBed));
			if (numBed) {
				filter.numBed = parseInt(numBed);
				doingFreeTextSearch = true;
			}

			// Find query about parkings
			let numParkStrs = this.state.searchQuery.match(/[0-9]+( )*(parking|Parking|P)+[s]*/g);
			let numPark = numParkStrs && numParkStrs.length > 0 ? numParkStrs[0].match(/[0-9]*/g)[0] : null;
			// filter = filter.where("num_parking", "==", parseInt(numPark));
			if (numPark) {
				filter.numPark = parseInt(numPark);
				doingFreeTextSearch = true;
			}

			// Find query about pricing
			// let pricingStrs = this.state.searchQuery.match(/\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)/g);
			// let maxPrice = pricingStrs ? pricingStrs[0].match(/[0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+/g) : null;
			// // filter = filter.where("price", "<", parseInt(maxPrice));
			// if (maxPrice) {
			// 	filter.maxPrice = parseInt(maxPrice);
			//	 doingFreeTextSearch = true;
			// }

			searchString = this.state.searchQuery.toString().split(" ");
		}
		console.log(filter);

		var displayList = [];
		this.state.housingItems.forEach((house) => {
			
			if (searchString && searchString.length > 0 && !doingFreeTextSearch) {
				var bf = require("./bloomfilter");

				let bloomfilterArr = JSON.parse(house.bloomfilter);
				var Bloom = new bf.BloomFilter(bloomfilterArr,16);
				var allInFilter = true;
				for (var i = 0; i < searchString.length; i++) {
					if (!Bloom.test(searchString[i])) {
						allInFilter = false;
						break;
					}
				}
				if (!allInFilter) {
					return;
				}
			}

			if (filter.minPrice && house.price < filter.minPrice) {
				return;
			}
			if (filter.maxPrice && house.price > filter.maxPrice) {
				return;
			}
			if (filter.numBed && (house.num_bedroom < filter.numBed)) {
				return;
			}
			if (filter.numBath && house.num_bathroom < filter.numBath) {
				return;
			}
			if (filter.numParking && house.num_parking < filter.numParking) {
				return;
			}
			if (filter.numTenant && house.num_tenant < filter.numTenant) {
				return;
			}

			displayList.push(house);
		});


		this.setState(() => {return {
			displayList: displayList,
			isFetchingHouseData: false,
			page: 0,
		}})

		if(displayList.length == 0 || displayList.length == undefined){
			this.setState({
				noResult:true
			})
		}else{
			this.setState({
				noResult:false})
		}
		
	}

	onRefresh = () => {
		this.getHousingData(this.filterHouse);
	}
	
	openHouse = async (house) => {
		this.props.navigation.push("ViewHousingPage", {
			houseId: house.id,
		});
	}
	
	loadMore = async () => {
		this.setState({
			page: this.state.page + 1
		})
	}
	
	componentDidMount = async () => {
		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
		});
		this.getHousingData(this.filterHouse);
	}
	
	updateSearchQuery = async searchQuery => {
		this.setState({ searchQuery });
	};
	
	clearFilter = async () =>{  
		this.setState({
			minPrice: "",
			maxPrice: "",
			bed: "",
			bath: "",
			parking: "",
			tenant: "",
		})
		this.filterHouse();
	}
	applyFilter = async () =>{
		this.setState({
			advSearchisVisible: false,
		})
		this.filterHouse();
	}
	
	cancelFilter = async () =>{
		this.setState({
			advSearchisVisible:false,
		})
	}
	
	render = () => {
		const end = (this.state.page + 1) * Items_Per_Page - 1;
		var dataToDisplay = this.state.displayList.slice(0,end);
		
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
						onClear={this.onRefresh}
						onSubmitEditing={this.filterHouse}
						
						searchIcon={
							<TouchableOpacity onPress={this.filterHouse}>
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
						overlayStyle={styles.overlay}
						isVisible={this.state.advSearchisVisible}
						width="auto"
						height="auto"
						onBackdropPress={() =>
							this.setState({advSearchisVisible: false})
						}
					>
						<View style={{flexDirection:"column"}}>
							<View style={styles.OverlayContainer}>
								<Text style={{fontSize:RF(2.5)}}>Price:</Text>
								<TextInput
									placeholder="Min" style={styles.textInput}
									placeholderTextColor={'#fff'}
									onChangeText={minPrice => {
										this.setState({minPrice})
										console.log(this.state.minPrice);
									}}
									keyboardType={"number-pad"}
									value={this.state.minPrice}
								/>
								<Text style={{fontSize:RF(2.5)}}>To:</Text>
								<TextInput
									placeholder="Max" id="maxPrice"
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
								<Text style={{fontSize:RF(2.5)}}>Bath:</Text>
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
								<Text style={{fontSize:RF(2.5)}}>Bed:</Text>
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
								<Text style={{fontSize:RF(2.5)}}>Parking:</Text>
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
								<Text style={{fontSize:RF(2.5)}}>Tenant:</Text>
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
							<View style={{flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
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

						</View>
					</Overlay>
					<View>
						{
							this.state.noResult ? <Text style={{fontSize: RF(2.5)}}> There is no result that matches your filter</Text> : null
						}
					</View>
					<FlatList
						keyExtractor={(item, index) => index.toString()}
						data={dataToDisplay}
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
		justifyContent:"center",
		alignItems:"center",
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
		borderWidth: 5,
		borderRadius: 10,
		borderColor: "#fff",
	},

	textInput: {
		borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
		margin: 8,
		textAlign:'center',
		fontSize:RF(2.5),
		color: "#fff",
		height: "60%",
		width: "25%",
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
		fontSize:RF(2.5),
		color: "#fff",
		height: "60%",
		width: "25%",
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
		fontSize:RF(2.5),
		color: "#fff",
		height: "60%",
		width: "25%",
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
		fontSize:RF(2.5),
		color: "#fff",
		height: "60%",
		width: "25%",
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
		fontSize:RF(2.5),
		color: "#fff",
		height: "60%",
		width: "25%",
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
		fontSize:RF(2.5),
		color: "#fff",
		height: "60%",
		width: "25%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",

	},


	advanceButton: {
		margin: 10,
		borderWidth: 3,
		borderRadius: 10,
		textAlign: 'center',
		width: "100%",
		fontSize:RF(2.5),
		backgroundColor:"#fff",
		alignItems: "center",
		justifyContent: "center",
	},

})
					