import React, {Component} from 'react';
import RF from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet, View, Text, StatusBar, Dimensions, SafeAreaView, TextInput, Alert, Switch } from 'react-native';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import { Badge, Image, Button, withTheme, Avatar } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import firebase from 'firebase';
import User from '../Model/User';
import BadgesView from '../View/BadgesView';
import LogInPage from './LogInPage';
import ImageUploader from '../View/ImageUploader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {width, height, scale} = Dimensions.get('window');

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
				availability: this.state.user.availability,
		}

		if (data.availability) {
			if (data.first_name == "") {
				Alert.alert(
					'Add some first name... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (data.last_name == "") {
				Alert.alert(
					'Add some last name... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (data.gender == "") {
				Alert.alert(
					'Add some gender... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (data.major == "") {
				Alert.alert(
					'Add some major... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (data.graduation == "") {
				Alert.alert(
					'Add some graduation year... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (data.clean == "") {
				Alert.alert(
					'Add some cleaniness... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (data.wake_early == "") {
				Alert.alert(
					'Add some general wake up time... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
			if (data.description == "") {
				Alert.alert(
					'Add some description... ',
					'',
					[{text: 'Okay'}],
					{cancelable: false},
				)
				return;
			}
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

							<TouchableOpacity onPress={this.logout} style={styles.logButtonnull}>
								<Text style={{color: '#2ea9df', fontSize: RF(2.5)}}>Logout</Text>
							</TouchableOpacity>

							<Text style={styles.title}>My Profile</Text>

							<TouchableOpacity onPress={this.logout} style={styles.logButton}>
								<Text style={{color: 'white', fontSize: RF(2.5)}}>Logout</Text>
							</TouchableOpacity>

						</View>

						<View style={styles.mainpage}>
							
							<View style={styles.pictureContainer}>
								<Avatar size={0.5*width} rounded={true} showEditButton={true} 
										source={{uri: this.state.user.profileimage, cache: 'force-cache'}} 
										onEditPress={this.changeProfilePic}/>
						
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
									defaultValue={"(" + this.state.user.name_preferred + ")"}
									onChangeText={(txt) => {this.state.user.name_preferred = txt}}
									placeholder="Preferred Name"
								/>
							</View>

							<View style={styles.infoContainer}>
					
								<TextInput
									style={styles.major}
									defaultValue={this.state.user.major}
									onChangeText={(txt) => {this.state.user.major = txt}}
									placeholder="Major"
								/>
								<Text> | </Text>
								<TextInput
									style={styles.major}
									defaultValue={"Graduate at " + this.state.user.graduation}
									onChangeText={(txt) => {this.state.user.graduation = txt}}
									placeholder="Graduation Year"
								/>
							</View>

							<View style={styles.infotwoContainer}>
								<RNPickerSelect
									onValueChange={(itemValue) => {this.state.user.gender = itemValue; this.forceUpdate()}}
									placeholder={{}}
									items={[
										{ label: 'Male', value:'male' },
										{ label: 'Female', value:'female' },
										{ label: 'Other', value: 'Other' }
									]}
									value={this.state.user.gender}
								/>

								<Text> | </Text>

								<RNPickerSelect
									onValueChange={(itemValue) => {this.state.user.clean = itemValue; this.forceUpdate()}}
									placeholder={{}}
									items={[
										{ label: 'Clean', value:'clean' },
										{ label: 'Messy', value:'messy' }
									]}
									value={this.state.user.clean}
								/>

								<Text> | </Text>
								
								<RNPickerSelect
									onValueChange={(itemValue) => {this.state.user.wake_early = itemValue; this.forceUpdate()}}
									placeholder={{}}
									items={[
										{ label: 'Morning', value:'morning' },
										{ label: 'Night', value:'night' }
									]}
									value={this.state.user.wake_early}
								/>

							</View>

							

							<View style={styles.buttonContainer}>

								<View style={styles.line}/>

								<View style={styles.findButton}>
									<Text style={styles.findText}>I want to be found by others: </Text>
									<Switch
										onValueChange={() => {this.state.user.availability = !this.state.user.availability; this.forceUpdate()}}
										value={this.state.user.availability}
									/>
								</View>
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

						<View style={{flexDirection: 'row', justifyContent: 'flex-end', height: 300, backgroundColor: '#f7f7f7'}}>
							<View style={{paddingRight: 15,}}>
								<Button style={styles.saveButton} onPress={this.saveUser} title="Save"/>
							</View>
						</View>

					</View>
				</KeyboardAwareScrollView>
			</SafeAreaView>
		)
	}
}

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
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#2ea9df',
		paddingTop: RF(1),
		paddingBottom: RF(1),
	},

	title:{
		color: "white",
		fontSize: RF(4),
	},

	logButton:{
		backgroundColor: '#cb1b45',
		padding: 8,
		borderRadius: 5,
		color: 'white',
		marginRight: 10,
	},

	logButtonnull:{
		backgroundColor: '#2ea9df',
		color: '#2ea9df',
		padding: 5,
		borderRadius: 5,
		marginLeft: 10,
	},

	saveButton:{

	},

	mainpage:{
		alignItems: 'stretch',
		backgroundColor: '#f7f7f7',
	},

	pictureContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 10,
	},

	nameContainer:{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems:'center',
		paddingTop: 5,
	},

	infoContainer:{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems:'center',
	},

	infotwoContainer:{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems:'center',
		paddingTop: 3,
		paddingBottom: 5,
	},

	name:{
		fontSize: RF(4),
		fontWeight: '400',
		paddingLeft: 5,
	},

	major:{
		fontSize: RF(2),
	},

	line: {
		paddingBottom: 10,
		borderBottomColor: 'black', 
		borderBottomWidth: 1,
		width: 0.7 * width,
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

	buttonContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},

	findButton: {
		flexDirection: 'row',
		paddingTop: 8,
	},

	findText:{
		paddingTop: 2,
		fontSize: RF(2.5),
	},

	descriptionContainer:{
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingLeft: 10,
		paddingRight: 10,
		margin: 10
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