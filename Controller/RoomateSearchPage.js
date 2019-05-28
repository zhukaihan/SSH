import { AppRegistry, Platform, Picker, TextInput, Button, View, FlatList, ActivityIndicator, Text, StyleSheet, Dimensions} from 'react-native';
import { ListItem, List , Icon, SearchBar, Input, Image} from 'react-native-elements';
import React from 'react';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import 'firebase/firestore' //Must import if you're using firestoreee
import firebase from 'firebase';
import User from '../Model/User';
import { SafeAreaView } from 'react-navigation';
import RoommateFavButton from '../View/RoommateFavButton';

const Items_Per_Page = 21;

export default class RoomateSearchPage extends React.Component{
    state = {
		roommateItems: [],
		displayList: [],
		isFetchingHouseData: true,
		page: 0,
		searchQuery: ""
	}
    constructor(props){
        super(props);
        this.roommateRef = firebase.firestore().collection("users");
		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
		});
		this.unsubscribe = null;
    }
    componentWillUnmount(){
    //this function will close the subsciption when user stop using this page
        this.unsubscribe();
    }
    //OnColectionUpdate = (querysnapshot) =>{} 
    // onCollectionUpdate is just a function that we called. we can rename it anything else.
    // = (queryshot) querysnapshot is a paramater, that contain zero or more documentsnapshot objects
    // as the result of a query(back end command with database)
    //we pass in queryshot in order to use its forEach function,
    //forEach a for loop running through each user(in this case) you have in the data.
    onCollectionUpdate = (querySnapshot) =>{
        const items = [];//create a temp variable to hold all data before storing
        querySnapshot.forEach((doc) => {
            items.push(new User(doc.data(), doc.id));
            // const { first_name,last_name,graduation,major,profileimage } = doc.data();
            // // login_email is the data_title in our database that contains
            // // the login_email of certain user. 
            // items.push({
            //     key: doc.id,
            //     doc,
            //     first_name,
            //     last_name,
            //     graduation,
            //     major,
            //     profileimage,        //We just put all the information into items to process it later.
            // });
        });

        //Set the state for the items array.
        this.setState({
            items
        });
    }

    componentWillMount(){
        this.getRoommateData();
    }

    getRoommateData = () => {
        this.setState({
			displayList:[],
			isFetchingHouseData: true
		})
		const zero = 0;
		this.roommateRef.get().then(snapshot => {
			let roommateItems = [];
			snapshot.forEach(roommate => {
				var aUser = new User(roommate.data(), roommate.id);
				roommateItems.push(aUser);
			});
			this.setState({
				roommateItems: roommateItems,
				page: zero,
			});
			const { page, displayList } = this.state;
			const start = page*Items_Per_Page;
			const end = (page+1)*Items_Per_Page-1;
			var newData = roommateItems.slice(start,end);
			this.setState({
				displayList:[...displayList,...newData],
				page:page+1,
				isFetchingHouseData: false
			});
		});
    }

    onRefresh = () => {
        if( this.state.searchQuery == ""){
            this.getRoommateData();
        }
        else{
        const zero = 0;
        this.setState({
            displayList:[],
			isFetchingHouseData: true,
			page: zero,
		})
		const { page } = this.state;
		const start = page*Items_Per_Page;
		const end = (page+1)*Items_Per_Page-1;
		var newData = this.state.displayList.slice(start,end);
		this.setState({
			displayList:[...newData],
			page:page+1,
			isFetchingHouseData: false
        });
    }
    }

    LoadMore = () => {
        console.log("load data");
		if(this.state.roommateItems == null)
		{
			this.getRoommateData();
		}
		this.setState({
			isFetchingHouseData: true
		})
		const { page, displayList } = this.state;
		const start = page*Items_Per_Page;
		const end = (page+1)*Items_Per_Page-1;
		console.log("start:" + start);
		console.log("end" + end);
		if(this.state.roommateItems.length > end){
		var newData = this.state.roommateItems.slice(start,end);
		this.setState({
			displayList:[...displayList,...newData],
			page:page+1,
			
		});
		this.setState({
			isFetchingHouseData: false
		});
	}
    }

    onSearch = () => {
        this.setState({
			displayList:[],
			isFetchingHouseData: true
		})
		if(this.state.searchQuery == ""){
			this.onRefresh;
        }
        const newData = this.state.roommateItems.filter(item =>{
            const ItemData = `${item.first_name.toUpperCase()}
            ${item.last_name.toUpperCase()}`;
            const textData = this.state.searchQuery.toUpperCase();
            return ItemData.indexOf(textData) > -1;
        })
        this.setState({displayList: newData,
            isFetchingHouseData: false});

    }

	updateSearchQuery = searchQuery => {
        this.setState({ searchQuery });
        const newData = this.state.roommateItems.filter(item =>{
            const ItemData = `${item.first_name.toUpperCase()}
            ${item.last_name.toUpperCase()}
            ${item.name_preferred.toUpperCase()}`;
            const textData = searchQuery.toUpperCase();
            return ItemData.indexOf(textData) > -1;
        })
        this.setState({displayList: newData})
	};

    GoTo = (userId) => {
        this.props.navigation.push("ProfilePage", {
            userId: userId
        });
    }
    
    renderItem = (item) => {
        if(item.profileimage){
            var image = item.profileimage
        }
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
                            source={{uri: image, cache: 'force-cache'}} />
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
        
        return(
            <SafeAreaView style={{flex: 1, backgroundColor: '#2EA9DF'}}>
                <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
                <SearchBar
						placeholder="Search for Name"
						lightTheme={true}
						round={true}
						containerStyle={{backgroundColor: '#2EA9DF', height: 70, borderTopWidth: 0}}
						inputContainerStyle={{backgroundColor: 'white', marginStart:30, marginEnd:30, width: '85%', flexDirection: 'row-reverse'}}
						onChangeText={this.updateSearchQuery}
						value={this.state.searchQuery}
                        onClear={this.onRefresh}
                        onSubmitEditing={this.onSearch}
						searchIcon={
							<TouchableOpacity onPress={this.onSearch}>
								<View style={{paddingRight: 10,}}>
									<Icon name="search" type="font-awesome" color='darkgrey' />
								</View>
							</TouchableOpacity>
						}

                    />
                    <FlatList 
                        keyExtractor={(item, index) => {return item.id}}
						data={this.state.displayList}
						onRefresh={this.onRefresh}
						refreshing={this.state.isFetchingHouseData}
						onEndReached={this.loadMore}
						onEndReachedThreshold={0.7}
                        renderItem={({item}) => {return this.renderItem(item)}}  
                        numColumns={2} 
                        style={{
                            flex: 1
                        }}      
                    />
                </View>
            </SafeAreaView>
        );
    };
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        marginLeft: 16,
        marginRight:16,
        justifyContent: 'space-between',
        marginTop:8,
        marginBottom:8,
        borderRadius:5,
        backgroundColor: '#FFF',
        elevation:2,
        alignItems: "center",
    },
    profilePic:{
        width: 120,
        height: 120,
        alignItems: "center",
        borderRadius:120/2,
        margin:5,

    },
    roommateIcon:{
        flex:.6,
        flexDirection:'column',
    },
    roommateText:{
        flexDirection: 'column',
    },
    roommateContainer:{
        flex:.45,
        flexDirection:'column', 
        justifyContent: "center"
    },
    searchBar:{
        marginLeft:10,
        marginRight:10,
    }
})







