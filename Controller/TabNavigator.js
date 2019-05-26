import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createBottomTabNavigator } from 'react-navigation';
import HousingSearchStackNavigator from './HousingSearchStackNavigator';
import HousingListingStackNavigator from './HousingListingStackNavigator';
import RoomateSearchStackNavigator from './RoomateSearchStackNavigator';
import ProfilePage from './ProfilePage';
import FavHousingPage from './FavHousingPage';
import FavRoommatePage from './FavoriteRoommatePage';
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
				tabBarIcon: <Icon name="list" type="font-awesome"/>
			}
		},
		RoomateSearchStackNavigator: {
			screen: RoomateSearchStackNavigator,
			navigationOptions: {
				tabBarLabel:"Roommates",
				tabBarIcon: <Icon name="users" type="font-awesome"/>
			}
		},
		MyProfilePage:{
			screen: ProfilePage,
			navigationOptions:{
				tabBarLabel:"My Profile",
				tabBarIcon: <Icon name="id-badge" type="font-awesome"/>
			}
		},
		FavoritePage:{
			screen: FavRoommatePage,
			navigationOptions:{
				tabBarLabel:"Favorite",
				tabBarIcon: <Icon name="heart" type="font-awesome"/>
			}
		}
	
	},
);

export default TabNavigator;