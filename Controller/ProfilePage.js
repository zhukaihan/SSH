import React, {Component} from 'react';
import RF from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet, View, Image, Text, StatusBar, Dimensions, SafeAreaView } from 'react-native';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import { Badge } from 'react-native-elements';
import User from '../Model/User';
import BadgesView from '../View/BadgesView';


export default class ProfilePage extends Component{

	constructor() {
		super();

		let userId = this.props.navigation.getParam("userId");
		User.getUserWithUID(userId, (user) => {
			this.setState({
				user: user
			})
		})
	}

	render(){
		if (!this.state.user) {
			return (
				<View></View>
			)
		}

		return(
			<View style={styles.pageContainer}>
				<View style={styles.header}>

					<View style={styles.titleContainer}>	
						<TouchableOpacity>
							<Icon name={"left"} size={RF(4)} color="white"></Icon>
						</TouchableOpacity>
						<Text style={styles.title}>{this.state.user.first_name}'s Profile</Text>
					</View>

				</View>
				<View style={styles.mainpage}>
					<View style={styles.star}>
						<TouchableOpacity>
							<Icon name={"staro"} size={20}></Icon>
						</TouchableOpacity>
					</View>
					
					<View style={styles.pictureContainer}>
						<Image style={styles.profilePic}
                    source={{uri: this.state.user.profileimage}} />
					</View>

					<View style={styles.nameContainer}>
						<Text style={styles.name}>{this.state.user.first_name} {this.state.user.last_name}</Text>
						<Text style={styles.major}>{this.state.user.major}</Text>
					</View>

					<View style={styles.badgeContainer}>
						{/* <View style={styles.badges}>
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
						</View> */}
						<BadgesView tags={this.state.user.additional_tags}/>
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
			</View>
		)
	}
}

const {width, height, scale} = Dimensions.get('window');

const styles = StyleSheet.create({

	pageContainer:{
		flex: 1,
		flexDirection: 'column',
		backgroundColor: '#2ea9df',
		alignItems: 'stretch',
	},

	header:{
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: 1.1 * height / 10,
		backgroundColor: '#2ea9df',
	},

	titleContainer:{
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: RF(4),
		paddingLeft: RF(1),
	},

	title:{
		color: "white",
		paddingLeft: RF(1),
		paddingBottom: 2,
		fontSize: RF(4),
	},

	mainpage:{
		alignItems: 'stretch',
		backgroundColor: '#f7f7f7',
		height: 8.9 * height / 10,
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
		borderWidth: 1,
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