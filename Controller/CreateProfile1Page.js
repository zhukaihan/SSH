import React, {Component} from 'react';
import ReactNative from 'react-native';
import {StyleSheet,
        Platform,
        View, 
        Text, 
        Button, 
        Alert, 
        TextInput, 
        Picker,
        TouchableOpacity, 
        SafeAreaView, 
        Dimensions, 
        PixelRatio,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import RF from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Hoshi } from 'react-native-textinput-effects';

export default class CreateProfile1Page extends Component{
    constructor(props){
        super(props)
        this.state={
            first_name: "",
            last_name: "",
            name_preferred: "",
            gender: "",
            major: "",
            graduation: "",
            additional_tags: "",
            clean: "",
            wake_early: "",
            smoke:"",
            pets:"",
            description: "",
            items:[
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
            paddingBottom: 10
        }
        this.width= Dimensions.get('window').width;
        this.inputRefs={};
        console.log(Platform.OS)
    }
    
    _checkFirstname = () =>{
        if(this.state.first_name == ""){
            return false
        }
        var firstname_length = this.state.first_name.length;
        for(var i = 0; i < firstname_length; i++){
            var firstname_char = this.state.first_name.charAt(i);
            console.log(firstname_char);
            if(firstname_char < 65 || (firstname_char > 90 && firstname_char < 97) || firstname_char > 123){       
                return false;
            }
        }
        return true;
    }
    _checkLastname = () =>{
        if(this.state.last_name == ""){
            return false
        }
        var lastname_length = this.state.last_name.length;
        for(var i = 0; i < lastname_length; i++){
            var lastname_char = this.state.last_name.charAt(i);
            console.log(lastname_char);
            if(lastname_char < 65 || (lastname_char > 90 && lastname_char < 97) || lastname_char > 123){       
                return false;
            }
        }
        return true;
    }
    backslide = ()=>{
        this.props.navigation.navigate("PrivatePolicy",{

        });
    }
    _checkGender = () =>{
        if(this.state.gender == ""){
            return false
        }
        return true;
    }
    nextslide = () =>{
        if(!this._checkFirstname()){
            Alert.alert(
                'Invalid firstname',
                'Please enter characters only',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
              )
        } else if (!this._checkLastname()){
            Alert.alert(
                'Invalid lastname',
                'Please enter characters only',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
              )
            
        } else if(!this._checkGender()){
            Alert.alert(
                'Invalid gender',
                'Make sure to select a gender',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                { cancelable: false }
              )
        }else{
            console.log(`${this.state.first_name}`)
            this.props.navigation.navigate('CreateProfile2Page',{
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                name_preferred: this.state.name_preferred,
                gender: this.state.gender,
                major: this.state.major,      
                graduation: this.state.graduation,
                additional_tags: this.state.additional_tags,
                clean: this.state.clean,
                wake_early: this.state.wake_early,
                smoke:this.state.smoke,
                pets:this.state.pets,
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

            paddingBottom : 40

        })

    }

    //Method for deleting padding for keyboard inputs
    //for bottom fields
    Delete_Padding=()=>{

        this.setState({

            paddingBottom : 10
        })
    }


    render(){
        return(
            <SafeAreaView style={styles.pageContainer}>
                <View style={styles.objectContainer}>
                    <View style={styles.personalInfo}>
                        <Text numberOfLines= {3}
                        style={styles.personalInfoText}> Create Your Profile </Text>
                    </View>
                    <View>
                        <Text style={styles.textFont}> Personal Information </Text>
                    </View>
                    <View>
                        <Text style={styles.oneOverthree}> 1/3 </Text>
                    </View>
                </View>
                <KeyboardAwareScrollView
                    style={styles.scrollViewStyle}
                    innerRef={ref => {
                        this.scroll = ref
                    }}>
                    <Hoshi
                        style={styles.hoshiStyle}
                        label={'First Name *'}
                        // this is used as active border color
                        borderColor={inputBorderColor}
                        // active border height
                        borderHeight={3}
                        inputPadding={16}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={bgColor}
                        onChangeText={(first_name)=>{this.setState({first_name})}}
                        onFocus={(event: Event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                    />
                    <Hoshi
                        style={styles.hoshiStyle}
                        label={'Last Name *'}
                        // this is used as active border color
                        borderColor={inputBorderColor}
                        // active border height
                        borderHeight={3}
                        inputPadding={16}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={bgColor}
                        onChangeText={(last_name)=>{this.setState({last_name})}}
                        onFocus={(event: Event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                    />
                    <Hoshi
                        style={styles.hoshiStyle}
                        label={'Preferred Name'}
                        // this is used as active border color
                        borderColor={inputBorderColor}
                        // active border height
                        borderHeight={3}
                        inputPadding={16}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={bgColor}
                        onChangeText={(name_preferred)=>{this.setState({name_preferred})}}
                        onFocus={(event: Event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                    />
                    <TouchableOpacity onPress={(event: Event) => {
                        this.inputRefs.picker.togglePicker(true);
                        // `bind` the function if you're using ES6 classes
                        this._scrollToInput(ReactNative.findNodeHandle(event.target))
                    }}>
                        <Hoshi
                            style={styles.hoshiStyle}
                            label={'Gender *'}
                            // this is used as active border color
                            borderColor={inputBorderColor}
                            // active border height
                            borderHeight={3}
                            inputPadding={16}
                            // this is used to set backgroundColor of label mask.
                            // please pass the backgroundColor of your TextInput container.
                            backgroundColor={bgColor}
                            editable={false}
                            pointerEvents='none'
                            value={this.state.gender}
                        />
                    </TouchableOpacity>
                    <View style={{
                        height: 0,
                        width: 0
                    }}>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(itemValue, itemIndex)=> this.setState({gender: itemValue})}
                            placeholder={{label: 'Required', value: null}}
                            items={this.state.items}
                            useNativeAndroidPickerStyle={false}
                            onValueChange={(value) =>{
                                this.setState({
                                    gender:value,
                                });
                            }}
                            value={this.state.gender}
                            ref={(el) =>{
                                this.inputRefs.picker = el;
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
                
                <View style={{width: '100%', flexDirection:'row', height:75, backgroundColor: bgColor, justifyContent: 'space-around'}}>
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

const {width, height, scale} = Dimensions.get('window');

const bgColor = "#F9F7F6"
const inputBorderColor = "#1e89bf"

const styles = StyleSheet.create({
    pageContainer:{
        flex:1,
        flexDirection:"column",
        backgroundColor: bgColor
    },
    personalInfo:{
        width: "90%",
        height: RF(10),
        justifyContent: 'center',
        textAlign:'center',
        backgroundColor: '#00C488',
        borderColor:'#00C488',
        borderRadius: RF(5),
    },
    personalInfoText:{
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
    ast: {
        color: 'red',
        //paddingTop: RF(1.5),
    },
    pickerast: {
        color: 'red',
        paddingTop: RF(1.5),
        textAlign: 'right',
    },
    tinput: {
        flex: 1,
        paddingTop: RF(1.5),
        borderColor: "#235964",
        textAlign:"center",
        fontSize: RF(3),
    },
    tpickerBox: {
        alignItems: "center",
        width:"90%",
        height: "6%",
        borderRadius: 15,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingTop:10,
        paddingBottom: 10,
        marginBottom: RF(3),
        marginRight: RF(3),
        marginLeft: RF( 3),
        textAlign:"center",
        fontSize: RF(5),
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
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: RF(3),
        height: "100%",
        width:"100%",
        borderColor: '#000',
        borderRadius: 4,
        color: 'black',
        textAlign:"center",
        alignSelf: "center"
    },
    inputAndroid:{
        alignSelf: "center",
        fontSize: RF(3),
        height: "100%",
        width:"100%",
        borderColor: '#000',
        borderRadius: 4,
        color: 'black',
        textAlign:"center"
    }
});