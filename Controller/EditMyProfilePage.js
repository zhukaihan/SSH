import React, {Component} from 'react';
import RF from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet, View, Text, StatusBar, Dimensions, SafeAreaView, TextInput, Alert } from 'react-native';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import { Badge, Image, Button } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import firebase from 'firebase';
import User from '../Model/User';
import BadgesView from '../View/BadgesView';
import LogInPage from './LogInPage';
import ImageUploader from '../View/ImageUploader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default class ProfilePage extends Component{

	state = {
	}

	constructor() {
		super();

	}

	componentDidMount = async () => {
		var userId = this.props.navigation.getParam("userId");
		if (!userId || userId == "") {
			userId = firebase.auth().currentUser.uid;
		}
		User.getUserWithUID(userId, (user) => {
			this.setState({
				user: user
			})
		})
	}

	changeProfilePic = () => {
		// Display a view to upload image and add the url of the image to house.pictures. 
		if (!this.state.user) {
			return;
		}
		ImageUploader.chooseImageToUpload(`houses/${this.state.user.id}/images`, (url) => {
			this.state.user.profileimage = url;
			this.saveUser();
		})
	}

	saveUser = () => {
		var data = {
				first_name: this.state.user.first_name,
				last_name: this.state.user.last_name,
				name_preferred: this.state.user.name_preferred,
				gender: this.state.user.gender,
				major: this.state.user.major,
				graduation: this.state.user.graduation,
				additional_tags: this.state.user.additional_tags,
				clean: this.state.user.clean,
				wake_early: this.state.user.wake_early,
				description: this.state.user.description,
				profileimage: this.state.user.profileimage,
		}
		firebase.firestore().collection("users").doc(`${this.state.user.id}`).set(Object.assign({}, data), (error) => {
			if (error) {
				Alert.alert(
					'Saving Failed',
					'Please try again later',
					[{text: 'Okay'}],
					{cancelable: false},
				)
			} else {
			}
		})
		.then(() => {
			Alert.alert(
				'Profile Saved',
				'',
				[{text: 'Okay'}],
				{cancelable: false},
			)
			this.forceUpdate();
		})
		
	}

	logout = () => {
		firebase.auth().signOut();
		LogInPage.googleLogout();
		this.props.navigation.navigate("LogInStackNavigator");
	}

	render = () => {
		if (!this.state.user) {
			return (
				<View></View>
			)
		}

		return(
			<SafeAreaView style={styles.safeAreaView}>
				<KeyboardAwareScrollView>
					<View style={styles.pageContainer}>
						<View style={styles.header}>

							<View style={styles.titleContainer}>
								<Text style={styles.title}>My Profile</Text>
								<Button onPress={this.saveUser} title="Save"/>
								<Button onPress={this.logout} title="Logout"/>
							</View>

						</View>
						<View style={styles.mainpage}>
							<View style={styles.star}>
							</View>
							
							<View style={styles.pictureContainer}>
								<Image style={styles.profilePic}
												source={{uri: this.state.user.profileimage, cache: 'force-cache'}} />
								<Button onPress={this.changeProfilePic} title="Change Image"/>
							</View>

							<View style={styles.nameContainer}>
								<TextInput
									style={styles.name}
									defaultValue={this.state.user.first_name}
									onChangeText={(txt) => {this.state.user.first_name = txt}}
									placeholder="First Name"
								/>
								<TextInput
									style={styles.name}
									defaultValue={this.state.user.last_name}
									onChangeText={(txt) => {this.state.user.last_name = txt}}
									placeholder="Last Name"
								/>
								<TextInput
									style={styles.name}
									defaultValue={this.state.user.name_preferred}
									onChangeText={(txt) => {this.state.user.name_preferred = txt}}
									placeholder="Preferred Name"
								/>
								<TextInput
									style={styles.major}
									defaultValue={this.state.user.major}
									onChangeText={(txt) => {this.state.user.major = txt}}
									placeholder="Major"
								/>
								<TextInput
									style={styles.major}
									defaultValue={this.state.user.graduation}
									onChangeText={(txt) => {this.state.user.graduation = txt}}
									placeholder="Graduation Year"
								/>
							</View>

							<RNPickerSelect
								onValueChange={(itemValue) => {this.state.user.gender = itemValue; this.forceUpdate()}}
								placeholder={{label: 'Gender', value: null}}
								placeholderTextColor={'red'}
								items={[
									{ label: 'Male', value:'male' },
									{ label: 'Female', value:'female' },
									{ label: 'Other', value: 'Other' }
								]}
								value={this.state.user.gender}
							/>

							<RNPickerSelect
								onValueChange={(itemValue) => {this.state.user.clean = itemValue; this.forceUpdate()}}
								placeholder={{label: 'Clean', value: null}}
								placeholderTextColor={'red'}
								items={[
									{ label: 'Clean', value:'clean' },
									{ label: 'Messy', value:'messy' }
								]}
								value={this.state.user.clean}
							/>
							
							<RNPickerSelect
								onValueChange={(itemValue) => {this.state.user.wake_early = itemValue; this.forceUpdate()}}
								placeholder={{label: 'Wake Early?', value: null}}
								placeholderTextColor={'red'}
								items={[
									{ label: 'Morning', value:'morning' },
									{ label: 'Night', value:'night' }
								]}
								value={this.state.user.wake_early}
							/>

							<View style={styles.badgeContainer}>
								<BadgesView tags={this.state.user.additional_tags}/>
							</View>

							<View style={styles.descriptionContainer}>
								<Text style={styles.description}>Description</Text>
								<View style={styles.dscriptcontent}>
									<TextInput 
										multiline={true}
										editable = {true}
										defaultValue={this.state.user.description}
										onChangeText={(txt) => {this.state.user.description = txt}}
									/>
								</View>
							</View>

							{/* <View style={styles.preferenceContainer}>
								<TextInput style={styles.description}>Preference</TextInput>
								<View style={styles.dscriptcontent}>
									<TextInput>
										Our house create a extraordinary experience for you to live with Gary, the best CSE professor ever at UCSD. You get to learn a lot of knowledge of software engineering as well as all kinds of work ethic knowledge that will benefit your entire life.
									</TextInput>
								</View>
							</View> */}

							
						</View>
					</View>
				</KeyboardAwareScrollView>
			</SafeAreaView>
		)
	}
}

