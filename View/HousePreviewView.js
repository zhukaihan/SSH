// HousePreviewView will display a preview of a house. It is intended to be used with Flatlist. 
// When the preview is touched, it will call the onTouch props. 
// Usage: <HousePreviewView house={ahouse} onTouch={this.onHouseTouch} />
// The HousePreviewView will display the information about ahouse and will call this.onHouseTouch when touched. 

import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';
import User from '../Model/User';
import firebase from 'firebase';
import HouseFavButton from './HouseFavButton';

export default class HousePreviewView extends React.Component {

	render() {
		let item = this.props.house;
		let onTouch = this.props.onTouch;
		let favDisabled = this.props.favDisabled ? this.props.favDisabled : false;

		if (!item) {
			return (<View></View>);
		}

		var favButton;
		if (!favDisabled) {
			favButton = (<HouseFavButton house={this.props.house}/>);
		}
		
		return (
			<TouchableOpacity
				onPress={() => {onTouch(this.props.house)}}>
				<View style={{
						backgroundColor: 'white',
						alignItems: "stretch",
						marginBottom: 10,
						padding: 5,
						// height: '50%' 
						// You cannot have the height as a percentage. 
						// The parent container, TouchableHighlight, has undefined height. 
						// The parent container of TouchableHighlight is the FlatList's content container, 
						// which should not have a predefined height as it will expand as elements being inserted. 
						// Setting height of a child of a flatlist or scrollview to 50% will have an undefined behavior. 
						// If you want to have the height = 50%, define TouchableHighlight's height as a non-percentage, static, predefined number.
				}}>
					<ImageHorizontalScrollView pictureUrls={item.pictures} />
					<View>
						<View style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
						}}>
							<Text style={{fontSize: RF(2.5), fontWeight: 'bold'}}>{item.title}</Text>
							<Text style={{fontSize: RF(2.5), color: 'rgb(50, 150, 255)'}}>{"$ " + item.price}</Text>
						</View>
					
						<View style={{
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}>
							<Text style={{fontSize: RF(2)}}>{item.num_bedroom + "B" + item.num_bathroom + "B | " + item.num_parking + " parking"}</Text>
							{favButton}
						</View>
					
					</View>

					<BadgesView tags={item.additional_tags} />
				</View>
			</TouchableOpacity>
		)
	}
}