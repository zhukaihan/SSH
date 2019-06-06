
import { AppRegistry, Platform, Picker, TextInput, Button, View, FlatList, ActivityIndicator, Text, StyleSheet, Dimensions} from 'react-native';
import { ListItem, List , Icon, SearchBar, Input, Image, Overlay} from 'react-native-elements';
import React from 'react';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import 'firebase/firestore' //Must import if you're using firestoreee
import firebase from 'firebase';
import User from '../Model/User';
import { SafeAreaView } from 'react-navigation';
import RoommateFavButton from '../View/RoommateFavButton';
import ImageLoad from 'react-native-image-placeholder';
import RNPickerSelect from 'react-native-picker-select';
import Placeholder, { Line, Media } from "rn-placeholder";

const Items_Per_Page = 21;

export default class RoomateSearchPage extends React.Component{
    state = {
		roommateItems: [],
		displayList: [],
		isFetchingRoommateData: false,
		page: 0,
        searchQuery: "",
        gender: "",
        clean: "",
        major: "",
        wake_early:"",
        smoke: "",
        pets: "",
        advSearchisVisible: false,
        noResult: false,
        genderPicker:[
            {
                label: 'Male', value:'male',
            },
            {
                label: 'Female', value:'female',
            },
            {
                label: 'Other', value: 'Other'
            }
        ],
        cleanPicker:[         
        {
            label: 'Clean', value:'clean',
        },
        {
            label: 'Messy', value:'messy',
        }],
        wake_earlyPicker:[
            {
                label: 'Morning', value:'morning',
            },
            {
                label: 'Night', value:'night',
            }
        ],
        smokePicker:[               
        {
            label: 'Smoke', value:'yes',
        },
        {
            label: 'No Smoke', value:'no',
        }],
        petPicker:[         
        {
            label: 'No Pet', value:'yes',
        },
        {
            label: 'Has Pet', value:'no',
        }],
	}
    constructor(props){
        super(props);
        this.roommateRef = firebase.firestore().collection("users");
		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				curUser: user
			})
		});
    }
    componentWillUnmount = () => {
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

    componentWillMount = async () => {
        this.getRoommateData(this.onSearch);
    }

    getRoommateData = (callback) => {
        this.setState(() => {return {
			displayList:[],
			isFetchingRoommateData: true
		}})
		this.roommateRef.get().then(snapshot => {
			let roommateItems = [];
			snapshot.forEach(roommate => {
                var aUser = new User(roommate.data(), roommate.id);
                if(aUser.availability == true && aUser.id != this.state.curUser.id){
                    roommateItems.push(aUser);
                }
			});
			this.setState(() => {return {
				roommateItems: roommateItems,
                page: 0,
            }}, () => {
                if (callback) {
                    callback();
                } else {
                    this.setState({
                        isFetchingRoommateData: false
                    });
                }
            });
			
		});
    }

    onRefresh = () => {
        this.getRoommateData(this.onSearch);
    }

    LoadMore = () => {
		if(this.state.roommateItems == null)
		{
			this.getRoommateData();
		}
		this.setState({
			page: page + 1,
		});
	}

    onSearch = () => {
        this.setState(() => {return {
			isFetchingRoommateData: true
        }})
        this.state.displayList = []

        var newData = this.state.roommateItems.filter(item =>{

            if(this.state.gender && this.state.gender != "" && item.gender != this.state.gender) {
                return false;
            }
            if(this.state.clean && this.state.clean != "" && item.clean != this.state.clean) {
                return false;
            }
            if(this.state.major && this.state.major != "" && item.major != this.state.major) {
                return false;
            }
            if(this.state.wake_early && this.state.wake_early != "" && item.wake_early != this.state.wake_early) {
                return false;
            }
            if(this.state.smoke && this.state.smoke != "" && item.smoke != this.state.smoke) {
                return false;
            }
            if(this.state.pets && this.state.pets != "" && item.pets != this.state.pets) {
                return false;
            }
            
            if (this.state.searchQuery == "") {
                return true;
            }

            const ItemData = `${item.first_name.toUpperCase()}
            ${item.last_name.toUpperCase()}
            ${item.name_preferred.toUpperCase()}`;
            const textData = this.state.searchQuery.toUpperCase();

            return ItemData.indexOf(textData) > -1;
        })

        this.setState(() => {return {
            page: 0,
            displayList: newData,
            isFetchingRoommateData: false
        }});
    }

	searchAndUpdateWithQuery = async searchQuery => {
        this.setState({ searchQuery }, () => {this.onSearch();});
	};

    GoTo = (userId) => {
        this.props.navigation.push("ProfilePage", {
            userId: userId
        });
    }
	
	clearFilter = () =>{  
        this.setState({
            gender: "",
            clean: "",
            major: "",
            wake_early: "",
            smoke: "",
            pets: "",
        })
		this.onSearch();
	}
	applyFilter = async () =>{
		this.setState({
			advSearchisVisible:false,
		})
		this.onSearch();
	}

	cancelFilter = () =>{
		this.setState({
			advSearchisVisible:false,
		})
	}
    
    renderItem = (item) => {
        if(item.profileimage){
            var image = item.profileimage
        }
        if (this.state.isFetchingRoommateData) {
            return (
                <Placeholder style={styles.container} animation='fade'>
                    <View style={styles.roommateContainer} onPress={() => this.GoTo(item.id)}>
                        
                        <View style={styles.roommateIcon}>

                            <View>
                                <View style={{ flexDirection:"row", justifyContent:"flex-end"}}>
                                    <Media style={{width: 26, height: 26}}/>
                                </View>
                            </View>

                            <View style = {{flexDirection: 'row' , justifyContent: "center"}}> 
                                <Media style={{...styles.profilePic, backgroundColor: '#3EB9EF'}}/>
                            </View>
                            
                        </View>

                        <View style={{flex:.4 ,alignItems: "center"}}>
                            <Line/>
                            <Line/>
                        </View>

                    </View>
                </Placeholder>
            )
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
		const { page } = this.state;
		const end = (page+1)*Items_Per_Page-1;
		if(this.state.displayList.length > end){
            end = this.state.displayList.length
        }
        var displayData = this.state.displayList.slice(0,end);
        let isRefreshing = this.state.isFetchingRoommateData;
        return(
            <SafeAreaView style={{flex: 1, backgroundColor: '#2EA9DF'}}>
                <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
                <SearchBar
						placeholder="Search for Name"
						lightTheme={true}
						round={true}
						containerStyle={{backgroundColor: '#2EA9DF', borderTopWidth: 0}}
						inputContainerStyle={{backgroundColor: 'white', marginStart:30, marginEnd:30, width: '85%', flexDirection: 'row-reverse'}}
						onChangeText={this.searchAndUpdateWithQuery}
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
                    <TouchableOpacity onPress={()=> this.setState({advSearchisVisible:true})}>
                        <View style={styles.advanceContainer}>
							<Text>Advance Search</Text>
						</View>
					</TouchableOpacity>
                    <Overlay
                        isVisible={this.state.advSearchisVisible}
                        overlayStyle={styles.overlay}
						width="auto"
						height="auto"
						onBackdropPress={() =>
							this.setState({advSearchisVisible: false})
						}
					>
					    <View style={{flexDirection:"column"}}>
					        <View style={styles.OverlayContainer}>
						        <Text style={{fontSize:RF(2.5)}}>Gender:</Text>
                                <RNPickerSelect
                                    style={{...pickerSelectStyles}}
                                    onValueChange={(itemValue, itemIndex)=> this.setState({gender: itemValue})}
                                    placeholder={{label: 'Select Here', value: ""}}
                                    items={this.state.genderPicker}
                                    onValueChange={(value) =>{
                                        this.setState({
                                        gender:value,
                                    });
                                    }}
                                    value={this.state.gender}/>
						    </View>
						
                            <View style={styles.OverlayContainer}>
						        <Text style={{fontSize:RF(2.5)}}>Clean:</Text>
                                <RNPickerSelect
                                    style={{...pickerSelectStyles}}
                                    onValueChange={(itemValue, itemIndex)=> this.setState({clean: itemValue})}
                                    placeholder={{label: 'Select Here', value: ""}}
                                    items={this.state.cleanPicker}
                                    onValueChange={(value) =>{
                                        this.setState({
                                        clean:value,
                                    });
                                    }}
                                    value={this.state.clean}/>
						    </View>

						    <View style={styles.OverlayContainer}>
						        <Text style={{fontSize:RF(2.5)}}>Wake Early:</Text>
                                <RNPickerSelect
                                    style={{...pickerSelectStyles}}
                                    onValueChange={(itemValue, itemIndex)=> this.setState({wake_early: itemValue})}
                                    placeholder={{label: 'Select Here', value: ""}}
                                    items={this.state.wake_earlyPicker}
                                    onValueChange={(value) =>{
                                        this.setState({
                                        wake_early:value,
                                    });
                                    }}
                                    value={this.state.wake_early}/>
						    </View>

					    	<View style={styles.OverlayContainer}>
						        <Text style={{fontSize:RF(2.5)}}>Smoke:</Text>
                                <RNPickerSelect
                                    style={{...pickerSelectStyles}}
                                    onValueChange={(itemValue, itemIndex)=> this.setState({smoke: itemValue})}
                                    placeholder={{label: 'Select Here', value: ""}}
                                    items={this.state.smokePicker}
                                    onValueChange={(value) =>{
                                        this.setState({
                                        smoke:value,
                                    });
                                    }}
                                    value={this.state.smoke}/>
						    </View>
						    
                            <View style={styles.OverlayContainer}>
						    <Text style={{fontSize:RF(2.5)}}>Pets:</Text>
                            <RNPickerSelect
                                style={{...pickerSelectStyles}}
                                onValueChange={(itemValue, itemIndex)=> this.setState({pets: itemValue})}
                                placeholder={{label: 'Select Here', value: ""}}
                                items={this.state.petPicker}
                                onValueChange={(value) =>{
                                this.setState({
                                    pets:value,
                                      });
                                 }}
                             value={this.state.pets}/>
						    </View>
						    <View style={{flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
								<TouchableOpacity onPress={
									this.applyFilter
								}>
									<Text style={styles.advanceButton}>Apply Filter</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={
									this.cancelFilter
								}>
									<Text style={styles.advanceButton}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={
									this.clearFilter
								}>
									<Text style={styles.advanceButton}>Clear</Text>
								</TouchableOpacity>
						    </View>
                        </View>
					</Overlay>
                    <View>
						{
							this.state.displayList.length == 0 && !this.state.isFetchingRoommateData ? <Text style={{fontSize: RF(2.5)}}> There is no result that matches your filter</Text> : null
						}
					</View>
                    <FlatList 
                        keyExtractor={(item, index) => {return index}}
						data={isRefreshing ? ["", "", "", "", "", ""] : displayData}
						onRefresh={this.onRefresh}
						refreshing={false}
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

    overlay: {
		borderWidth: 5,
		borderRadius: 10,
		borderColor: "#fff",
    },
    
    advanceContainer: {
		backgroundColor: '#E2DFDF',
		borderColor:'#E2DFDF',
		borderWidth: 10,
		borderBottomRightRadius: 10,
		borderBottomLeftRadius: 10,
		justifyContent: "center",
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
    },
    OverlayContainer:{
		justifyContent:"center",
		alignItems:"center",
		flexDirection:"row",
		height: "auto",
		width: 'auto',
	},
	textInput:{
		borderWidth:1,
		borderColor:"#fff",
    },
    
    advanceButton: {
		margin: 10,
		borderWidth: 3,
		borderRadius: 10,
		textAlign: 'center',
		width: "100%",
		fontSize:RF(2.5),
		backgroundColor:"#fff",
		alignItems: "center",
		justifyContent: "center",
    }
})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",
        margin: 8,
        fontSize: RF(2.5),
        color: '#fff',
        /*fontSize: RF(3),
        height: "20%",
        width: "20%",
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        backgroundColor: 'blue',
        color: 'black',
        textAlign:"center",*/
        /*borderWidth: 1,
		borderRadius: 10,
		paddingLeft: RF(1),
		paddingRight: RF(1),
        margin: 8,
        justifyContent:'center',
        alignItems:'center',
		textAlign:'center',
		fontSize:RF(2.5),
		color: "#fff",
		height: "60%",
		width: "25%",
		backgroundColor:"#2ea9df",
		borderColor:"#2ea9df",*/
    },
    
});






