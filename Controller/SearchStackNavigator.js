import React, { Component } from 'react';
import { createStackNavigator, createMaterialTopTabNavigator, SafeAreaView, MaterialTopTabBar } from 'react-navigation';
import HousingSearchPage from './HousingSearchPage';
import ViewHousingPage from './ViewHousingPage';
import RoomateSearchPage from './RoomateSearchPage';
import ProfilePage from './ProfilePage';


function SafeAreaMaterialTopTabBar (props) {
  return (
    <SafeAreaView style={{backgroundColor: '#2ea9df'}}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  )
}

const SearchTopTabNavigator = createMaterialTopTabNavigator(
	{
		HousingSearchPage:{
			screen: HousingSearchPage,
			navigationOptions:{
				tabBarLabel:"Housing",
			}
		},
		RoomateSearchPage:{
			screen: RoomateSearchPage,
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

const SearchStackNavigator = createStackNavigator(
	{
		SearchTopTabNavigator: {
			screen: SearchTopTabNavigator,
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
		initialRouteName: 'SearchTopTabNavigator',
		navigationOptions: {
		}
	}
);

export default SearchStackNavigator;