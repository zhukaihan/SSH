import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableHighlight, ScrollView, Dimensions, Keyboard } from 'react-native';
import { Icon, Image, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import House from '../Model/House';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import ImageHorizontalScrollView from '../View/ImageHorizontalScrollView';
import BadgesView from '../View/BadgesView';
import HouseFavButton from '../View/HouseFavButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-gesture-handler';
import { Message, MessageRoom } from '../Model/Messaging';

// Source: https://github.com/APSL/react-native-keyboard-aware-scroll-view/blob/master/lib/KeyboardAwareHOC.js
import { isIphoneX } from 'react-native-iphone-x-helper'
import MessageBubble from '../View/MessageBubble';
const DEFAULT_TAB_BAR_HEIGHT = isIphoneX() ? 83 : 49

export default class MessageRoomView extends React.Component{
	static navigationOptions = ({ navigation }) => ({
    headerTitle: 
			<View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', }}>
				<Avatar
					rounded
					source={{uri: navigation.state.params.recipient.profileimage, cache: 'force-cache'}}
					size="small"
				/>
				<Text style={{
					marginLeft: 10, color: 'grey', fontSize: RF(2)
				}}>{navigation.state.params.recipient.name_preferred ? navigation.state.params.recipient.name_preferred : navigation.state.params.recipient.first_name}</Text>
			</View>,
	});
	
	state = {
		room: null,
		keyboardHeight: 0
	}

	constructor() {
		super();
	}

	componentWillMount = async () => {
		this.keyboardShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardShow)
		this.keyboardHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardHide)
		
		let roomId = this.props.navigation.getParam("roomId", "");
		if (roomId == "") {
			return
		}
		this.roomRef = firebase.firestore().collection("messages").doc(firebase.auth().currentUser.uid).collection("rooms").doc(roomId);
		this.oppositeSideRoomRef = firebase.firestore().collection("messages").doc(roomId).collection("rooms").doc(firebase.auth().currentUser.uid);
		this.observer = this.roomRef.onSnapshot(roomSnapshot => {
			var room = new MessageRoom(roomSnapshot.data(), roomSnapshot.id, () => {
				this.forceUpdate();
			});
			this.setState({
				room: room
			});
		}, err => {
			console.log(`Encountered error: ${err}`);
		});

		User.getUserWithUID(roomId, (user) => {
			this.state.recipient = user
			this.props.navigation.setParams({ headerTitle: 
				<View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', }}>
					<Image resizeMode="cover" style={{height: 30, width: 30}} source={{uri: user.profileimage, cache: 'force-cache'}}/>
					<Text>{user.name_preferred ? user.name_preferred : user.first_name} {user.last_name}</Text>
				</View>
			})
		})
		
	}

	componentWillUnmount = async () => {
		this.observer();

		this.updateLastReadTime();

		this.keyboardShowListener.remove()
    this.keyboardHideListener.remove()
	}

	keyboardShow = (event) => {
		this.setState({
			keyboardHeight: event.endCoordinates.height
		})
	}

	keyboardHide = (event) => {
		this.setState({
			keyboardHeight: 0
		})
	}

	sendMessage = async (txt) => {
		if (txt == "") {
			return;
		}
		this.newMsgTextInput.clear();
		this.roomRef.set({
			messages: firebase.firestore.FieldValue.arrayUnion({
				timestamp: firebase.firestore.Timestamp.now(),
				message: txt,
				isSentByUser: true
			}),
			last_contact_date: firebase.firestore.Timestamp.now(),
			last_read_time: firebase.firestore.Timestamp.now()
		}, {merge: true})
		this.oppositeSideRoomRef.set({
			messages: firebase.firestore.FieldValue.arrayUnion({
				timestamp: firebase.firestore.Timestamp.now(),
				message: txt,
				isSentByUser: false
			}),
			last_contact_date: firebase.firestore.Timestamp.now(),
		}, {merge: true})
	}

	updateLastReadTime = async () => {
		this.roomRef.set({
			last_read_time: firebase.firestore.Timestamp.now()
		}, {merge: true})
	}

	render = () => {
		if (!this.state.room || !this.state.room.messages) {
			return (<View></View>)
		}

		var messageViewStyle;
		if (!this.state.messageViewHeight) {
			messageViewStyle = {
				flex: 1
			}
		} else {
			messageViewStyle = {
				height: this.state.messageViewHeight
			}
		}

		return (
			<SafeAreaView style={{flex: 1}}>
				<View style={{flex: 1}}>
					<FlatList
						style={{
							flex: 1,
						}}
						keyExtractor={(item, index) => index.toString()}
						data={this.state.room.messages}
						renderItem={({item, index}) => {
							return (
								<MessageBubble
									isLeft={!item.isSentByUser}
									text={item.message}
									timestamp={item.timestamp.toDate()}
									isUnread={item.timestamp > this.state.room.last_read_time}
									showDate={
										index === 0 || 
										item.timestamp.toDate().getFullYear() !== this.state.room.messages[index - 1].timestamp.toDate().getFullYear() ||
										item.timestamp.toDate().getMonth() !== this.state.room.messages[index - 1].timestamp.toDate().getMonth() ||
										item.timestamp.toDate().getDate() !== this.state.room.messages[index - 1].timestamp.toDate().getDate()
									}
								/>
							)
						}}
						ref={ref => this.flatList = ref}
						onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
						onLayout={() => this.flatList.scrollToEnd({animated: true})}
					/>
					<View style={{
						height: RF(7),
						width: '100%',
						backgroundColor: '#eeeeee',
						justifyContent: 'center',
					}}>
						<TextInput
							style={{
								height: RF(5),
								fontSize: RF(2.5),
								lineHeight: RF(5),
								marginLeft: '5%',
								marginRight: '5%',
								paddingLeft: 10,
								paddingRight: 10,
								width: '90%',
								borderColor: 'grey', 
								borderRadius: RF(2),
								borderWidth: 1,
								backgroundColor: 'white'
							}}
							onSubmitEditing={(event) => {
								this.newMsgTextInput.focus()
								this.sendMessage(event.nativeEvent.text)
							}}
							blurOnSubmit={false}
							ref={input => { this.newMsgTextInput = input }}
							placeholder="Enter Message Here..."
						/>
					</View>
				</View>
				{/* Below is a filler view that have the same size as the keyboard */}
				<View style={{
					height: this.state.keyboardHeight - DEFAULT_TAB_BAR_HEIGHT
				}}></View>
				
      </SafeAreaView>
		);
	}

}
const styles = StyleSheet.create({
	roomTitleView: {
		margin: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	roomTitleText: {
		fontSize: RF(2.5), 
		fontWeight: 'bold'
	},
	roomInfoView: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	roomInfoLeftView: {
		flex: 2
	},
	roomInfoRightView: {
		flex: 1
	},
	roomInfoRightImage: {
		flex: 9,
		margin: 5
	},
	roomInfoRightNameText: {
		flex: 1,
		margin: 5
	},
	roomInfoLeftSpecsView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 5,
		marginBottom: 5
	},
	roomInfoLeftSpecDetailsView: {
		width: '45%',
		marginLeft: '2.5%',
		marginRight: '2.5%',
		marginTop: 5,
		marginBottom: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
})