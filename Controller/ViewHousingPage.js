import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Icon, Image, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';
import HouseFavButton from '../View/HouseFavButton';
import UserPreviewView from '../View/UserPreviewView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class ViewHousingPage extends React.Component{
	state = {
		housingItems: null,
		cur_tenant: [],
		landlord: new User()
	}

	constructor() {
		super();
		
	}

	componentDidMount = async () => {
		let houseId = this.props.navigation.getParam("houseId", "");
		if (houseId != "") {
			this.housesRef = firebase.firestore().collection("houses").doc(houseId);
			House.getHouseWithID(houseId, (house) => {
				this.setState({
					house: house
				});

				house.landlord.get().then(user => {
					let landlord = new User(user.data(), user.id);
					this.setState({
						landlord: landlord
					});
				}).catch((e) => {
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
			})
		} else {
			this.setState({
				house: new House("", {})
			})
		}

		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
		})
	}

	openTenant = (user) => {
		this.props.navigation.navigate("ProfilePage", {
			userId: user.id
		})
	}

	render = () => {
		var content;
		
		if (this.state.house) {
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
							<UserPreviewView user={tenant} onPress={this.openTenant}/>
						</View>
					</View>
					
				));
			});
			

			content = (
				<View style={{flex: 1}}>
					<ImageHorizontalScrollView pictureUrls={item.pictures} height={275}/>
					<View style={{
							backgroundColor: 'white',
							alignItems: "stretch",
							marginBottom: 10,
							padding: 10
					}}>

						<View>
							<View style={styles.roomTitleView}>
								<Text style={styles.roomTitleText}>{item.title}</Text>
								<HouseFavButton house={item}/>
							</View>
						
							<View style={styles.roomInfoView}>
								<View style={styles.roomInfoLeftView}>
									<View style={styles.roomInfoLeftSpecsView}>
										<View style={styles.roomInfoLeftSpecDetailsView}>
											<Icon name="users" type="font-awesome"/>
											<Text>  {item.num_tenant} Tenants</Text>
										</View>
										<View style={styles.roomInfoLeftSpecDetailsView}>
											<Icon name="bed" type="font-awesome"/>
											<Text>  {item.num_bedroom} Bedrooms</Text>
										</View>
										<View style={styles.roomInfoLeftSpecDetailsView}>
											<Icon name="bath" type="font-awesome"/>
											<Text>  {item.num_bathroom} Bathrooms</Text>
										</View>
										<View style={styles.roomInfoLeftSpecDetailsView}>
											<Icon name="car" type="font-awesome"/>
											<Text>  {item.num_parking} Parkings</Text>
										</View>
									</View>
									<BadgesView tags={item.additional_tags} />
								</View>
								<TouchableOpacity style={styles.roomInfoRightView} onPress={() => this.openTenant(this.state.landlord)}>
									{this.state.landlord.profileimage != "" ?
										(<Avatar
											rounded
											source={{uri: this.state.landlord.profileimage, cache: 'force-cache'}}
											style={styles.roomInfoRightImage}
										/>) : 
										(<View style={styles.roomInfoRightImage}></View>)
									}
									
									<Text style={styles.roomInfoRightNameText}>{this.state.landlord.first_name} {this.state.landlord.last_name}</Text>
								</TouchableOpacity>
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
						
						<View style = {styles.descriptionView}>
							<Text style={{fontSize: RF(3)}}>Description</Text>
							<Text style={{fontSize: RF(2.25)}}>{item.description}</Text>
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
							<Text style={{fontSize: RF(3), margin: 15}}>Current Tenants</Text>
							<View>
								{tenants}
							</View>
						</View>
						<Text style={{fontSize: RF(2.5), color: 'rgb(50, 150, 255)', margin: 15}}>{"$ " + item.price}</Text>
					</View>
				</View>
			);
		}

		return (
			<SafeAreaView style={{flex: 1}} forceInset={{top: 'never'}}>
				<KeyboardAwareScrollView style={{flex: 1}}>
					{content}
				</KeyboardAwareScrollView>
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
		aspectRatio: 1,
		margin: 5
	},
	roomInfoRightNameText: {
		flex: 1,
		margin: 5
	},
	roomInfoLeftSpecsView: {
		flexDirection: 'column',
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
	},

	descriptionView: {
		textAlign: 'left',
		margin: 15
	}
})