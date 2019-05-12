import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import RF from "react-native-responsive-fontsize";

export default class HousingSearchPage extends React.Component{
	state = {
		housingItems: null
	}

	constructor() {
		super();
		console.log(firebase.auth().currentUser.email);
		this.housesRef = firebase.firestore().collection("houses");
	}

	getHousingData = () => {
		this.housesRef.orderBy("post_date").get().then(snapshot => {
			let housingItems = [];
			snapshot.forEach(house => {
				var aHouse = new House(house.id, house.data());
				housingItems.push(aHouse);
			});
			
			this.setState({
				housingItems: housingItems
			});
		});
		
	}

	openHouse(house) {
		console.log(house.id);
		this.props.navigation.navigate("ViewHousingPage", {
			houseId: house.id,
		});
	}

	componentWillMount() {
		this.getHousingData();
	}

	render = () => {
		var flatList;
		
		if (this.state.housingItems) {
			flatList = (
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={this.state.housingItems}
					renderItem={({item}) => {
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

						return (
							<TouchableHighlight
								onPress={() => this.openHouse(item)}>
								<View style={{
										backgroundColor: 'white',
										alignItems: "stretch",
										marginBottom: 10,
										padding: 5
								}}>
									<Image 
										style={{
											height: 200,
										}}
										source={{ uri: item.pictures[0] }}
									/>
									<View>
										<View style={{
											flexDirection: 'row',
											justifyContent: 'space-between'
										}}>
											<Text style={{fontSize: RF(2.5), fontWeight: 'bold'}}>{item.filters_house.title}</Text>
											<Text style={{fontSize: RF(2.5), color: 'rgb(50, 150, 255)'}}>{"$ " + item.filters_house.price}</Text>
										</View>
									
										<View style={{
											flexDirection: 'row',
											justifyContent: 'space-between'
										}}>
											<Text style={{fontSize: RF(2)}}>{item.filters_house.num_bedroom + "B" + item.filters_house.num_bathroom + "B | " + item.filters_house.num_parking + " parking"}</Text>
											<Icon name="star" type="font-awesome"/>
										</View>
									
									</View>

									<View style={{
										flexDirection: 'row'
									}}>
										{badgesView}
									</View>
								</View>
							</TouchableHighlight>
						)

					}}
				/>
			);
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