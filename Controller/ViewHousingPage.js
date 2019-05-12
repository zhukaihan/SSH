import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import RF from "react-native-responsive-fontsize";
import { ScrollView } from 'react-native-gesture-handler';


export default class ViewHousingPage extends React.Component{
	state = {
		housingItems: null
	}

	constructor() {
		super();
		if (this.props.houseId) {
			this.housesRef = firebase.firestore().collection("houses").doc(this.props.houseId);
			this.housesRef.get().then(snapshot => {
				this.setState({
					housingItems: new House(snapshot)
				});
			});
		} else {
			this.setState({
				house: new House({})
			})
		}
	}

	componentWillMount() {
		this.getHousingData();
	}

	render = () => {
		var flatList;
		
		if (this.state.house) {
			let item = this.state.house
			flatList = ((item) => {
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

				var imgs = [];
				item.pictures.forEach((value) => {
					imgs.push((
						<Image
							key={value}
							source={{url: value}}
							style={{
								height: 200
							}}
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

				return (
					<View style={{
							backgroundColor: 'white',
							alignItems: "stretch",
							marginBottom: 10,
							padding: 5
					}}>
						<ScrollView horizontal='true' pagingEnabled='true' style={{
							height: 200,
							flexDirection: 'row',
							alignItems: 'stretch'
						}}>
							{imgs}
						</ScrollView>

						<View>
							<View style={{
								flexDirection: 'row',
								justifyContent: 'space-between'
							}}>
								<Text style={{fontSize: RF(2.5), fontWeight: 'bold'}}>{item.filters_house.title}</Text>
								<Icon name="star" type="font-awesome"/>
							</View>
						
							<View style={{
								flexDirection: 'row',
								justifyContent: 'space-between'
							}}>
								<View style={{
										flex: 2
								}}>
									<View>
										<View>
											<Icon name="star" type="font-awesome"/>
											<Text>{item.filters_house.num_tenant} Tenants</Text>
										</View>
										<View>
											<Icon name="star" type="font-awesome"/>
											<Text>{item.filters_house.num_bedroom} Bedrooms</Text>
										</View>
										<View>
											<Icon name="star" type="font-awesome"/>
											<Text>{item.filters_house.num_bathroom} Bathrooms</Text>
										</View>
										<View>
											<Icon name="star" type="font-awesome"/>
											<Text>{item.filters_house.num_parking} Parkings</Text>
										</View>
									</View>
									<View style={{
										flexDirection: 'row'
									}}>
										{badgesView}
									</View>
								</View>
								<View>
									<Image
											source={{uri: "https://www.apple.com/ac/globalnav/4/en_US/images/globalnav/apple/image_large.svg"}}
											style={{
												flex: 1
											}}
										/>
										<Text>{item.landlord}</Text>
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
							<Text>item.filters_house.title</Text>{/*NEED TO CHANGE WITH DATABASE*/}
						</View>
						
						<View>
							<Text>Current Tenants</Text>
							<View>
								{tenants}
							</View>
						</View>
						<Text style={{fontSize: RF(2.5), color: 'rgb(50, 150, 255)'}}>{"$ " + item.filters_house.price}</Text>
					</View>
				)
			});
		}

		return (
			<SafeAreaView style={styles.safeArea}>
				{flatList}
      </SafeAreaView>
		);
	}

}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ddd'
  }
})