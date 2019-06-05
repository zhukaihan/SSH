import React, {Component} from 'react';
import ReactNative, { Platform,StyleSheet, View, Text, Button, Alert, TextInput,TouchableOpacity, Picker,SafeAreaView } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Hoshi } from 'react-native-textinput-effects';



export default class CreateProfile3Page extends Component{
    constructor(props){
        super(props)
        this.first_name = props.navigation.state.params.first_name;
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
            smoke:this.smoke,
            pets:this.pets,
            description:this.description,
            cleanPicker:[                {
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
                    label: 'No', value:'no',
                },
                {
                    label: 'Yes', value:'yes',
                }
            ],
            petsPicker:[
                {
                    label: 'No', value:'no',
                },
                {
                    label: 'Yes', value:'yes',
                }
            ],
            paddingBottom: 10
        }
        this.inputRefs = {};
    }

    _checkCleanOrMessy = () =>{
        if(this.state.clean == ""){
            return false;
        }
        return true;
    }
    _checkMorningOrNight = () =>{
        if(this.state.wake_early == ""){
            return false;
        }
        return true;
    }

    _checkSmokeOrNotSmoke = () =>{
        if(this.state.smoke == ""){
            return false;
        }
        return true;
    }

    _checkPetsOrNoPets = () =>{
        if(this.state.pets == ""){
            return false;
        }
        return true;
    }

    _checkDescription = () =>{
        if(this.state.description == ""){
            return false;
        }
        var wordCounter = 0;
        for(var i = 0; i < this.state.description.length; i++){
            if(this.state.description.charAt(i) == ' '){
                wordCounter++;
            }
        }
        if(wordCounter < 10){
            return false;
        }
        return true;
    }

    backslide =() =>{
        this.props.navigation.navigate("CreateProfile2Page",{
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
            description: this.state.description});
    }
    nextslide = () => {
        if (!this._checkCleanOrMessy()) {
            Alert.alert(
                'Invalid selection',
                'Please select clean or messy',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        } else if (!this._checkMorningOrNight()) {
            Alert.alert(
                'Invalid selection',
                'Please select morning or night',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        } else if (!this._checkSmokeOrNotSmoke()){
            Alert.alert(
                'Invalid selection',
                'Please select a preference for smoking',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        } else if (!this._checkPetsOrNoPets()){
            Alert.alert(
                'Invalid selection',
                'Please select a preference for pets',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        }
        else {
            console.log(`${this.state.first_name}`);
            this.props.navigation.navigate("AddProfilePage", {
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

            paddingBottom : 130

        })

    }

    //Method for deleting padding for keyboard inputs
    //for bottom fields
    Delete_Padding=()=>{

        this.setState({

            paddingBottom : 30
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
                        <Text style={styles.oneOverthree}> 3/3 </Text>
                    </View>
                </View>
                <KeyboardAwareScrollView
                    style={styles.scrollViewStyle}
                    innerRef={ref => {
                        this.scroll = ref
                    }}>
                    <TouchableOpacity onPress={(event: Event) => {
                        this.inputRefs.cleanPicker.togglePicker(true);
                    }}>
                        <Hoshi
                            style={styles.hoshiStyle}
                            label={'Are you generally a clean or messy person? *'}
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
                            value={this.state.clean}
                        />
                    </TouchableOpacity>
                    <View style={{
                        height: 0,
                        width: 0
                    }}>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(itemValue, itemIndex)=> this.setState({clean: itemValue})}
                            placeholder={{label: 'Required', value: null}}
                            useNativeAndroidPickerStyle={false}
                            items={this.state.cleanPicker}
                            onValueChange={(value) =>{
                                this.setState({
                                    clean:value,
                                });
                            }}
                            value={this.state.clean}
                            ref={(el) =>{
                                this.inputRefs.cleanPicker = el;
                            }}
                        />
                    </View>

                    <TouchableOpacity onPress={(event: Event) => {
                        this.inputRefs.wakeEarlyPicker.togglePicker(true);
                    }}>
                        <Hoshi
                            style={styles.hoshiStyle}
                            label={'Are you a morning or night person? *'}
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
                            value={this.state.wake_early}
                        />
                    </TouchableOpacity>
                    <View style={{
                        height: 0,
                        width: 0
                    }}>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(itemValue, itemIndex)=> this.setState({wake_early: itemValue})}
                            placeholder={{label: 'Required', value: null}}
                            useNativeAndroidPickerStyle={false}
                            items={this.state.wake_earlyPicker}
                            onValueChange={(value) =>{
                                this.setState({
                                    wake_early:value,
                                });
                            }}
                            value={this.state.wake_early}
                            ref={(el) =>{
                                this.inputRefs.wakeEarlyPicker = el;
                            }}
                        />
                    </View>

                    <TouchableOpacity onPress={(event: Event) => {
                        this.inputRefs.smokePicker.togglePicker(true);
                    }}>
                        <Hoshi
                            style={styles.hoshiStyle}
                            label={'Do you smoke? *'}
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
                            value={this.state.smoke}
                        />
                    </TouchableOpacity>
                    <View style={{
                        height: 0,
                        width: 0
                    }}>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(itemValue, itemIndex)=> this.setState({smoke: itemValue})}
                            placeholder={{label: 'Required', value: null}}
                            useNativeAndroidPickerStyle={false}
                            items={this.state.smokePicker}
                            onValueChange={(value) =>{
                                this.setState({
                                    smoke:value,
                                });
                            }}
                            value={this.state.smoke}
                            ref={(el) =>{
                                this.inputRefs.smokePicker = el;
                            }}
                        />
                    </View>

                    <TouchableOpacity onPress={(event: Event) => {
                        this.inputRefs.petsPicker.togglePicker(true);
                    }}>
                        <Hoshi
                            style={styles.hoshiStyle}
                            label={'Do you own pets? *'}
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
                            value={this.state.pets}
                        />
                    </TouchableOpacity>
                    <View style={{
                        height: 0,
                        width: 0
                    }}>
                        <RNPickerSelect
                            style={pickerSelectStyles}
                            onValueChange={(itemValue, itemIndex)=> this.setState({pets: itemValue})}
                            placeholder={{label: 'Required', value: null}}
                            useNativeAndroidPickerStyle={false}
                            items={this.state.petsPicker}
                            onValueChange={(value) =>{
                                this.setState({
                                    pets:value,
                                });
                            }}
                            value={this.state.pets}
                            ref={(el) =>{
                                this.inputRefs.petsPicker = el;
                            }}
                        />
                    </View>
                    <Hoshi
                        style={{...styles.hoshiStyle, height: 200}}
                        label={'Tell Us About Yourself: '}
                        // this is used as active border color
                        borderColor={inputBorderColor}
                        // active border height
                        borderHeight={3}
                        inputPadding={16}
                        // this is used to set backgroundColor of label mask.
                        // please pass the backgroundColor of your TextInput container.
                        backgroundColor={bgColor}
                        onChangeText={(description)=>{this.setState({description})}}
                        value={this.state.description}
                        multiline={true}
                        onFocus={(event: Event) => {
                            // `bind` the function if you're using ES6 classes
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                        }}
                    />
                    {/* <TextInput style={{borderColor:"#243456", borderWidth:1,height:"90%", textAlignVertical:"top",
                        paddingVertical: 10, paddingHorizontal: 10}}
                        onChangeText={(description)=> this.setState({description})}
                        value = {this.state.description}
                        placeholder = {"Optional"}
                        multiline={true}
                        //Adds padding when user clicks on the description field so the keyboard does not
                        //cover the input field
                        onFocus={(event: Event) => {
                            this._scrollToInput(ReactNative.findNodeHandle(event.target))
                            this.Add_Padding()
                        }}
                            //Deletes the extra padding when the user is not on the description field
                        onBlur={(event: Event) => {
                            this.Delete_Padding()
                        }}
                    /> */}
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
const pickerSelectStyles = StyleSheet.create({

    inputIOS: {
        paddingTop: RF(1.5),
        alignSelf: "center",
        fontSize: RF(3),
        height: "100%",
        width:"100%",
        color: 'black',
        textAlign:"center"
    },
    inputAndroid:{
        paddingTop: RF(1.5),
        alignSelf: "center",
        fontSize: RF(3),
        height: "100%",
        width:"100%",
        color: 'black',
        textAlign:"center"
    }
});