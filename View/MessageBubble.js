import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Svg } from 'expo'
const { Path } = Svg;
import { Image } from 'react-native-elements';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import RF from 'react-native-responsive-fontsize';

export default class MessageBubble extends React.Component {
	// Source: https://stackoverflow.com/questions/50465450/chat-bubble-in-react-native
	render() {
		var hours = this.props.timestamp.getHours();
		var minutes = "0" + this.props.timestamp.getMinutes();
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = this.props.timestamp.getFullYear();
		var month = months[this.props.timestamp.getMonth()];
		var date = this.props.timestamp.getDate();
		
		var bubble;
		if (this.props.isLeft) {
			bubble = (
				<View style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start'
				}}>
					<View style={[styles.item, styles.itemIn]}>
						<View style={[styles.balloon, {backgroundColor: 'grey'}]}>
							<Text style={{paddingTop: 5, color: 'white', fontSize: RF(2.25)}}>{this.props.text}</Text>
							<View
								style={[
									styles.arrowContainer,
									styles.arrowLeftContainer,
								]}
							>
		
								<Svg style={styles.arrowLeft} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.484 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
									<Path
											d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
											fill="grey"
											x="0"
											y="0"
									/>
								</Svg>
							</View>
						</View>
					</View>
					<Text style={{
						marginLeft: 10,
						fontSize: RF(1.5),
						color: 'grey'
					}}>
						{hours + ':' + minutes.substr(-2)}
					</Text>
				</View>
			)
		} else {
			bubble = (
				<View style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end'
				}}>
					<Text style={{
						marginRight: 10,
						fontSize: RF(1.5),
						color: 'grey'
					}}>
						{hours + ':' + minutes.substr(-2)}
					</Text>
					<View style={[styles.item, styles.itemOut]}>
						<View style={[styles.balloon, {backgroundColor: '#1084ff'}]}>
							<Text style={{paddingTop: 5, color: 'white', fontSize: RF(2.5)}}>{this.props.text}</Text>
							<View
								style={[
									styles.arrowContainer,
									styles.arrowRightContainer,
								]}
							>
								<Svg style={styles.arrowRight} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.485 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
									<Path
											d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
											fill="#1084ff"
											x="0"
											y="0"
									/>
								</Svg>
							</View>
						</View>
					</View>
				</View>
			)
		}
		return (
			<View>
				{
					this.props.showDate ? 
					(
						<Text style={{
							marginTop: 10,
							textAlign: 'center',
							fontSize: RF(1.5),
							color: 'grey',
							fontWeight: 'bold'
						}}>{month}. {date}, {year}</Text>
					) : 
					null
				}
				{bubble}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	item: {
		marginVertical: moderateScale(5, 2),
		flexDirection: 'row'
	},
	itemIn: {
			marginLeft: 20
	},
	itemOut: {
			alignSelf: 'flex-end',
			marginRight: 20
	},
	balloon: {
			maxWidth: moderateScale(250, 2),
			paddingHorizontal: moderateScale(10, 2),
			paddingTop: moderateScale(5, 2),
			paddingBottom: moderateScale(7, 2),
			borderRadius: 20,
	},
	arrowContainer: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: -1,
			flex: 1
	},
	arrowLeftContainer: {
			justifyContent: 'flex-end',
			alignItems: 'flex-start'
	},

	arrowRightContainer: {
			justifyContent: 'flex-end',
			alignItems: 'flex-end',
	},

	arrowLeft: {
			left: moderateScale(-6, 0.5),
	},

	arrowRight: {
			right:moderateScale(-6, 0.5),
	}
})