import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Badge } from 'react-native-elements';

export default class BadgesView extends React.Component {
	render() {
		var badgesView = [];
		if (this.props.tags) {
			this.props.tags.forEach((value) => {
				badgesView.push((
					<View style={{
						margin: 2.5
					}}>
						<Badge
							key={value}
							value={
								<Text>{value}</Text>
							}
							badgeStyle={{
								paddingLeft: 10, 
								paddingRight: 10,
								backgroundColor: 'rgb(230, 230, 230)'
								// padding: 10 // This won't work. 
							}}
							// I can't find a way to pad the top and bottom part of a badge. 
						/>
					</View>
				));
			});
		}
		
		
		return (
			<View style={{
				flexDirection: 'row',
				margin: 5,
				flexWrap: 'wrap'
			}}>
				{badgesView}
			</View>
		)
	}
}