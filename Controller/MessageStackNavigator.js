import React, { Component } from 'react';
import { createStackNavigator, createMaterialTopTabNavigator, SafeAreaView, MaterialTopTabBar } from 'react-navigation';
import ProfilePage from './ProfilePage';
import MessageCenter from './MessageCenter';
import MessageRoomView from './MessageRoomView';

const MessageStackNavigator = createStackNavigator(
	{
		MessageCenter: {
			screen: MessageCenter,
			navigationOptions: {
				header: null
			}
		},
		MessageRoomView: {
			screen: MessageRoomView,
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
		initialRouteName: 'MessageCenter',
		navigationOptions: {
		}
	}
);

export default MessageStackNavigator;