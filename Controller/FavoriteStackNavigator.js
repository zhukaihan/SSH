import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { createMaterialTopTabNavigator, createStackNavigator, MaterialTopTabBar, SafeAreaView } from 'react-navigation';
import ViewHousingPage from './ViewHousingPage';
import ProfilePage from './ProfilePage';
import FavHousingPage from './FavHousingPage';
import FavRoommatePage from './FavRoommatePage';


function SafeAreaMaterialTopTabBar (props) {
  return (
    <SafeAreaView style={{backgroundColor: '#2ea9df'}}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}

const FavoriteTopTabNavigator = createMaterialTopTabNavigator(
	{
		FavHousingPage:{
			screen: FavHousingPage,
			navigationOptions:{
				tabBarLabel:"Housing",
			}
		},
		FavRoommatePage:{
			screen: FavRoommatePage,
			navigationOptions:{
				tabBarLabel:"Roommates",
			}
		},
	},
	{
		tabBarComponent: SafeAreaMaterialTopTabBar,
		lazy: true,
		tabBarOptions: {
			style: {
				backgroundColor: '#2EA9DF'
			}
		}
	}
);

const FavoriteStackNavigator = createStackNavigator(
	{
		FavoriteTopTabNavigator: {
			screen: FavoriteTopTabNavigator,
			navigationOptions: {
				header: null
			}
		},
		ViewHousingPage: {
			screen: ViewHousingPage,
			navigationOptions: {
				headerBackTitleStyle: {
					color: 'white'
				},
				headerTransparent: true
			}
		},
		ProfilePage: {
			screen: ProfilePage,
			navigationOptions: {
				headerBackTitleStyle: {
					color: 'white'
				},
				headerTransparent: true
			}
		},
	},
	{
		initialRouteName: 'FavoriteTopTabNavigator',
		navigationOptions: {
		}
	}
)

export default FavoriteStackNavigator;