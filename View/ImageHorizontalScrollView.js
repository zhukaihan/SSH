import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';

const defaultImg = require("./assets/icon.png");

function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		 result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


export default class ImageHorizontalScrollView extends React.Component {
	state = {
		width: Dimensions.get('window').width
	}
	render() {
		let pictureUrls = this.props.pictureUrls;
		let scrollViewName = makeid(10);

		var imgs = [];
		if (!pictureUrls || pictureUrls.length == 0) {
			imgs.push((
				<Image
					host={scrollViewName}
					key="0"
					source={{url: ""}}
					style={{
						height: 200,
						width: this.state.width
					}}
					defaultSource={defaultImg}
					PlaceholderContent={(<ActivityIndicator/>)}
				/>
			))
		}
		pictureUrls.forEach((picture, index) => {
			imgs.push((
					<Image
						host={scrollViewName}
						key={index}
						source={{url: picture, cache: 'force-cache'}}
						style={{
							height: 200,
							width: this.state.width
						}}
						defaultSource={defaultImg}
						PlaceholderContent={(<ActivityIndicator/>)}
					/>
			));
		});
		
		return (
			
			<ScrollView name={scrollViewName} horizontal={true} pagingEnabled={true} scrollEnabled={true}
				style={{
					height: 200,
					width: '100%'
				}}
				contentContainerStyle={{
					width: ((imgs.length * 100).toString() + '%')
				}}
				onLayout={(event) => {
					var {x, y, width, height} = event.nativeEvent.layout;
					if (width != this.state.width) {
						this.setState({
							width: width
						});
					}
				}}
			>
				{imgs}
			</ScrollView>
		)
	}
}