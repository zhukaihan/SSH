import React, {Component} from 'react';
import {StyleSheet, 
        View, 
        Text, 
        Button, 
        Alert, 
        TextInput, 
        Picker,
        TouchableOpacity, 
        SafeAreaView, 
        Dimensions, 
        PixelRatio} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import RF from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
        }
        this.width= Dimensions.get('window').width;
        this.inputRefs={};
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
                description: this.state.description,
            });
        }
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
            <KeyboardAwareScrollView>
            <View style={styles.inputView}>
                <View
                    style={{flexDirection:"row", alignItems: "center", marginBottom: RF(3)}}>
                    <Icon name={"asterisk"} style={{color:"red"}}></Icon>
                    <Text style={{fontSize:RF(2.4)}}> Required Field </Text>
                </View>
                <View style={styles.inputContainer}>
                <TextInput 
                        style={styles.tinput}
                        placeholder={"First Name"}
                        onChangeText={(first_name)=>{this.setState({first_name})}}></TextInput>
                    <Icon name={"asterisk"} style={styles.ast}></Icon>
                </View>
                <View style={styles.inputContainer}>
                <TextInput 
                        style={styles.tinput}
                        placeholder={"Last Name"}
                        onChangeText={(last_name)=>{this.setState({last_name})}}></TextInput>
                    <Icon name={"asterisk"} style={styles.ast}></Icon>
                </View>
                <View style={styles.inputContainer}>
                <TextInput 
                        style={styles.textBox}
                        placeholder={"Preferred Name"}
                        onChangeText={(name_preferred)=>{this.setState({name_preferred})}}></TextInput>
                </View>
                <View style={styles.tpickerBox}>
                <RNPickerSelect
                        style={{...pickerSelectStyles}}
                        onValueChange={(itemValue, itemIndex)=> this.setState({gender: itemValue})}
                        placeholder={{label: 'Gender', value: null}}
                        items={this.state.items}
                        onValueChange={(value) =>{
                            this.setState({
                                gender:value,
                            });
                        }}
                        value={this.state.gender}
                        ref={(el) =>{
                        this.inputRefs.picker = el;
                        }}/>
                    <Icon name={"asterisk"} style={styles.pickerast}></Icon>
                </View>
                <View style={{flexDirection:'row', height:"20%"}}>
                    <View style={styles.backButton}>
                            <Text style={styles.buttontextstyle}>Back</Text>
                    </View>
                    <View style={styles.nextButton}>
                        <TouchableOpacity onPress={this.nextslide} style={styles.nextButtonStyle}>
                        <View>
                            <Text style={styles.buttontextstyle}>Next</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View> 
            </KeyboardAwareScrollView>   
            </SafeAreaView>    
        );
    }
}

const {width, height, scale} = Dimensions.get('window');

const styles = StyleSheet.create({
    pageContainer:{
        flex:1,
        flexDirection:"column",
        borderWidth: 20,
        borderColor:"#2ea9df",
        paddingTop: RF(3),
    },
    personalInfo:{
        width: "90%",
        height: "100%",
        justifyContent: 'center',
        textAlign:'center',
        backgroundColor: '#2ea9df',
        borderColor:'#2ea9df',
        borderRadius: 10,
        borderWidth: 10,
    },
    personalInfoText:{
        fontSize: RF(4),
        fontWeight: 'bold',
        color: "#fff",
        textAlign: 'center',
    },
    objectContainer:{
        flex: .35,
        justifyContent: 'space-evenly',
        alignItems: "center",
        paddingTop: RF(5),
    },
    inputView:{
        paddingLeft: RF(2),
        paddingRight: RF(2),
        paddingTop: RF(3),
        flex:1,
    },
    textFont:{
        fontSize: RF(3.5),
        elevation: 2,
        paddingTop: RF(3),
        textAlign: 'center',
    },
    oneOverthree:{
        fontSize: RF(2.5),
        elevation:2,
        paddingTop: RF(3),
        textAlign: 'center',
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
        borderWidth: 20,
        borderColor:"#fff",
        flex:.5,
    },
    nextButtonStyle:{
        height: "80%",
        borderRadius:10,
        backgroundColor:"#2ea9df",
        borderColor:"#2ea9df",
        borderWidth:4, 
        alignItems: "center",
        justifyContent: "center",
    },
    backButton:{
        opacity:0,
        flexDirection:"row",
        justifyContent: "center",
        alignItems:"center",
        borderWidth: 20,
        borderColor:"#fff",
        flex:.5,
    },
    backButtonStyle:{
        height: "0%",
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        width:"100%",
        height: "9%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#235964",
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 10,
        marginBottom: RF(3),
    },
    ast: {
        color: 'red',
        paddingTop: RF(1.5),
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
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        width:"100%",
        height: "9%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#235964",
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 10,
        marginBottom: RF(3),
    },

})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        paddingTop: RF(1.5),
        alignSelf: "center",
        fontSize: RF(3),
        height: "100%",
        width:"100%",
        borderColor: '#000',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
        textAlign:"center",
    },
});