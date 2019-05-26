import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';

export default class ImageHorizontalScrollView extends React.Component {
	render() {
		let pictureUrls = this.props.pictureUrls
		var imgs = [];
		if (!pictureUrls || pictureUrls.length == 0) {
			imgs.push((
				<ImageLoad
					key="0"
					source={{url: ""}}
					style={{
						height: 200,
						flex: 1
					}}
					loadingStyle={{ size: 'large', color: 'grey' }}
				/>
			))
		}
		pictureUrls.forEach((picture) => {
			imgs.push((
				<ImageLoad
					key={picture}
					source={{url: picture}}
					style={{
						height: 200,
						flex: 1
					}}
					loadingStyle={{ size: 'large', color: 'grey' }}
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