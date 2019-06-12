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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { Fumi } from 'react-native-textinput-effects';

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
			return !(value === pictureUrl);
		});
		this.state.house.pictures = filtered;
		firebase.firestore().collection("houses").doc(this.state.house.id).set({
			pictures: firebase.firestore.FieldValue.arrayRemove(pictureUrl), 
		}, {merge: true}).then(() => {
			Alert.alert(
				'Picture Removed',
				'It might take some time for changes to reflect. ',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		})
		this.forceUpdate();
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
			firebase.firestore().collection("houses").doc(this.state.house.id).set({
				pictures: firebase.firestore.FieldValue.arrayUnion(url), 
			}, {merge: true}).then(() => {
				Alert.alert(
					'Picture Saved',
					'It might take some time to show up. ',
					[{text: 'Okay'}],
					{cancelable: false},
				)
			})
			this.forceUpdate();
		})
	}

	splitText = (bloomfilter, props) =>{
		var item = props.toString().toUpperCase();
		var text = item.split(" ");
		for(var i = 0; i < text.length; i++){
			bloomfilter.add(text[i]);
		}
	}
	_checkBedroom = (house) => {
		for(var i = 0; i <= 10; i++){
			if(house.num_bedroom == i){
				return true;
			}
		}
		return false;
	}
	
	_checkBathroom = (house) => {
		for(var i = 0; i <= 10; i++){
			if(house.num_bathroom == i){
				return true;
			}
		}
		return false;
	}

	_checkPrice = (house) => {
		return (house.price >= 0 && house.price <= 10000);
	}
	_checkParking = (house) => {
		for(var i = 0; i <= 10; i++){
			if(house.num_parking == i){
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
			if (!this._checkPrice(houseToAdd)){
				Alert.alert(
					'Please enter a valid price',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (!this._checkBedroom(houseToAdd)) {
				Alert.alert(
					'Please enter a valid number of bedrooms',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (!this._checkBathroom(houseToAdd)) {
				Alert.alert(
					'Please enter a valid number of bathrooms',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (!this._checkParking(houseToAdd)) {
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
							<Icon name="minus-circle" type="font-awesome" color="#ff4444"/>
						</TouchableOpacity>
					</View>
				</View>
				
			));
		});
		
		content = (
			<View style={styles.pageContainer}> 
				<View style={styles.imageContainer}>

					<ImageHorizontalScrollView pictureUrls={item.pictures} height={275} ref={(ref) => {this.imageScrollViewRef = ref}}/>

				</View>

				<View style={styles.pictureButtons}>
					<TouchableOpacity onPress={this.addPicture} style={styles.addPictureButton}>
						<Text style={{color: 'white', fontSize: RF(2.2), textAlign: 'center'}}>Add Picture</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {this.removePicture(item.pictures[this.imageScrollViewRef.getCurPagingIndex()])}}
						style={{...styles.removePictureButton, backgroundColor: item.pictures.length == 0 ? 'grey' : '#ff4444'}}
						disabled={item.pictures.length == 0}>
						<Text style={{color: 'white', fontSize: RF(2.2), textAlign: 'center'}}>Remove This Picture</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Basic Information: </Text>

					<Fumi
						label={'Title'}
						iconClass={MaterialsIcon}
						iconName={'title'}
						iconColor={'#1e99cf'}
						iconSize={20}
						iconWidth={40}
						inputPadding={16}
						inputStyle={{ color: 'black' }}
						onChangeText={(title) => {item.title = title}}
						defaultValue={item.title}
					/>
					<Fumi
						label={'Price'}
						iconClass={MaterialsIcon}
						iconName={'attach-money'}
						iconColor={'#1e99cf'}
						iconSize={20}
						iconWidth={40}
						inputPadding={16}
						inputStyle={{ color: 'black' }}
						onChangeText={(num) => {item.price = parseInt(num)}}
						defaultValue={item.price == 0 ? "" : item.price.toString()}
						keyboardType="numeric"
					/>
					<Fumi
						label={'How many tenants?'}
						iconClass={FontAwesomeIcon}
						iconName={'users'}
						iconColor={'#1e99cf'}
						iconSize={20}
						iconWidth={40}
						inputPadding={16}
						inputStyle={{ color: 'black' }}
						onChangeText={(num) => {item.num_tenant = parseInt(num)}}
						defaultValue={item.num_tenant == 0 ? "" : item.num_tenant.toString()}
						keyboardType="numeric"
					/>
					<Fumi
						label={'How many bedroom?'}
						iconClass={FontAwesomeIcon}
						iconName={'bed'}
						iconColor={'#1e99cf'}
						iconSize={20}
						iconWidth={40}
						inputPadding={16}
						inputStyle={{ color: 'black' }}
						onChangeText={(num) => {item.num_bedroom = parseInt(num)}}
						defaultValue={item.num_bedroom == 0 ? "" : item.num_bedroom.toString()}
						keyboardType="numeric"
					/>
					<Fumi
						label={'How many bathroom?'}
						iconClass={FontAwesomeIcon}
						iconName={'bath'}
						iconColor={'#1e99cf'}
						iconSize={20}
						iconWidth={40}
						inputPadding={16}
						inputStyle={{ color: 'black' }}
						onChangeText={(num) => {item.num_bathroom = parseInt(num)}}
						defaultValue={item.num_bathroom == 0 ? "" : item.num_bathroom.toString()}
						keyboardType="numeric"
					/>
					<Fumi
						label={'How many parking?'}
						iconClass={FontAwesomeIcon}
						iconName={'car'}
						iconColor={'#1e99cf'}
						iconSize={20}
						iconWidth={40}
						inputPadding={16}
						inputStyle={{ color: 'black' }}
						onChangeText={(num) => {item.num_parking = parseInt(num)}}
						defaultValue={item.num_parking == 0 ? "" : item.num_parking.toString()}
						keyboardType="numeric"
					/>


					{/* <BadgesView tags={item.additional_tags} /> */}

				</View>  
				{/* End before Description */}

				<View style={styles.sectionContainer}>
						<Text style={styles.sectionTitle}>Describe the Location: </Text>
						<TextInput
							style={styles.locationInput}
							multiline={true}
							editable = {true}
							maxLength = {400}
							onChangeText={(loc) => {item.location = loc}}
							defaultValue={item.location.toString()}	
						/>
				</View>
				
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Describe your House:</Text>
					<TextInput
						style={styles.descriptionInput}
						multiline={true}
						editable = {true}
						maxLength = {400}
						onChangeText={(text) => {item.description = text}}
						defaultValue = {item.description}
					/>
				</View>
				
				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Current Tenants:</Text>
					<View>
						{tenants}
					</View>

					<View style={{paddingTop: 2,}}>	
						<Icon name="plus-circle" onPress={this.addTenant} type="font-awesome" color='#2ea9df' size={40}/>
					</View>
				</View>

				<View style={styles.sectionContainer}>
					<Text style={styles.sectionTitle}>Post this house: </Text>
					<View style={styles.findButton}>
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
		backgroundColor: 'white',
		alignItems: "stretch",
	},

	pictureContainer: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f7f7f7',
		alignItems: "stretch",
	},

	pictureButtons: {
		width: '100%',
		flexDirection: 'row',

	},

	addPictureButton:{
		backgroundColor: '#2ea9df',
		padding: 5,
		flex: .5
	},

	removePictureButton:{
		// backgroundColor is set inline. 
		padding: 5,
		flex: .5
	},

	infoContainer:{
		paddingLeft: RF(1.5),
		paddingRight: RF(1.5),
		paddingBottom: RF(1),
	},

	infotitle: {
		fontSize: RF(2.75),
		fontWeight: 'bold',
		color: 'grey',
		paddingTop: 10,
		paddingBottom: 10
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

	sectionContainer: {
		paddingLeft: RF(1.5),
		paddingRight: RF(1.5),
		paddingTop: RF(3),
		paddingBottom: RF(3),
		borderBottomColor: 'grey',
		borderBottomWidth: 1
	},

	sectionTitle: {
		fontSize: RF(2.75),
		fontWeight: 'bold',
		color: 'grey',
		paddingTop: 10,
		paddingBottom: 10
	},

	descriptionInput: {
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 2,
		height: 0.3 * height,
		padding: 10
	},

	locationInput: {
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 2,
		height: 0.2 * height,
		padding: 10
	},

	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingBottom: 10,
		paddingTop: 8,
		paddingRight: 10,
	},

	findButtonContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: RF(1.5),
	},

	findButton: {
		flexDirection: 'row',
		paddingTop: 8,
	},

	findText:{
		fontSize: RF(2.75),
		fontWeight: 'bold',
		color: 'grey',
		paddingTop: 10,
		paddingBottom: 10
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