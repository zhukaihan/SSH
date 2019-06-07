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
import Placeholder, { Line, Media } from "rn-placeholder";
import MessageCenter from './MessageCenter';

import { getStatusBarHeight } from 'react-native-iphone-x-helper'


export default class ViewHousingPage extends React.Component{
	static navigationOptions = ({ navigation }) => ({
		header: null,
		headerBackTitleStyle: {
			color: 'white',
			fontWeight: 'bold'
		},
		headerTransparent: true
	});

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
		if (firebase.auth().currentUser.uid == user.id){
			this.props.navigation.navigate("EditMyProfilePage", {
				userId: user.id
			})}
		else{
			this.props.navigation.navigate("ProfilePage", {
				userId: user.id
			})
		}
	}

	goBack = () => {
		this.props.navigation.goBack();
	}

	render = () => {
		var content;
		var bottomBar;
		var imageView;
		var titleView;
		
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

			bottomBar = (
				<View style={{
					bottom: 0,
					left: 0,
					width: "100%",
					height: 50,
					flexDirection: 'row',
					justifyContent: 'space-between',
					backgroundColor: '#e7e7e7'
				}}>
					<Text
						style={{
							height: "100%",
							fontSize: RF(2.5), 
							color: '#2ea9df', 
							padding: 15, 
							textAlign: 'right',
							fontWeight: 'bold',
						}}
					>
						{"$ " + item.price} / Month
					</Text>
					<TouchableOpacity 
						style={{
							justifyContent: 'center', 
							height: "100%", 
							backgroundColor: '#2EA9DF',
							padding: 15,
						}}
						onPress={() => {MessageCenter.createRoomWith(this.props.navigation, this.state.landlord)}}
					>
						<Text style={{color: "white", fontSize: RF(2.25)}}>Message {this.state.landlord.name_preferred ? this.state.landlord.name_preferred : this.state.landlord.first_name}</Text>
					</TouchableOpacity>
				</View>
			)
			

			imageView = (<ImageHorizontalScrollView pictureUrls={item.pictures} height={275}/>)

			// Aware of stickeyHeaderIndicies style issue. 
			// https://stackoverflow.com/questions/49149045/why-is-flexdirection-not-working-when-view-is-placed-in-a-scrollview-for-react-n
			titleView = (
				<View>
					<View style={{...styles.roomTitleView, paddingTop: getStatusBarHeight() + RF(1), paddingBottom: RF(1)}}>
						<TouchableOpacity onPress={this.goBack} style={{...styles.roomIcons, alignItems: 'flex-start'}}>
							<Icon name="chevron-left" type="fontawesome" color="#2ea9df" size={40}/>
						</TouchableOpacity>
						<Text style={styles.roomTitleText}>{item.title}</Text>
						<View style={styles.roomIcons}>
							<HouseFavButton house={item}/>
						</View>
					</View>
				</View>
			)
			content = (
				<View style={{flex: 1}}>
					
					
					
					<View style={{
							backgroundColor: 'white',
							alignItems: "stretch",
							marginBottom: 10,
							padding: 10
					}}>

						<View style={styles.roomInfoView}>
							<View style={styles.roomInfoLeftView}>
								<View style={styles.roomInfoLeftSpecsView}>
									<View style={styles.roomInfoLeftSpecDetailsView}>
										<View style={styles.roomInfoLeftSpecDetailsIconView}>
											<Icon name="users" type="font-awesome" color="#1E89CF"/>
										</View>
										<Text style={styles.roomInfoLeftSpecDetailsTextView}>{item.num_tenant}</Text>
										<Text> Tenants</Text>
									</View>
									<View style={styles.roomInfoLeftSpecDetailsView}>
										<View style={styles.roomInfoLeftSpecDetailsIconView}>
											<Icon name="bed" type="font-awesome" color="#1E89CF"/>
										</View>
										<Text style={styles.roomInfoLeftSpecDetailsTextView}>{item.num_bedroom}</Text>
										<Text> Bedrooms</Text>
									</View>
									<View style={styles.roomInfoLeftSpecDetailsView}>
										<View style={styles.roomInfoLeftSpecDetailsIconView}>
											<Icon name="bath" type="font-awesome" color="#1E89CF"/>
										</View>
										<Text style={styles.roomInfoLeftSpecDetailsTextView}>{item.num_bathroom}</Text>
										<Text> Bathrooms</Text>
									</View>
									<View style={styles.roomInfoLeftSpecDetailsView}>
										<View style={styles.roomInfoLeftSpecDetailsIconView}>
											<Icon name="car" type="font-awesome" color="#1E89CF"/>
										</View>
										<Text style={styles.roomInfoLeftSpecDetailsTextView}>{item.num_parking}</Text>
										<Text> Parkings</Text>
									</View>
								</View>
								<BadgesView tags={item.additional_tags} />
							</View>
							<TouchableOpacity style={styles.roomInfoRightView} onPress={() => this.openTenant(this.state.landlord)}>
								{this.state.landlord.profileimage != "" ?
									(<Avatar
										rounded={true}
										size='medium'
										source={{uri: this.state.landlord.profileimage, cache: 'force-cache'}}
										style={styles.roomInfoRightImage}
									/>) : 
									(<View style={styles.roomInfoRightImage}></View>)
								}
								
								<Text style={styles.roomInfoRightNameText}>{this.state.landlord.name_preferred ? this.state.landlord.name_preferred : this.state.landlord.first_name} {this.state.landlord.last_name}</Text>
							</TouchableOpacity>
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
							<Text style={styles.detailsTitleText}>Location</Text>
							<Text style={{fontSize: RF(2.25)}}>{item.location}</Text>
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
							<Text style={styles.detailsTitleText}>Description</Text>
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
						
						<View style = {styles.descriptionView}>
							<Text style={styles.detailsTitleText}>Current Tenants</Text>
							<View>
								{tenants.length ? (
									tenants
								) : (
									<Text style={{color: 'grey', fontWeight: 'bold'}}>No tenants in this house. </Text>
								)}
							</View>
						</View>
						
					</View>
				</View>
			);
		} else {
			content = (
				
				<Placeholder animation='fade' style={{flex: 1}}>
					<Media style={{height: 275, width: "100%", backgroundColor: '#2EA9DF'}}/>
					<View style={{
							backgroundColor: 'white',
							alignItems: "stretch",
							marginBottom: 10,
							padding: 10
					}}>

						<View>
							<View style={styles.roomTitleView}>
								<Line style={{...styles.roomTitleText, width: "50%"}}/>
								<View style={styles.roomIcons}>
									<Media style={{width: 26, height: 26}}/>
								</View>
							</View>
						
							<View style={styles.roomInfoView}>
								<View style={styles.roomInfoLeftView}>
									<View style={styles.roomInfoLeftSpecsView}>
										<Line style={{height: RF(2)}} width="75%"/>
										<Line style={{height: RF(2)}} width="75%"/>
										<Line style={{height: RF(2)}} width="75%"/>
										<Line style={{height: RF(2)}} width="75%"/>
									</View>
								</View>
								<View style={styles.roomInfoRightView}>
									<Media style={{...styles.roomInfoRightImage, backgroundColor: '#2EA9DF'}}/>
									
									<Line style={styles.roomInfoRightNameText}/>
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
						
						<View style = {styles.descriptionView}>
							<Line style={{...styles.detailsTitleText, height: RF(2.5)}}/>
							<Line style={{height: RF(2.25)}}/>
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
							<Line style={{...styles.detailsTitleText, height: RF(2.5)}}/>
							<Line style={{height: RF(2.25)}}/>
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
							<Line style={{...styles.detailsTitleText, height: RF(2.5)}}/>
							<Line style={{height: RF(2.25)}}/>
						</View>
					</View>
				</Placeholder>
			);

			

			bottomBar = (
				<View style={{
					bottom: 0,
					left: 0,
					width: "100%",
					height: 50,
					flexDirection: 'row',
					justifyContent: 'space-between',
					backgroundColor: '#e7e7e7'
				}}>
					<Text
						style={{
							height: "100%",
							fontSize: RF(2.5),
							color: '#4ec9ff',
							padding: 15,
							textAlign: 'right',
							fontWeight: 'bold',
						}}
					>
					</Text>
					<View 
						style={{
							justifyContent: 'center', 
							height: "100%", 
							backgroundColor: '#2EA9DF',
							padding: 15,
						}}
					>
						<Text style={{color: "white", fontSize: RF(2.25)}}></Text>
					</View>
				</View>
			)
		}

		return (
			<SafeAreaView style={{flex: 1}} forceInset={{top: 'never'}}>
				<KeyboardAwareScrollView style={{flex: 1}} stickyHeaderIndices={[1]}>
					{imageView}
					{titleView}
					{content}
				</KeyboardAwareScrollView>
				{bottomBar}
      		</SafeAreaView>
		);
	}

}
const styles = StyleSheet.create({
	roomTitleView: {
		width: "100%",
		padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	roomTitleText: {
		lineHeight: RF(4), 
		fontSize: RF(3),
		fontWeight: 'bold',
		flex: 1
	},
	roomIcons: {
		marginLeft: 5,
		marginRight: 15
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
		margin: 5,
		textAlign: 'center',
	},
	roomInfoLeftSpecsView: {
		flexDirection: 'column',
		marginTop: 5,
		marginBottom: 5
	},
	roomInfoLeftSpecDetailsView: {
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	roomInfoLeftSpecDetailsIconView: {
		width: 50,
	},
	roomInfoLeftSpecDetailsTextView: {
		fontWeight: 'bold',
	},
	detailsTitleText: {
		fontSize: RF(2.5), 
		fontWeight: 'bold',
		margin: 15
	},

	descriptionView: {
		textAlign: 'left',
		margin: 15
	}
})