const {width, height, scale} = Dimensions.get('window');

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		backgroundColor: '#2ea9df'
	},
	pageContainer:{
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#f7f7f7',
		alignItems: 'stretch',
	},

	header:{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2ea9df',
		paddingTop: RF(1),
		paddingBottom: RF(1),
	},

	titleContainer:{
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignSelf: 'center',
	},

	title:{
		color: "white",
		fontSize: RF(4),
	},

	mainpage:{
		alignItems: 'stretch',
		backgroundColor: '#f7f7f7',
	},

	star: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingTop: RF(1),
		paddingRight: RF(0.5),
	},

	pictureContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 2,
	},

	profilePic:{
		width: 0.5 * width,
        height: 0.5 * width,
        alignItems: "center",
		borderRadius: 0.25 * width,
		borderWidth: 1,
		
	},

	nameContainer:{
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems:'center',
	},

	name:{
		fontSize: RF(4),
		fontWeight: '400',
	},

	major:{
		fontSize: RF(2),
	},

	badgeContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingTop: 2,
		paddingBottom: 2,
		borderWidth: 1,
	},

	badges:{
		marginRight: 5,
	},

	badgeText: {
		color: 'white',
		paddingLeft: 10, 
		paddingRight: 10,
	},

	descriptionContainer:{
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingLeft: 10,
		paddingRight: 10,
	},

	description:{
		fontWeight: '400',
		fontSize: RF(3),
		paddingTop: 1,
	},

	descriptcontent:{
		paddingLeft: 2,

	},

	preferenceContainer:{
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 10,
	},


})