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
								<View style={styles.roomFavButton}>
									<HouseFavButton house={item}/>
								</View>
							</View>
						
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
						<Text style={{fontSize: RF(2.5), color: '#2ea9df', margin: 15, textAlign:'right'}}>{"$ " + item.price}</Text>
					</View>
				</View>
			);
		} else {
			content = (
				<Placeholder
					isReady={false}
					animation="fade"
				>
					<Media style={{width: "100%", height: 275, marginBottom: 10, backgroundColor: '#2EA9DF'}}/>
					<Line width="60%" style={{height: RF(3)}}/>
					<View style={styles.roomInfoView}>
						<View style={styles.roomInfoLeftView}>
							<Line width="60%" style={{height: RF(2.5)}}/>
							<Line width="60%" style={{height: RF(2.5)}}/>
							<Line width="60%" style={{height: RF(2.5)}}/>
							<Line width="60%" style={{height: RF(2.5)}}/>
						</View>
						<View style={{...styles.roomInfoRightView, aspectRatio: 1, backgroundColor: '#2EA9DF'}}>
							<Media style={{width: "90%", aspectRatio: 1, margin: "5%", backgroundColor: '#2EA9DF'}}/>
						</View>
					</View>
					<Line width="100%" style={{height: RF(3)}}/>
					<Line width="60%" style={{height: RF(3)}}/>
					<Line width="75%" style={{height: RF(3)}}/>
					<Line width="60%" style={{height: RF(3)}}/>
					<Line width="75%" style={{height: RF(3)}}/>
					<Line width="60%" style={{height: RF(3)}}/>
					<Line width="75%" style={{height: RF(3)}}/>
					<Line width="60%" style={{height: RF(3)}}/>
					<Line width="75%" style={{height: RF(3)}}/>
				</Placeholder>
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
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	roomTitleText: {
		fontSize: RF(2.5), 
		fontWeight: 'bold',
		flex: 1
	},
	roomFavButton: {
		width: 50
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
		width: '90%',
		marginLeft: '2.5%',
		marginRight: '2.5%',
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