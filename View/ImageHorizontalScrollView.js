import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import RF from 'react-native-responsive-fontsize';

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
		width: Dimensions.get('window').width,
		height: 200,
		page: 0
	}
	componentWillMount = async () => {
		if (this.props.height) {
			this.setState({
				height: this.props.height
			})
		}
	}
	handleScroll = (event) => {
		this.setState({page: Math.round(event.nativeEvent.contentOffset.x / this.state.width)});
	}
	getCurPagingIndex = () => {
		return this.state.page
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
						height: this.state.height,
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
							height: this.state.height,
							width: this.state.width
						}}
						defaultSource={defaultImg}
						PlaceholderContent={(<ActivityIndicator/>)}
					/>
			));
		});
		
		return (
			<View>
				<ScrollView name={scrollViewName} horizontal={true} pagingEnabled={true} scrollEnabled={true}
					style={{
						height: this.state.height,
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
					onScrollEndDrag={this.handleScroll}
					onMomentumScrollEnd={this.handleScroll}
				>
					{imgs}
				</ScrollView>
				<Text style={{
					position: 'absolute',
					right: 0,
					bottom: 0,
					padding: 5,
					backgroundColor: 'rgb(50, 50, 50)',
					color: 'white',
					fontSize: RF(1.75)
				}}>
					{(this.state.page + (this.props.pictureUrls.length == 0 ? 0 : 1)) + " / " + this.props.pictureUrls.length}
				</Text>
			</View>
		)
	}
}