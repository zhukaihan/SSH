import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createMaterialTopTabNavigator, createStackNavigator, MaterialTopTabBar, SafeAreaView } from 'react-navigation';
import ViewHousingPage from './ViewHousingPage';
import ProfilePage from './ProfilePage';
import FavHousingPage from './FavHousingPage';
import FavRoommatePage from './FavRoommatePage';

const FavHousingTabNavigator = createStackNavigator(
	{
		FavHousingPage: {
			screen: FavHousingPage, 
			navigationOptions: {
				headerVisible: false
			}
		},
		ViewHousingPage: {
			screen: ViewHousingPage
		},
	},
	{
		initialRouteName: 'FavHousingPage',
		headerMode: 'none',
		navigationOptions: {
		}
	}
)

const FavRoommateTabNavigator = createStackNavigator(
	{
		FavRoommatePage: {
			screen: FavRoommatePage, 
			navigationOptions: {
				headerVisible: false
			}
		},
		ProfilePage: {
			screen: ProfilePage
		},
	},
	{
		initialRouteName: 'FavRoommatePage',
		headerMode: 'none',
		navigationOptions: {
		}
	}
)

function SafeAreaMaterialTopTabBar (props) {
  return (
    <SafeAreaView style={{backgroundColor: '#2ea9df'}}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}

const FavoriteTopTabNavigator = createMaterialTopTabNavigator(
	{
		FavHousingTabNavigator:{
			screen: FavHousingTabNavigator,
			navigationOptions:{
				tabBarLabel:"Housing",
			}
		},
		FavRoommateTabNavigator:{
			screen: FavRoommateTabNavigator,
			navigationOptions:{
				tabBarLabel:"Roommates",
			}
		},
	},
	{
		tabBarComponent: SafeAreaMaterialTopTabBar,
		lazy: true
	}
);

export default FavoriteTopTabNavigator;