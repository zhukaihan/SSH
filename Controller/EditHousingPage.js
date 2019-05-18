// This page will be displayed to allow user to add a house listing or edit a current one. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, Alert, FlatList, TouchableHighlight, ScrollView, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';

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
			})
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

	addPicture = () => {
		// Display a view to upload image and add the url of the image to house.pictures. 
		
	}

	saveHouse = () => {
		var houseToAdd = {
			landlord: this.state.house.landlord, // Firebase Reference
			cur_tenant: this.state.house.cur_tenant, // Array of Firebase References
			pictures: this.state.house.pictures, // Array of Strings
			availability: this.state.house.availability, // String?
			post_date: firebase.firestore.Timestamp.now(), // Timestamp
			filters_house: {
				title: this.state.house.filters_house.title.toString(), // String
				location: this.state.house.filters_house.location, // String?
				price: parseInt(this.state.house.filters_house.price), // Number
				num_bedroom: parseInt(this.state.house.filters_house.num_bedroom), // Number
				num_bathroom: parseInt(this.state.house.filters_house.num_bathroom), // Number
				num_parking: parseInt(this.state.house.filters_house.num_parking), // Number
				num_tenant: parseInt(this.state.house.filters_house.num_tenant), // Number
				additional_tags: this.state.house.filters_house.additional_tags // Array of Strings
			}
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
					'Please try agian later',
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
						'Please try agian later',
						[{text: 'Okay'}],
						{cancelable: false},
					)
				}
			})
		}
	}

	deleteHouse = () => {
		firebase.firestore().collection("houses").doc(this.state.house.id).delete().then(() => {
			this.props.navigation.goBack();
		}).catch(function(error) {
			Alert.alert(
				'Delete Failed',
				'Please try agian later',
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
			<View>
				<Button title="Save House" onPress={this.saveHouse}/>
				<View style={{
					backgroundColor: 'white',
					alignItems: "stretch",
					marginBottom: 10,
					padding: 5
				}}>
					<ImageHorizontalScrollView pictureUrls={item.pictures}/>
					<Button title="Add Picture" onPress={this.addPicture}/>

					<TextInput
						style={styles.roomTitleText}
						onChangeText={(title) => {item.filters_house.title = title}}
						defaultValue={item.filters_house.title}
					/>
				
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="users" type="font-awesome"/>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.filters_house.num_tenant = parseInt(num)}}
							defaultValue={item.filters_house.num_tenant.toString()}
							keyboardType="numeric"
						/>
						<Text>Tenants</Text>
					</View>
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="bed" type="font-awesome"/>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.filters_house.num_bedroom = parseInt(num)}}
							defaultValue={item.filters_house.num_bedroom.toString()}
							keyboardType="numeric"
						/>
						<Text>Bedrooms</Text>
					</View>
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="bath" type="font-awesome"/>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.filters_house.num_bathroom = parseInt(num)}}
							defaultValue={item.filters_house.num_bathroom.toString()}
							keyboardType="numeric"
						/>
						<Text>Bathrooms</Text>
					</View>
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="car" type="font-awesome"/>
						<TextInput
							style={styles.roomInfoSpecDetailsTextInput}
							onChangeText={(num) => {item.filters_house.num_parking = parseInt(num)}}
							defaultValue={item.filters_house.num_parking.toString()}
							keyboardType="numeric"
						/>
						<Text>Parkings</Text>
					</View>
				</View>
				<BadgesView tags={item.filters_house.additional_tags} />
				
				<View>
					<Text>Description</Text>
					<Text>{item.filters_house.title}</Text>{/*NEED TO CHANGE WITH DATABASE*/}
				</View>
				
				<View>
					<Text>Current Tenants</Text>
					<View>
						{tenants}
					</View>
				</View>
				<Button title="Add Tenants" onPress={this.addTenant}/>
				<TextInput
					style={{fontSize: RF(2.5), color: 'rgb(50, 150, 255)'}}
					onChangeText={(num) => {item.filters_house.price = parseInt(num)}}
					defaultValue={item.filters_house.price.toString()}
					keyboardType="numeric"
				/>
				
				{deleteButton}
			</View>
			
		);

		return (
			<SafeAreaView style={{flex: 1}}>
				<ScrollView style={{flex: 1}}>
					{content}
				</ScrollView>
      </SafeAreaView>
		);
	}

}

const styles = StyleSheet.create({
	roomTitleText: {
		fontSize: RF(2.5), 
		fontWeight: 'bold'
	},
	roomInfoSpecDetailsView: {
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	roomInfoSpecDetailsTextInput: {
		borderWidth: 1,
		width: "50%",
		marginLeft: 10,
		marginRight: 10
	}
})