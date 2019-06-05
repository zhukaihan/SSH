import React, {Component} from 'react';
import ReactNative, { StyleSheet, View, Text, Button, Alert, TextInput, Picker,TouchableOpacity, SafeAreaView, Dimensions, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RF from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Hoshi } from 'react-native-textinput-effects';



export default class CreateProfile2Page extends Component{
    constructor(props){
        super(props)
        this.first_name = props.navigation.state.params.first_name
        this.last_name = props.navigation.state.params.last_name;
        this.name_preferred = props.navigation.state.params.name_preferred;
        this.gender = props.navigation.state.params.gender;
        this.major = props.navigation.state.params.major;
        this.graduation = props.navigation.state.params.graduation;
        this.additional_tags = props.navigation.state.params.additional_tags;
        this.clean = props.navigation.state.params.clean;
        this.wake_early = props.navigation.state.params.wake_early;
        this.smoke = props.navigation.state.params.smoke;
        this.pets = props.navigation.state.params.pets;
        this.description = props.navigation.state.params.description;
        this.state={
            first_name: this.first_name,
            last_name: this.last_name,
            name_preferred: this.name_preferred,
            gender:this.gender,
            major:this.major,
            graduation:this.graduation,
            additional_tags:this.additional_tags,
            clean:this.clean,
            wake_early:this.wake_early,
            smoke: this.smoke,
            pets: this.pets,
            description:this.description,
            paddingBottom: 10
        }
    }

    _checkMajor = () =>{
        if(this.state.major == ""){
            return false;
        }
        return true;
    }

    _checkGraduation = () => {
        if(this.state.graduation == ""){
            return false;
        }
        console.log(this.state.graduation);
        var graduationYearInNumber = parseInt(this.state.graduation, 10);
        if(graduationYearInNumber > 1900 && graduationYearInNumber < 2030){
            return true;
        }
        return false;
    }
    _checkAdditional_tags = () => {
        if(this.state.additional_tags == ""){
            return false;
        }
        return true;
    }
    backslide = ()=>{
        this.props.navigation.navigate("CreateProfile1Page",{
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            name_preferred: this.state.name_preferred,
            gender: this.state.gender,
            major: this.state.major,      
            graduation: this.state.graduation,
            additional_tags: this.state.additional_tags,
            clean: this.state.clean,
            wake_early: this.state.wake_early,
            description: this.state.description,
            smoke: this.state.smoke,
            pets:this.state.pets
        });
    }
    nextslide=()=> {
        if (!this._checkMajor()) {
            Alert.alert(
                'Invalid Major',
                'Please enter a valid major',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        } else if (!this._checkGraduation()) {
            Alert.alert(
                'Invalid graduation year',
                'Please enter a valid graduation year',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        } else if (!this._checkAdditional_tags()) {
            Alert.alert(
                'Invalid response for interest',
                'Please enter a valid response for interest',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        } else {
            this.props.navigation.navigate("CreateProfile3Page", {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                name_preferred: this.state.name_preferred,
                gender: this.state.gender,
                major: this.state.major,
                graduation: this.state.graduation,
                additional_tags: this.state.additional_tags,
                clean: this.state.clean,
                wake_early: this.state.wake_early,
                smoke: this.state.smoke,
                pets: this.state.pets,
                description: this.state.description,
            });
        }
    }

    _scrollToInput (reactNode: any) {
        // Add a 'scroll' ref to y our ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }

    //Method for adding padding for keyboard inputs
    //on bottom fields
    Add_Padding=()=>{

        this.setState({

            paddingBottom: 40

        })

    }

    //Method for deleting padding for keyboard inputs
    //for bottom fields
    Delete_Padding=()=>{

        this.setState({

            paddingBottom: 10
        })
    }


    render(){
        return(
            <SafeAreaView style={styles.pageContainer}>
                <View style={styles.objectContainer}>
                    <View style={styles.additionalInfo}>
                        <Text numberOfLines= {1}
                        style={styles.additionalInfoText}> Create Your Profile </Text>
                    </View>
                    <View>
                        <Text style={styles.textFont}> Additional Information </Text>
                    </View>
                    <View>
                        <Text style={styles.oneOverthree}> 2/3 </Text>
                    </View>
                </View>
                <KeyboardAwareScrollView
                    style={styles.scrollViewStyle}
                    innerRef={ref => {
                        this.scroll = ref
                    }}
                    scrollEnabled>
                    <Hoshi
                        style={styles.hoshiStyle}
                        label={'Major *'}
                        // this is used as active border color
                        borderColor={inputBorderColor}
                        // active border height
                        borderHeight={3}
                        inputPadding={16}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={bgColor}
                        onChangeText={(major)=>{this.setState({major})}}
                        onFocus={(event: Event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                    />
                    <Hoshi
                        style={styles.hoshiStyle}
                        label={'Expected Graduating Year *'}
                        // this is used as active border color
                        borderColor={inputBorderColor}
                        // active border height
                        borderHeight={3}
                        inputPadding={16}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={bgColor}
                        onChangeText={(graduation)=>{this.setState({graduation})}}
                        onFocus={(event: Event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                    />
                    <Hoshi
                        style={styles.hoshiStyle}
                        label={'Interests and Hobbies *'}
                        // this is used as active border color
                        borderColor={inputBorderColor}
                        // active border height
                        borderHeight={3}
                        inputPadding={16}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={bgColor}
                        onChangeText={(additional_tags)=>{this.setState({additional_tags})}}
                        onFocus={(event: Event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                    />
                
                </KeyboardAwareScrollView>

                <View style={styles.bottomButtonViewStyle}>
                    <TouchableOpacity onPress={this.backslide} style={styles.backButtonStyle}>
                        <Text style={styles.backButtonTextStyle}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.nextslide} style={styles.nextButtonStyle}>
                        <Text style={styles.nextButtonTextStyle}>Next</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const bgColor = "#F9F7F6"
const inputBorderColor = "#1e89bf"

const styles = StyleSheet.create({
    pageContainer:{
        flex:1,
        flexDirection:"column",
        backgroundColor: bgColor
    },
    additionalInfo:{
        width: "90%",
        height: RF(10),
        justifyContent: 'center',
        textAlign:'center',
        backgroundColor: '#00C488',
        borderColor:'#00C488',
        borderRadius: RF(5),
    },
    additionalInfoText:{
        fontSize: RF(4.5),
        fontWeight: 'bold',
        color: "#fff",
        textAlign: 'center',
    },
    objectContainer:{
        justifyContent: 'space-evenly',
        alignItems: "center",
        height: RF(25),
        backgroundColor: bgColor
    },
    scrollViewStyle: {
        flex: 1,
        margin: 10,
        backgroundColor: bgColor
    },
    textFont:{
        fontSize: RF(3.5),
        textAlign: 'center',
        color: 'black'
    },
    oneOverthree:{
        fontSize: RF(2.5),
        textAlign: 'center',
        color: 'grey'
    },
    bottomButtonViewStyle: {
        width: '100%',
        flexDirection:'row',
        height:75,
        backgroundColor: bgColor,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    backButtonStyle:{
        height: "60%",
        width: "35%",
        borderRadius: 5,
        borderColor: "#1e89bf",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    backButtonTextStyle:{
        textAlign:'center',
        fontSize: RF(2),
        color: "#1e89bf",
    },
    nextButtonStyle:{
        height: "60%",
        width: "35%",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e89bf"
    },
    nextButtonTextStyle:{
        textAlign:'center',
        fontSize: RF(2),
        color: "#fff",
    },
    hoshiStyle: {
        width: "90%",
        height: 30,
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: 15,
        marginBottom: 15
    }
})