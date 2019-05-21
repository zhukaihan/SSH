import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from 'react-navigation';
import HousingSearchStackNavigator from './HousingSearchStackNavigator';
import HousingListingStackNavigator from './HousingListingStackNavigator';
import RoomateSearchStackNavigator from './RoomateSearchStackNavigator';

const TabNavigator = createBottomTabNavigator(
	{
		HousingSearchStackNavigator: {
			screen: HousingSearchStackNavigator, 
			navigationOptions: {
				tabBarLabel:"Houses",
				tabBarIcon: <Icon name="home" type="font-awesome"/>
			}
		},
		HousingListingStackNavigator: {
			screen: HousingListingStackNavigator, 
			navigationOptions: {
				tabBarLabel:"Listings",
				tabBarIcon: <Icon name="home" type="font-awesome"/>
			}
		},
		RoomateSearchStackNavigator: {
			screen: RoomateSearchStackNavigator,
			navigationOptions: {
				tabBarLabel:"Roommates",
				tabBarIcon: <Icon name="home" type="font-awesome"/>
			}
		},
		// MyProfilePage:{
		// 	screen: ProfilePage,
		// 	navigationOptions:{
		// 		tabBarLabel:"Profile",
		// 		tabBarIcon: <Icon name="home" type="font-awesome"/>
		// 	}
		// }
		/*CreateHousingRoommatePageIDKIDK: {
			screen: CreateHousingRoommatePageIDKIDK,
			navigationOptions: {
				title: 'Profile Page',
				headerLeft: null
			}
		}*/
	},
);

export default TabNavigator;