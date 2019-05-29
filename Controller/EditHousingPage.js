// This page will be displayed to allow user to add a house listing or edit a current one. 

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, Alert, FlatList, TouchableHighlight, ScrollView, TextInput, Dimensions, Overlay, ActivityIndicator, Switch } from 'react-native';
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

export default class EditHousingPage extends React.Component{
	state = {
		cur_tenant: [],
		txtInput: "",
		first_save: true
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

	saveHouse = () => {
		var bf = require("./bloomfilter"),
        bloom=bf.BloomFilter;
        this.f = new bloom(32*256,16);
		this.splitText(this.f, this.state.house.landlord);
		this.splitText(this.f, this.state.house.cur_tenant);
		this.splitText(this.f, this.state.house.availability);
		this.splitText(this.f, this.state.house.title.toString());
		this.splitText(this.f, this.state.house.description);
		this.splitText(this.f, this.state.house.location);
		this.splitText(this.f, this.state.house.price);
		this.splitText(this.f, this.state.house.num_bedroom);
		this.splitText(this.f, this.state.house.num_bathroom);
		this.splitText(this.f, this.state.house.num_parking);
		this.splitText(this.f, this.state.house.num_tenant);
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
			post_date: this.state.first_save ? this.state.house.post_date : firebase.firestore.Timestamp.now(), // Timestamp
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
					'Add some pictures... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (houseToAdd.title == "") {
				Alert.alert(
					'Add some title... ',
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
			if (houseToAdd.location == "") {
				Alert.alert(
					'Add some location... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (houseToAdd.num_bedroom == "") {
				Alert.alert(
					'Add some bedrooms... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (houseToAdd.num_bathroom == "") {
				Alert.alert(
					'Add some bathrooms... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
		}

		if (this.state.house.id == "") {
			// Add a house, house does not exist in firebase, use add. 
			firebase.firestore().collection("houses").add(Object.assign({}, houseToAdd))
			.then((docRef) => {
				this.state.house.id = docRef.id;
				Alert.alert(
					'House Created',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				this.state.first_save = false;
			})
			.catch((error) => {
				Alert.alert(
					'House Creation Failed',
					'Please try again later',
					[{text: 'Okay'}],
					{cancelable: false},
				)
			});
		} else {
			// Edit a house, house exists in firebase, use set. 
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
				if (!this.state.first_save) {
					Alert.alert(
						'House Saved',
						'',
						[{text: 'Okay'}],
						{cancelable: false},
					)
				}
				this.state.first_save = false;
			})
		}
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
		this.saveHouse();

		let item = this.state.house;

		var tenants = [];
		this.state.cur_tenant.forEach((tenant) => {
			tenants.push((
				<View key={tenant.id}>
					<Image
						key={tenant.profileimage}
						source={{url: tenant.profileimage, cache: 'force-cache'}}
						style={{
							height: 200
						}}
					/>
					<Text>{tenant.first_name} {tenant.last_name}</Text>
					<Button title="Remove this tenant" onPress={() => {this.removeTenant(tenant)}}/>
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

					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="pin" type="font-awesome"/>
						<Text style={styles.roomInfoTitle}>Location: </Text>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(loc) => {item.location = loc}}
							defaultValue={item.location.toString()}
							keyboardType="default"
						/>
					</View>

					<BadgesView tags={item.additional_tags} />

				</View>  
				{/* End before Description */}
				
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
				
				<View style={{borderWidth: 1,}}>
					<Text>Current Tenants</Text>
					<View>
						{tenants}
					</View>
					<Button title="Add Tenants" onPress={this.addTenant}/>
				</View>

				<View style={styles.buttonContainer}>
					<View>
						<Text>Posted For View: </Text>
						<Switch
							onValueChange={() => {this.state.house.availability = !this.state.house.availability; this.forceUpdate()}}
							value={this.state.house.availability}
						/>
					</View>
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
			<SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7',}}>
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
		borderWidth: 1,
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
		borderWidth: 1,
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
		borderWidth: 1,
		paddingLeft: RF(1.5),
		paddingRight: RF(1.5),
		paddingBottom: RF(1),
	},

	descriptionTitle: {
		fontSize: RF(3),
		fontWeight: '300',
	},

	descriptionInput: {
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
		borderWidth: 1,
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