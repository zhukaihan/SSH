import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, Button, Alert, FlatList, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Image, Badge, Avatar, Icon } from 'react-native-elements';
import RF from 'react-native-responsive-fontsize';
import User from '../Model/User';
import Placeholder, { Line, Media } from "rn-placeholder";

const defaultImg = require("./assets/icon.png");

export default class UserPreviewView extends React.Component {

	render() {
		let user = this.props.user
		
		return (
			<TouchableOpacity onPress={() => {if (this.props.onPress) this.props.onPress(user)}} style={{
				width: '100%',
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}>
				<View style={{
					flexDirection: 'row',
					flex: 1
				}}>
					<View style={{
						height: 75,
						margin: 5,
						aspectRatio: 1
					}}>
						<Avatar
							rounded
							source={{
								uri: user ? user.profileimage : "image uri cannot be empty so i put sth here",
								cache: 'force-cache'
							}}
							size="large"
						/>
						{this.props.hasAlertDot ? 
							(
								<Badge
									status="error"
									containerStyle={{ position: 'absolute', top: 0, right: 0 }}
								/>
							) : (
								<View />
							)
						}
						
					</View>
					
					<Placeholder
						isReady={user}
						animation="fade"
						style={{
							flex: 1
						}}
						whenReadyRender={() => (
							<View style={{
								flexDirection: 'column',
								height: 75,
								margin: 5,
								justifyContent: 'center'
							}}>
								<Text style={{
									color: 'black',
									fontSize: RF(2.5)
								}}>{user ? (user.name_preferred ? user.name_preferred : user.first_name) + " " + user.last_name : "Loading..."}</Text>
								<Text style={{
									color: 'grey',
									fontSize: RF(2)
								}}>{user ? user.graduation : ("Loading...")}</Text>
								<Text style={{
									color: 'grey',
									fontSize: RF(2)
								}}>{user ? user.major : "Loading..."}</Text>
							</View>
						)}
					>
						<View style={{
							marginTop: RF(1),
							justifyContent: 'center'
						}}>
							<Line width="50%" style={{height: RF(2.5), backgroundColor: 'grey'}}/>
							<Line width="20%" style={{height: RF(2), backgroundColor: 'grey'}}/>
							<Line width="40%" style={{height: RF(2), backgroundColor: 'grey'}}/>
						</View>
					</Placeholder>
					
				</View>
			</TouchableOpacity>
		)
	}
}