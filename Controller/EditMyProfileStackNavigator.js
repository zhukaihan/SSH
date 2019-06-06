import React, { Component } from 'react';
import { createStackNavigator, createMaterialTopTabNavigator, SafeAreaView, MaterialTopTabBar } from 'react-navigation';
import EditMyProfilePage from './EditMyProfilePage';

const EditMyProfileStackNavigator = createStackNavigator(
	{
		EditMyProfilePage: {
			screen: EditMyProfilePage
		},
	}
);

export default EditMyProfileStackNavigator;