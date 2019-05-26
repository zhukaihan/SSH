
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";

export default class FavRoommatePage extends React.Component{
	state = {
		roommateItems: [],
		isFetchingRoommateData: true
	}

	// Get roommate data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getRoommateData = () => {

		this.setState({
			isFetchingRoommateData: true,
			roommateItems: []
		})

		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
            })
            console.log("user's roommate fav " + user.roommate_favorite);
			user.roommate_favorite.forEach((roommate) => {
				roommate.get().then((snapshot) => {
                    console.log("roommate gotten " + snapshot.id);
					this.state.roommateItems.push(new User(snapshot.data(), snapshot.id));
					this.forceUpdate();
				})
			})
			this.setState({
				isFetchingRoommateData: false
			});
		});
	}

	openRoommate = (roommate) => {
		this.props.navigation.push("ProfilePage", {
			userId: roommate.id,
		});
	}

	componentWillMount() {
		this.getRoommateData();
	}

    renderItem = (item) => {
        if(item.profileimage){
            var image = item.profileimage
        }
        console.log("renderItem " + item);
        return( 
            <View style={styles.container}>
            <TouchableOpacity style={styles.roommateContainer} onPress={() => this.GoTo(item.id)}>
                
                <View style={styles.roommateIcon}>

                    <TouchableOpacity>
                    <View style={{ flexDirection:"row", justifyContent:"flex-end", }}>
                        <RoommateFavButton roommate={item}/>
                    </View>
                    </TouchableOpacity>

                    <View style = {{flexDirection: 'row' , justifyContent: "center"}}> 
                        <Image style={styles.profilePic}
                            source={{uri: image}} />
                    </View>
                    
                </View>

                <View style={{flex:.4 ,alignItems: "center"}}>
                    <Text>{item.first_name} {item.last_name}</Text>
                    <Text>{item.graduation} | {item.major}</Text>
                </View>

            </TouchableOpacity>
            </View>
        )
    }

	render = () => {
        console.log("render state " + this.state.roommateItems);

		return (
			<SafeAreaView style={{flex: 1, backgorundColor: '#2EA9DF'}}>
				<FlatList 
					keyExtractor={(item, index) => {return item.id}}
                    data={this.state.roommateItems}
                    renderItem={({item}) => {return this.renderItem(item)}}  
                    numColumns={2}
                />
            </SafeAreaView>
		);
	}

}


const styles = StyleSheet.create({
})