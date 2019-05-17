// HousePreviewView will display a preview of a house. It is intended to be used with Flatlist. 
// When the preview is touched, it will call the onTouch props. 
// Usage: <HousePreviewView house={ahouse} onTouch={this.onHouseTouch} />
// The HousePreviewView will display the information about ahouse and will call this.onHouseTouch when touched. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';

export default class HousePreviewView extends React.Component {
	render() {
		item = this.props.house;
		onTouch = this.props.onTouch;
		if (!item) {
			return (<View></View>);
		}
		
		return (
			<TouchableHighlight
				onPress={() => {onTouch(item)}}>
				<View style={{
						backgroundColor: 'white',
						alignItems: "stretch",
						marginBottom: 10,
						padding: 5
				}}>
					<ImageHorizontalScrollView pictureUrls={item.pictures}/>
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

					<BadgesView tags={item.filters_house.additional_tags} />
				</View>
			</TouchableHighlight>
		)
	}
}