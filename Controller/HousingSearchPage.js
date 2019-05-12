import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House'


export default class HousingSearchPage extends React.Component{
	state = {
		housingItems: null
	}

	constructor() {
		super();
		console.log(firebase.auth().currentUser.email);
		this.housesRef = firebase.database().ref("houses");
	}

	getHousingData = () => {
		this.housesRef.orderByChild("post_date").once('value').then(snapshot => {
			let housingItems = [];
			snapshot.forEach(house => {
				let item = house.val();
				var aHouse = new House(item);
				housingItems.push(aHouse);
			});
			
			this.setState({
				housingItems: housingItems
			});
		});
		
	}

	openHouse(house) {

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
					renderItem={({item}) => (
						<TouchableHighlight
							onPress={() => this.openHouse(item)}>
							<View
								style={{
									backgroundColor: 'white'
								}}
							>
								<Image 
									style={{
										height: 200,
										alignSelf: "stretch",
									}}
									source={{ uri: item.pictures[0] }}/>

								<Text 
									style={{
										alignSelf: "flex-start"
									}}
								>
									{item.filters_house.title}
								</Text>

								<Text 
									style={{
										alignSelf: "flex-start",
										flex: 1,
   										flexDirection: "row",
									}}
								>
									{item.filters_house.num_bedroom + "B" + item.filters_house.num_bathroom + "B | " + item.filters_house.num_parking + " parking"}
								</Text>

								<Text 
									style={{
										flex: 1,
   										flexDirection: "row",
										alignSelf: "flex-end",
										color: '#2ea9df',
									}}
								>
									{"$ " + item.filters_house.price}
								</Text>

								<Badge value="Badges for Tags"></Badge>
							</View>
						</TouchableHighlight>
					)}/>
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