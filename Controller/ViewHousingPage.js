import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Icon, Card, Badge } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';


export default class ViewHousingPage extends React.Component{
	state = {
		housingItems: null
	}

	constructor() {
		super();
		
	}

	componentWillMount() {
		let houseId = this.props.navigation.getParam("houseId", "")
		if (houseId != "") {
			this.housesRef = firebase.firestore().collection("houses").doc(houseId);
			this.housesRef.get().then(house => {
				this.setState({
					house: new House(house.id, house.data())
				});
			});
		} else {
			this.setState({
				house: new House("", {})
			})
		}
	}

	render = () => {
		var content;
		
		if (this.state.house) {
			let item = this.state.house;

			var badgesView = [];
			item.filters_house.additional_tags.forEach((value) => {
				badgesView.push((
					<Badge
						key={value}
						value={
							<Text style={{
								color: 'white'
							}}>{value}</Text>
						}
						badgeStyle={{
							paddingLeft: 10, 
							paddingRight: 10,
							marginRight: 5
							// padding: 10 // This won't work. 
						}}
						// I can't find a way to pad the top and bottom part of a badge. 
					/>
				));
			});

			var tenants = [];
			item.cur_tenant.forEach((value) => {
				tenants.push((
					<View>
						<Image
							key={value}
							source={{url: "https://www.apple.com/ac/globalnav/4/en_US/images/globalnav/apple/image_large.svg"}}
							style={{
								height: 200
							}}
						/>
						<Text>Apple</Text>
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

					<View>
						<View style={styles.roomTitleView}>
							<Text style={styles.roomTitleText}>{item.filters_house.title}</Text>
							<Icon name="star" type="font-awesome"/>
						</View>
					
						<View style={styles.roomInfoView}>
							<View style={styles.roomInfoLeft}>
								<View style={styles.roomInfoLeftSpecs}>
									<View style={styles.roomInfoLeftSpecDetails}>
										<Icon name="users" type="font-awesome"/>
										<Text>  {item.filters_house.num_tenant} Tenants</Text>
									</View>
									<View style={styles.roomInfoLeftSpecDetails}>
										<Icon name="bed" type="font-awesome"/>
										<Text>  {item.filters_house.num_bedroom} Bedrooms</Text>
									</View>
									<View style={styles.roomInfoLeftSpecDetails}>
										<Icon name="bath" type="font-awesome"/>
										<Text>  {item.filters_house.num_bathroom} Bathrooms</Text>
									</View>
									<View style={styles.roomInfoLeftSpecDetails}>
										<Icon name="car" type="font-awesome"/>
										<Text>  {item.filters_house.num_parking} Parkings</Text>
									</View>
								</View>
								<View style={styles.roomInfoLeftBadges}>
									{badgesView}
								</View>
							</View>
							<View style={styles.roomInfoRight}>
								<Image
										source={{uri: "https://www.apple.com/ac/globalnav/4/en_US/images/globalnav/apple/image_large.svg"}}
										style={styles.roomInfoRightImg}
									/>
									<Text style={styles.roomInfoRightName}>{item.landlord}</Text>
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
					<Text style={{fontSize: RF(2.5), color: 'rgb(50, 150, 255)'}}>{"$ " + item.filters_house.price}</Text>
				</View>
			);
		}

		return (
			<SafeAreaView style={{flex: 1}}>
				{content}
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
	roomInfoLeft: {
		flex: 2
	},
	roomInfoRight: {
		flex: 1
	},
	roomInfoLeftSpecs: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 5,
		marginBottom: 5
	},
	roomInfoLeftSpecDetails: {
		width: '45%',
		marginLeft: '2.5%',
		marginRight: '2.5%',
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	roomInfoLeftBadges: {
		flexDirection: 'row',
		margin: 5
	}
})