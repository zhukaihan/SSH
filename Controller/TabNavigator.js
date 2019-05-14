import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from 'react-navigation';
import HousingSearchStackNavigator from './HousingSearchStackNavigator';
import RoommateSearchPage from './RoomateSearchPage';
import ProfilePage from './ProfilePage';

const TabNavigator = createBottomTabNavigator(
	{
		HousingSearchStackNavigator: {
			screen: HousingSearchStackNavigator, 
			navigationOptions: {
				tabBarLabel:"Houses",
				tabBarIcon: <Icon name="home" type="font-awesome"/>
			}
		},
		RoommateSearchPage: {
			screen: RoommateSearchPage,
			navigationOptions: {
				tabBarLabel:"Roommate",
				tabBarIcon: <Icon name="home" type="font-awesome"/>
			}
		},	
		ProfilePage:{
			screen: ProfilePage,
			navigationOptions:{
				tabBarLabel:"Profile",
				tabBarIcon: <Icon name="home" type="font-awesome"/>
			}
		}
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