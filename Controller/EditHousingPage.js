// This page will be displayed to allow user to add a house listing or edit a current one. 

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Alert, FlatList, TouchableOpacity, ScrollView, TextInput, Dimensions, Overlay, ActivityIndicator, Switch } from 'react-native';
import { Icon, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';
import ImageUploader from '../View/ImageUploader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserPreviewView from '../View/UserPreviewView';

export default class EditHousingPage extends React.Component{
	state = {
		cur_tenant: [],
		txtInput: "",
	}

	componentDidMount = async () => {
		let houseId = this.props.navigation.getParam("houseId", "")
		if (houseId != "") {
			// Get existing house. 
			House.getHouseWithID(houseId, (house) => {
				this.setState({
					house: house
				});

				house.cur_tenant.forEach((ref) => {
					ref.get().then(user => {
						var cur_tenant = this.state.cur_tenant;
						cur_tenant.push(new User(user.data(), user.id));
						this.setState({
							cur_tenant: cur_tenant
						});
					});
				});
			
			})
		} else {
			// Create an empty house but have the landlord populated as the current user. 
			let house = new House();
			house.landlord = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
			house.dbRef = firebase.firestore().collection("houses").doc();
			house.id = house.dbRef.id;
			this.setState({
				house: house
			});
		}
	}

	removeTenant = (tenant) => {
		// The parameter tenant is a User object. 
		// The cur_tenant is an array of firebase references. 
		// Therefore, we compare the tenant.dbRef with house.cur_tenant. 
		var filtered = this.state.house.cur_tenant.filter((value) => {
			return !value.isEqual(tenant.dbRef);
		});
		this.state.house.cur_tenant = filtered;
		
		var filtered_cur_tenant = this.state.cur_tenant.filter((value) => {
			return !(value === tenant);
		});
		this.setState({
			cur_tenant: filtered_cur_tenant
		})
	}

	addTenant = () => {
		// Display a view to search for a tenant from existing users. 
		// Must add the firebase reference of tenant to the house.cur_tenant. 

		addTenantCallback = (selectedUser) => {
			if (!selectedUser) {
				return;
			}
			this.state.house.cur_tenant.push(selectedUser.dbRef);
			
			var added_cur_tenant = this.state.cur_tenant;
			added_cur_tenant.push(selectedUser);
			this.setState({
				cur_tenant: added_cur_tenant
			})
		}

		this.props.navigation.push("IndividualUserSearch", {
			callback: addTenantCallback
		})
	}

	removePicture = (pictureUrl) => {
		var filtered = this.state.house.pictures.filter((value) => {
			return !value.isEqual(pictureUrl);
		});
		this.state.house.pictures = filtered;
		this.saveHouse();
	}

	addPicture = () => {
		// Display a view to upload image and add the url of the image to house.pictures. 
		if (!this.state.house) {
			return;
		}
		if (this.state.house.id == "") {
			this.saveHouse();
		}
		this.state.house.pictures.push("");
		ImageUploader.chooseImageToUpload(`houses/${this.state.house.id}/images`, (url) => {
			this.state.house.pictures[this.state.house.pictures.length - 1] = url;
			this.saveHouse();
		})
	}

	splitText = (bloomfilter, props) =>{
		var item = props.toString();
		var text = item.split(" ");
		for(var i = 0; i < text.length - 1; i++){
			bloomfilter.add(text[i]);
		}
	}
	_checkBedroom = () => {
		for(var i = 0; i <= 10; i++){
			if(houseToAdd.num_bedroom == i){
				return true;
			}
		}
		return false;
	}
	
	_checkBathroom = () => {
		for(var i = 0; i <= 10; i++){
			if(houseToAdd.num_bathroom == i){
				return true;
			}
		}
		return false;
	}

	_checkPrice = () => {
		return (house_price >= 0 && house_price <= 10000);
	}
	_checkParking = () => {
		for(var i = 0; i <= 10; i++){
			if(houseToAdd.num_parking == i){
				return true;
			}
		}
		return false;
	}
	saveHouse = () => {
		var bf = require("./bloomfilter"),
        bloom=bf.BloomFilter;
        this.f = new bloom(32*256,16);
		this.splitText(this.f, this.state.house.landlord);
		this.splitText(this.f, this.state.house.cur_tenant);
		this.splitText(this.f, this.state.house.title.toString());
		this.splitText(this.f, this.state.house.description);
		this.splitText(this.f, this.state.house.location);
		this.temp = [].slice.call(this.f.buckets);
		this.bloomfilter = JSON.stringify(this.temp);

		if (!this.state.house) {
			return;
		}
		var houseToAdd = {
			landlord: this.state.house.landlord, // Firebase Reference
			cur_tenant: this.state.house.cur_tenant, // Array of Firebase References
			pictures: this.state.house.pictures, // Array of Strings
			availability: this.state.house.availability, // Boolean
			post_date: firebase.firestore.Timestamp.now(), // Timestamp
			title: this.state.house.title.toString(), // String
			description: this.state.house.description,
			location: this.state.house.location, // String?
			price: parseInt(this.state.house.price), // Number
			num_bedroom: parseInt(this.state.house.num_bedroom), // Number
			num_bathroom: parseInt(this.state.house.num_bathroom), // Number
			num_parking: parseInt(this.state.house.num_parking), // Number
			num_tenant: parseInt(this.state.house.num_tenant), // Number
			additional_tags: this.state.house.additional_tags, // Array of Strings
			bloomfilter: this.bloomfilter
		};

		if (houseToAdd.availability) {
			// If the house is for listing, check required fields. 
			if (houseToAdd.pictures.length < 1) {
				Alert.alert(
					'Please add some pictures',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (houseToAdd.title == "") {
				Alert.alert(
					'Please specify the housing title',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (!_checkPrice()){
				Alert.alert(
					'Please enter a valid price',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (!_checkBedroom()) {
				Alert.alert(
					'Please enter a valid number of bedrooms',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (!_checkBathroom()) {
				Alert.alert(
					'Please enter a valid number of bathrooms',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (!_checkParking()) {
				Alert.alert(
					'Please enter a valid number of parkings',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (houseToAdd.location == "") {
				Alert.alert(
					'Please add an address for the house',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (houseToAdd.description == "") {
				Alert.alert(
					'Add some description... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
		}
		firebase.firestore().collection("houses").doc(this.state.house.id).set(Object.assign({}, houseToAdd), (error) => {
			if (error) {
				Alert.alert(
					'Saving Failed',
					'Please try again later',
					[{text: 'Okay'}],
					{cancelable: false},
				)
			} else {
			}
		}).then(() => {
			this.props.navigation.goBack();
			Alert.alert(
				'House Saved',
				'',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		})
	}

	deleteHouse = () => {
		firebase.firestore().collection("houses").doc(this.state.house.id).delete().then(() => {
			this.props.navigation.goBack();
		}).catch((error) => {
			Alert.alert(
				'Delete Failed',
				'Please try again later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		});
	}

	render = () => {
		var content;
		if (!this.state.house) {
			return (<View></View>);
		}
		//this.saveHouse();

		let item = this.state.house;

		var tenants = [];
		this.state.cur_tenant.forEach((tenant, index) => {
			tenants.push((
				<View key={index} style={{
					padding: '2.5%',
					width: '95%',
					borderBottomColor: '#dddddd',
					borderBottomWidth: 1,
					flexDirection: 'row',
					justifyContent: 'space-between'
				}}>
					<View style={{
							width: '90%',
						}}>
						<UserPreviewView user={tenant}/>
					</View>
					<View style={{
						flexDirection: 'row',
						width: '10%',
						height: 75,
						margin: 5,
						alignItems: 'center'
					}}>
						<TouchableOpacity onPress={() => {this.removeTenant(tenant)}}>
							<Icon name="minus-circle" type="font-awesome"/>
						</TouchableOpacity>
					</View>
				</View>
				
			));
		});
		
		content = (
			<View style={styles.pageContainer}> 
				<View style={styles.imageContainer}>

					<ImageHorizontalScrollView pictureUrls={item.pictures}/>
					<Button title="Add Picture" onPress={this.addPicture}/>

				</View>

				<View style={styles.infoContainer}>

					<View style={styles.bigTitle}>
						<Text style={{fontSize: RF(3.5), fontWeight: '500',}}>Create Your House Profile</Text>
					</View>

					<View style={styles.titleContainer}>
						<Text style={styles.title}>Title:</Text>
						<TextInput
							style={styles.roomTitleText}
							onChangeText={(title) => {item.title = title}}
							defaultValue={item.title}
						/>
					</View>

					<View style={styles.priceContainer}>
						<Text style={styles.priceTitle}>Price:</Text>
						<TextInput
							style={styles.priceTextInput}
							onChangeText={(num) => {item.price = parseInt(num)}}
							defaultValue={item.price.toString()}
							keyboardType="numeric"
						/>
					</View>
				
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="users" type="font-awesome"/>
						<Text style={styles.roomInfoTitle}>How many tenants?</Text>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.num_tenant = parseInt(num)}}
							defaultValue={item.num_tenant.toString()}
							keyboardType="numeric"
						/>
					</View>

					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="bed" type="font-awesome"/>
						<Text style={styles.roomInfoTitle}>How many bedroom?</Text>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.num_bedroom = parseInt(num)}}
							defaultValue={item.num_bedroom.toString()}
							keyboardType="numeric"
						/>
					</View>

					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="bath" type="font-awesome"/>
						<Text style={styles.roomInfoTitle}>How many bathroom?</Text>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.num_bathroom = parseInt(num)}}
							defaultValue={item.num_bathroom.toString()}
							keyboardType="numeric"
						/>
					</View>

					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="car" type="font-awesome"/>
						<Text style={styles.roomInfoTitle}>How many parking?</Text>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.num_parking = parseInt(num)}}
							defaultValue={item.num_parking.toString()}
							keyboardType="numeric"
						/>
					</View>


					<BadgesView tags={item.additional_tags} />

				</View>  
				{/* End before Description */}

				<View style={styles.locationContainer}>
						<Text style={styles.locationTitle}>Location: </Text>
						<TextInput
							style={styles.locationInput}
							multiline={true}
							editable = {true}
							maxLength = {400}
							onChangeText={(loc) => {item.location = loc}}
							defaultValue={item.location.toString()}	
						/>
				</View>
				
				<View style={styles.descriptionContainer}>
					<Text style={styles.descriptionTitle}>Description:</Text>
					<TextInput
						style={styles.descriptionInput}
						multiline={true}
						editable = {true}
						maxLength = {400}
						onChangeText={(text) => {item.description = text}}
						defaultValue = {item.description}
					/>
				</View>
				
				<View style={styles.tenantsContainer}>
					<Text style={styles.tenantsTitle}>Current Tenants:</Text>
					<View>
						{tenants}
					</View>
					<Button title="Add Tenants" onPress={this.addTenant}/>
				</View>

				<View style={styles.findButtonContainer}>
					<View style={styles.findButton}>
						<Text style={styles.findText}>Post this house for others to view: </Text>
						<Switch
							onValueChange={() => {this.state.house.availability = !this.state.house.availability; this.forceUpdate()}}
							value={this.state.house.availability}
						/>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<View style={styles.saveButton}>
						<Button title="Save House" color='white' onPress={this.saveHouse}/>
					</View>
					<View style={styles.deleteButton}>
						<Button title="Delete" color='white' onPress={this.deleteHouse}/>
					</View>
				</View>

			</View>
			
		);

		return (
			<SafeAreaView style={{flex: 1}} forceInset={{top: 'never'}}>
				<KeyboardAwareScrollView style={{flex: 1}}>
					{content}
				</KeyboardAwareScrollView>
      		</SafeAreaView>
		);
	}

}

const {width, height, scale} = Dimensions.get('window');

const styles = StyleSheet.create({

	imageContainer: {
	},

	pageContainer: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f7f7f7',
		alignItems: "stretch",
	},

	pictureContainer: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f7f7f7',
		alignItems: "stretch",
	},

	infoContainer:{
		paddingLeft: RF(1.5),
		paddingRight: RF(1.5),
		paddingTop: RF(1),
	},

	bigTitle:{
		flexDirection: 'row',
		justifyContent: 'flex-start',
		paddingBottom: 5,
	},

	titleContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		paddingBottom: 8,
	},

	title: {
		fontSize: RF(3),
		paddingRight: 5,
		fontWeight: '300',
	},

	roomTitleText: {
		fontWeight: '400',
		fontSize: RF(3),
		borderWidth: 1,
		borderRadius: 5,
		width: 0.7 * width,
		backgroundColor: 'white',
		paddingLeft: 2,
	},

	priceContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		paddingBottom: 8,
	},

	priceTitle: {
		fontSize: RF(3),
		paddingRight: 5,
		fontWeight: '300',
	},

	priceTextInput:{
		paddingTop: 1,
		paddingLeft: 2,
		width: 0.2 * width,
		fontSize: RF(3), 
		borderWidth: 1,
		borderRadius: 5,
		backgroundColor: 'white',
		color: '#2ea9df',
	},

	roomInfoSpecDetailsView: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingBottom: 8,
	},

	roomInfoTitle: {
		fontSize: RF(3),
		paddingRight: 5,
		paddingLeft: 5,
		fontWeight: '300',
	},

	roomInfoSpecDetailsTextInput: {
		flex: 1,
		fontWeight: '200',
		fontSize: RF(3),
		borderWidth: 1,
		borderRadius: 5,
		width: 0.3 * width,
		backgroundColor: 'white',
		paddingLeft: 2,
	},

	descriptionContainer: {
		paddingLeft: RF(1.5),
		paddingRight: RF(1.5),
		paddingBottom: RF(1.5),
	},

	locationContainer: {
		paddingLeft: RF(1.5),
		paddingRight: RF(1.5),
		paddingBottom: RF(1.5),
	},

	tenantsContainer: {
		paddingLeft: RF(1.5),
		paddingRight: RF(1.5),
		paddingBottom: RF(1),
	},

	descriptionTitle: {
		fontSize: RF(3),
		fontWeight: '300',
	},

	locationTitle: {
		fontSize: RF(3),
		fontWeight: '300',
	},

	tenantsTitle: {
		fontSize: RF(3),
		fontWeight: '300',
	},

	descriptionInput: {
		borderWidth: 1,
		borderRadius: 5,
		height: 0.2 * height,
	},

	locationInput: {
		borderWidth: 1,
		borderRadius: 5,
		height: 0.2 * height,
	},


	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingBottom: 10,
		paddingTop: 5,
		paddingRight: 10,
	},

	findButtonContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},

	findButton: {
		flexDirection: 'row',
		paddingTop: 8,
	},

	findText:{
		paddingTop: 2,
		fontSize: RF(2.5),
	},

	saveButton: {
		backgroundColor: '#2ea9df',
		color: 'white',
		borderRadius: 10,
		marginLeft: 3,
		marginRight: 3,
	},

	cancelButton: {
		backgroundColor: '#f17c67',
		color: 'white',
		borderRadius: 10,
		marginLeft: 3,
		marginRight: 3,
	},

	deleteButton: {
		backgroundColor: '#ff4444',
		color: 'white',
		borderRadius: 10,
		marginLeft: 3,
		marginRight: 3,
	},
})