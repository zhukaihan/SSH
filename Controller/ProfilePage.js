import React, {Component} from 'react';
import RF from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet, View, Text, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import { Badge, Image, Button } from 'react-native-elements';
import firebase from 'firebase';
import User from '../Model/User';
import BadgesView from '../View/BadgesView';
import MessageCenter from './MessageCenter';
import RoommateFavButton from '../View/RoommateFavButton';


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

	render = () => {
		if (!this.state.user) {
			return (
				<View></View>
			)
		}

		return(
			<SafeAreaView style={styles.safeAreaView}>
				<View style={styles.pageContainer}>
					<View style={styles.header}>

						<View style={styles.titleContainer}>
							<Text style={styles.title}>{this.state.user.first_name}'s Profile</Text>
						</View>
					</View>
					<View style={styles.mainpage}>

						<TouchableOpacity>
                   		 	<View style={{paddingTop: RF(3), paddingRight: RF(3),flexDirection:"row", justifyContent:"flex-end", }}>
                      	 		<RoommateFavButton roommate={this.state.user}/>
                    		</View>
                    	</TouchableOpacity>
						
						<View style={styles.pictureContainer}>
							<Image style={styles.profilePic}
											source={{uri: this.state.user.profileimage, cache: 'force-cache'}} />
						</View>

						<View style={styles.nameContainer}>
							<Text style={styles.name}>{this.state.user.first_name} {this.state.user.last_name}</Text>
							<View style={{flexDirection: 'row', justifyContent: 'center'}}>
								<Text style={styles.major}>{this.state.user.major}</Text>
								<Text> | </Text>
								<Text style={styles.major}>{this.state.user.graduation}</Text>
							</View>
							<View style={{flexDirection: 'row', justifyContent: 'center'}}>
								<Text style={styles.major}>{this.state.user.gender}</Text>
								<Text> | </Text>
								<Text style={styles.major}>{this.state.user.clean}</Text>
								<Text> | </Text>
								<Text style={styles.major}>{this.state.user.wake_early}</Text>
							</View>
						</View>

						{/*<View style={styles.badgeContainer}>
							 <View style={styles.badges}>
								<Badge value={<Text style={styles.badgeText}>Friendly</Text>}>
								</Badge>
							</View>
							<View style={styles.badges}>
								<Badge value={<Text style={styles.badgeText}>Friendly</Text>}>
								</Badge>
							</View>
							<View style={styles.badges}>
								<Badge value={<Text style={styles.badgeText}>Friendly</Text>}>
								</Badge>
							</View> 
							<BadgesView tags={this.state.user.additional_tags}/>
						</View>*/}

						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<View style={styles.line}/>
						</View>

						<View style={styles.descriptionContainer}>

							<Text style={styles.description}>Description</Text>
							<View style={styles.dscriptcontent}>
								<Text>
									{this.state.user.description}
								</Text>
							</View>
						</View>

						{/* <View style={styles.preferenceContainer}>
							<Text style={styles.description}>Preference</Text>
							<View style={styles.dscriptcontent}>
								<Text>
									Our house create a extraordinary experience for you to live with Gary, the best CSE professor ever at UCSD. You get to learn a lot of knowledge of software engineering as well as all kinds of work ethic knowledge that will benefit your entire life.
								</Text>
							</View>
						</View> */}

					</View>

					<View style={{flexDirection: 'row', justifyContent: 'flex-end', height: 300, backgroundColor: '#f7f7f7'}}>
						<View style={{paddingRight: 15,}}>
							<Button
							title="Message"
							onPress={() => {MessageCenter.createRoomWith(this.props.navigation, this.state.user)}}/>
						</View>
					</View>

				</View>
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
		paddingTop: 10,
	},

	profilePic:{
		width: 0.5 * width,
        height: 0.5 * width,
        alignItems: "center",
		borderRadius: 0.25 * width,
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
		paddingTop: 5,
		paddingLeft: 10,
		paddingRight: 10,
		margin: 10,
	},

	description:{
		fontWeight: '400',
		fontSize: RF(3),
		paddingTop: 1,
	},

	line: {
		paddingBottom: 10,
		borderBottomColor: 'black', 
		borderBottomWidth: 1,
		width: 0.7 * width,
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