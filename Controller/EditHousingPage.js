// This page will be displayed to allow user to add a house listing or edit a current one. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';


export default class AddHousingPage extends React.Component{
	state = {
		housingItems: null,
		cur_tenant: []
	}

	constructor() {
		super();
		
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

	removeTenant = (tenantId) => {

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
		
		if (this.state.house) {
			return (<View></View>);
		}

		let item = this.state.house;

		var tenants = [];
		this.state.house.cur_tenant.
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
					<Button onPress={this.removeTenant(tenant.id)}>Remove this tenant</Button>
				</View>
				
			));
		});
		
		content = (
			<View style={{
					backgroundColor: 'white',
					alignItems: "stretch",
					marginBottom: 10,
					padding: 5
			}}>
				<ImageHorizontalScrollView pictureUrls={item.pictures}/>
				<Button>Add Picture</Button>

				<View>
					<View style={styles.roomTitleView}>
						<Text style={styles.roomTitleText}>{item.filters_house.title}</Text>
						<Icon name="star" type="font-awesome"/>
					</View>
				
					<View style={styles.roomInfoView}>
						<View style={styles.roomInfoLeftView}>
							<View style={styles.roomInfoLeftSpecsView}>
								<View style={styles.roomInfoLeftSpecDetailsView}>
									<Icon name="users" type="font-awesome"/>
									<Text>  {item.filters_house.num_tenant} Tenants</Text>
								</View>
								<View style={styles.roomInfoLeftSpecDetailsView}>
									<Icon name="bed" type="font-awesome"/>
									<Text>  {item.filters_house.num_bedroom} Bedrooms</Text>
								</View>
								<View style={styles.roomInfoLeftSpecDetailsView}>
									<Icon name="bath" type="font-awesome"/>
									<Text>  {item.filters_house.num_bathroom} Bathrooms</Text>
								</View>
								<View style={styles.roomInfoLeftSpecDetailsView}>
									<Icon name="car" type="font-awesome"/>
									<Text>  {item.filters_house.num_parking} Parkings</Text>
								</View>
							</View>
							<BadgesView tags={item.filters_house.additional_tags} />
						</View>
					</View>
				</View>

				<View
					style={{
						borderBottomColor: 'black',
						borderBottomWidth: 1,
						margin: 10
					}}
				>
				</View>
				
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
				<Button>Add Tenants</Button>
				<Text style={{fontSize: RF(2.5), color: 'rgb(50, 150, 255)'}}>{"$ " + item.filters_house.price}</Text>
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
	roomTitleView: {
		margin: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	roomTitleText: {
		fontSize: RF(2.5), 
		fontWeight: 'bold'
	},
	roomInfoView: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	roomInfoLeftView: {
		flex: 2
	},
	roomInfoRightView: {
		flex: 1
	},
	roomInfoRightImage: {
		flex: 9,
		margin: 5
	},
	roomInfoRightNameText: {
		flex: 1,
		margin: 5
	},
	roomInfoLeftSpecsView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 5,
		marginBottom: 5
	},
	roomInfoLeftSpecDetailsView: {
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