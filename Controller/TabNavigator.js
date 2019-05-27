import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from 'react-navigation';
import SearchStackNavigator from './SearchStackNavigator';
import FavoriteStackNavigator from './FavoriteStackNavigator';
import HousingListingStackNavigator from './HousingListingStackNavigator';
import ProfilePage from './ProfilePage';

const TabNavigator = createBottomTabNavigator(
	{
		SearchStackNavigator: {
			screen: SearchStackNavigator, 
			navigationOptions: {
				tabBarLabel:"Search",
				tabBarIcon: <Icon name="search" type="font-awesome"/>
			}
		},
		FavoriteStackNavigator:{
			screen: FavoriteStackNavigator,
			navigationOptions:{
				tabBarLabel:"Favorite",
				tabBarIcon: <Icon name="heart" type="font-awesome"/>
			}
		},
		HousingListingStackNavigator: {
			screen: HousingListingStackNavigator, 
			navigationOptions: {
				tabBarLabel:"Listings",
				tabBarIcon: <Icon name="list" type="font-awesome"/>
			}
		},
		MyProfilePage:{
			screen: ProfilePage,
			navigationOptions:{
				tabBarLabel:"My Profile",
				tabBarIcon: <Icon name="id-badge" type="font-awesome"/>
			}
		}
	
	},
);

export default TabNavigator;