// This page will be displayed to allow user to add a house listing or edit a current one. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, Alert, FlatList, TouchableHighlight, ScrollView, TextInput, Dimensions, Overlay, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
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
		txtInput: ""
	}

	componentWillMount() {
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
		this.setState({
			isUploadingPicture: true
		})
		if (!this.state.house) {
			return;
		}
		if (this.state.house.id == "") {
			this.saveHouse();
		}
		ImageUploader.chooseImageToUpload(`houses/${this.state.house.id}/images`, (url) => {
			this.state.house.pictures.push(url);
			this.saveHouse();
			this.setState({
				isUploadingPicture: false
			});
		})
	}

	splitText(bloomfilter, props){
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
			availability: this.state.house.availability, // String?
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

		if (this.state.house.id == "") {
			// Add a house, house does not exist in firebase, use add. 
			firebase.firestore().collection("houses").add(Object.assign({}, houseToAdd))
			.then((docRef) => {
				this.state.house.id = docRef.id;
			})
			.catch((error) => {
				Alert.alert(
					'Saving Failed',
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
						source={{url: tenant.profileimage}}
						style={{
							height: 200
						}}
					/>
					<Text>{tenant.first_name} {tenant.last_name}</Text>
					<Button title="Remove this tenant" onPress={() => {this.removeTenant(tenant)}}/>
				</View>
				
			));
		});

		var deleteButton;
		if (this.state.house.id != "") {
			deleteButton = (<Button title="Delete this house" onPress={this.deleteHouse}/>)
		}
		
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
					<View style={styles.saveButton}>
						<Button title="Save House" color='white' onPress={this.saveHouse}/>
					</View>
					<View style={styles.cancelButton}>
						<Button title="Cancel" color='white' onPress={this.saveHouse}/>
					</View>
				</View>

			</View>
			
		);

		return (
			<SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7',}}>
				{/* <Overlay isVisible={this.state.isUploadingPicture}>
					<ActivityIndicator size="large" color="#0000ff" />
				</Overlay> */}
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
})