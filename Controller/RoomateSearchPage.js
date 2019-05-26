import { AppRegistry, Platform, Picker, TextInput, Button, View, FlatList, ActivityIndicator, Text, StyleSheet, Image, Dimensions} from 'react-native';
import { ListItem, List , SearchBar, Input} from 'react-native-elements';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import 'firebase/firestore' //Must import if you're using firestoreee
import firebase from 'firebase';
import User from '../Model/User';
import { SafeAreaView } from 'react-navigation';

export default class RoomateSearchPage extends React.Component{
    constructor(props){
        super(props);
        //this.GoTo = this.GoTo.bind(this);
        this.state={
            hello: '',
            items : [],
            loading: false,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        };
        //this.ref is just a easier reference to use function like db.collection("users");
        // collection is a function from firestore, that basically load onto the data you specify
        //"users" is the name of the data document
        //firestore uses "subscriptions", it means that as long as you're subscribe,
        //you will continuous getting data. this varialbe is when we close the screen, we
        //shut off the constant stream of data coming in.
        this.ref = firebase.firestore().collection("users");
				this.unsubscribe = null;
    }
    //componentDidMount is a function called when this page is being called.
    //as the name suggested, 
    componentDidMount(){
        this.ref.get().then(this.onCollectionUpdate);
        //this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
            //Here we use it to set the subscription and also call onCollectionUpdate.

    }
    componentWillUnmount(){
    //this function will close the subsciption when user stop using this page
        //this.unsubscribe();
    }
    _getImage(){
				firebase.firestore().ref(``).child(`profileImage.jpg`).getDownloadURL().then(function(url){
            var xhr = new XMLHttpRequest();
            xhr.onload = function(event){
                var blob = xhr.response;
            };
            xhr.open('GET',url);
            xhr.send();

            var img = document.getElementbyId('myimg');
            img.src = url;
            return img;
        }).catch(function(error){

        });
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
                        <Icon name={"staro"} size={20}></Icon>
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

    handleRefresh = () => {
        this.setState({
            page:1,
            seed: this.state.seed + 1,
            refreshing: true
        },
        () => {
            this.renderItem();
        }
        );
    };

    renderFooter = () =>{
        if(!this.state.loading) return null;
        return(
            <View
                style={{
                    paddingVertical:20,
                    borderTopWidth:1,
                }}
                >
                <ActivityIndicator animating size="large"/>
                </View>
        );
    }

    renderHeader = () =>{
        return <SearchBar placeholder="Type Here..."/>;
    };

    renderSeparator = () =>{
        return (
            <View
            style={{ height:1,
            width: "86%",
            backgroundColor: "blue",
            marginLeft: "14%"}}
                />
        );
    };
    _keyExtractor = (item, index) => {index.toString()}

    render = () => {
        
        return(
            <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7F7'}} forceInset={{'top': 'never'}}>
            <View style={{backgroundColor: '#f7f7f7'}}>
                <View style={{margin: 0}}>
                    <SearchBar
						placeholder="Search Keywords"
						lightTheme={true}
						round={true}
						containerStyle={{backgroundColor: '#2EA9DF', height: 100}}
						inputContainerStyle={{backgroundColor: 'white', marginStart:30, marginEnd:30, marginTop: 30, width: '85%'}}
						onChangeText={this.updateSearchQuery}
						value={this.state.searchQuery}
					/>
                </View>
                <FlatList 
					keyExtractor={(item, index) => {return item.id}}
                    data={this.state.items}
                    renderItem={({item}) => {return this.renderItem(item)}}  
                    numColumns={2}       
                />
            </View>
            </SafeAreaView>
        );
    };
}

class SearchBars extends React.Component{
    render(){
        const Nothing = () =>{

        };
        return(
            <View style={styles.searchBar}>
                <Input placeholder="type something"
                    >
                </Input>                
            </View>
        )
    }
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







