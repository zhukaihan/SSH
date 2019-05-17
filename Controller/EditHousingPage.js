// This page will be displayed to allow user to add a house listing or edit a current one. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, FlatList, TouchableHighlight, ScrollView, TextInput } from 'react-native';
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
		cur_tenant: []
	}

	getTenants = (house) => {
		this.setState({
			cur_tenant: []
		});
		house.cur_tenant.forEach((ref) => {
			ref.get().then(user => {
				var cur_tenant = this.state.cur_tenant;
				cur_tenant.push(new User(user.data(), user.id));
				this.setState({
					cur_tenant: cur_tenant
				});
			}).catch((e) => {
			});
		});
	}

	removeTenant = (tenant) => {

	}

	addTenant = () => {

	}

	addPicture = () => {
		
	}

	formatFields() {
		this.state.house.filters_house.price = parseInt(this.state.house.filters_house.price);
		this.state.house.filters_house.num_bedroom = parseInt(this.state.house.filters_house.num_bedroom);
		this.state.house.filters_house.num_bathroom = parseInt(this.state.house.filters_house.num_bathroom);
		this.state.house.filters_house.num_parking = parseInt(this.state.house.filters_house.num_parking);
		this.state.house.filters_house.num_tenant = parseInt(this.state.house.filters_house.num_tenant);
	}

	componentWillMount() {
		let houseId = this.props.navigation.getParam("houseId", "")
		if (houseId != "") {
			// Get existing house. 
			House.getHouseWithID(houseId, (house) => {
				this.setState({
					house: house
				});
				this.getTenants(house);
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

	render = () => {
		var content;
		
		if (!this.state.house) {
			return (<View></View>);
		}

		let item = this.state.house;

		var tenants = [];
		this.state.cur_tenant.forEach((tenant) => {
			tenants.push((
				<View>
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
		
		content = (
			<View>
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
						value={item.filters_house.title}
					/>
				
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="users" type="font-awesome"/>
						<TextInput
							onChangeText={(num) => {item.filters_house.num_tenant = num}}
							value={item.filters_house.num_tenant.toString()}
							keyboardType="numeric"
						/>
						<Text>Tenants</Text>
					</View>
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="bed" type="font-awesome"/>
						<TextInput
							onChangeText={(num) => {item.filters_house.num_bedroom = num}}
							value={item.filters_house.num_bedroom.toString()}
							keyboardType="numeric"
						/>
						<Text>Bedrooms</Text>
					</View>
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="bath" type="font-awesome"/>
						<TextInput
							onChangeText={(num) => {item.filters_house.num_bathroom = num}}
							value={item.filters_house.num_bathroom.toString()}
							keyboardType="numeric"
						/>
						<Text>Bathrooms</Text>
					</View>
					<View style={styles.roomInfoSpecDetailsView}>
						<Icon name="car" type="font-awesome"/>
						<TextInput
							onChangeText={(num) => {item.filters_house.num_parking = num}}
							value={item.filters_house.num_parking.toString()}
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
					onChangeText={(num) => {item.filters_house.price = num}}
					value={item.filters_house.price.toString()}
					keyboardType="numeric"
				/>
				
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
		width: '45%',
		marginLeft: '2.5%',
		marginRight: '2.5%',
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
})