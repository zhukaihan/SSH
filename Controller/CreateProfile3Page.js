import React, {Component} from 'react';
import ReactNative, { Platform,StyleSheet, View, Text, Button, Alert, TextInput,TouchableOpacity, Picker,SafeAreaView } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


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
                    label: 'Yes', value:'yes',
                },
                {
                    label: 'No', value:'no',
                }
            ],
            petsPicker:[
                {
                    label: 'Yes', value:'yes',
                },
                {
                    label: 'No', value:'no',
                }
            ],
            paddingBottom: 10
        }
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
                <KeyboardAwareScrollView style={{flex: 1}}
                    innerRef={ref => {
                        this.scroll = ref
                    }}>
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
            <View style={styles.inputView}>
                <View style={{flex:.4,  marginBottom: RF(1)}}>
                <Text style={{textAlign:"center", fontSize:RF(2.3), height:"auto"}}> Are you generally a clean or messy person </Text>
                <View style={styles.tpickerBox}>
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
                        value={this.state.clean}/>
                        </View>
                </View>
                <View style={{flex:.4, marginBottom: RF(1)}}>
                <Text style={{textAlign:"center", fontSize:RF(2.3)}}> Are you a morning or night person </Text>
                <View style={styles.tpickerBox}>
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
                        />
                        </View>
                </View>
                <View style={{flex:.4,  marginBottom: RF(1)}}>
                    <Text style={{textAlign:"center", fontSize:RF(2.3)}}> Do you smoke? </Text>
                    <View style={styles.tpickerBox}>
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
                    />
                    </View>
                </View>
                <View style={{flex:.4,  marginBottom: RF(1)}}>
                    <Text style={{textAlign:"center", fontSize:RF(2.3)}}> Do you own pets? </Text>
                    <View style={styles.tpickerBox}>
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
                    />
                    </View>
                </View>
                <View style={{flex:.4,  marginBottom: RF(1)}}>
                <Text style={{textAlign:"center", fontSize:RF(2.3)}}> Tell Us About Yourself </Text>
                <View>
                    <TextInput style={{borderColor:"#243456", borderWidth:1,height:"90%", textAlignVertical:"top",
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
                    />
                    
                </View>
                </View>
                
                </View>
                </KeyboardAwareScrollView>
                <View style={{width: '100%',flexDirection:'row', height:75}}>
                    <View style={styles.backButton}>
                        <TouchableOpacity onPress={this.backslide} style={styles.backButtonStyle}>
                            <Text style={styles.buttontextstyle}>Back</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nextButton}>
                        <TouchableOpacity onPress={this.nextslide} style={styles.nextButtonStyle}>
                            <Text style={styles.buttontextstyle}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    pageContainer:{
        flex:1,
        flexDirection:"column",
        borderWidth: 20,
        borderColor:"#2ea9df",
    },
    additionalInfo:{
        width: "90%",
        height: "45%",
        justifyContent: 'center',
        textAlign:'center',
        backgroundColor: '#00C488',
        borderColor:'#00C488',
        borderRadius: 10,
        borderWidth: 10,
    },
    additionalInfoText:{
        fontSize: RF(4.5),
        fontWeight: 'bold',
        color: "#fff",
        textAlign: 'center',
    },
    objectContainer:{
        flex: .35,
        justifyContent: 'space-evenly',
        alignItems: "center",
    },
    inputView:{
        paddingLeft: RF(2),
        paddingRight: RF(2),
        flex:1,
    },
    textFont:{
        fontSize: RF(3.5),
        elevation: 2,
    },
    oneOverthree:{
        fontSize: RF(2.5),
        elevation:2,
    },
    textBox:{
        width:"100%",
        height: "9%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#235964",
        marginBottom: RF(3),
        textAlign:"center",
        fontSize: RF(3),
    },
    pickerBox:{
        width:"100%",
        height: "9%",
        borderColor: "#235964",
        borderRadius: 59,
        textAlign:"center",
        fontSize: RF(3),
    },
    nextButton:{
        height: "100%",
        flexDirection:"row",
        justifyContent: "center",
        alignItems:"center",
        flex:.5,
    },
    nextButtonStyle:{
        height: "60%",
        width: "80%",
        borderRadius:10,
        backgroundColor:"#2ea9df",
        borderColor:"#2ea9df",
        borderWidth:4,
        alignItems: "center",
        justifyContent: "center",
    },
    backButton:{
        height: "100%",
        flexDirection:"row",
        justifyContent: "center",
        alignItems:"center",
        flex:.5,
    },
    backButtonStyle:{
        height: "60%",
        width: "80%",
        borderRadius:10,
        backgroundColor:"#2ea9df",
        borderColor:"#2ea9df",
        borderWidth:4,
        alignItems: "center",
        justifyContent: "center",
    },
    buttontextstyle:{
        textAlign:'center',
        fontSize:RF(3),
        color: "#fff",
        paddingLeft: RF(1),
        paddingRight: RF(1),
    },
    tpickerBox: {
        alignItems: "center",
        width:"100%",
        height: "60%",
        borderRadius: 15,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 10,
        marginTop: RF(1),
        marginBottom: RF(3),
        textAlign:"center",
        fontSize: RF(5),
    },
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