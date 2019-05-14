import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, ScrollView } from 'react-native';

export default class ImageHorizontalScrollView extends React.Component {
	render() {
		let pictureUrls = this.props.pictureUrls
		var imgs = [];
			pictureUrls.forEach((picture) => {
				imgs.push((
					<Image
						key={picture}
						source={{url: picture}}
						style={{
							height: 200,
							flex: 1
						}}
					/>
				));
			});
		
		return (
			<ScrollView horizontal={true} pagingEnabled={true}
				style={{
					height: 200,
					width: '100%'
				}}
				contentContainerStyle={{
					width: ((imgs.length * 100).toString() + '%')
				}}
			>
				{imgs}
			</ScrollView>
		)
	}
}