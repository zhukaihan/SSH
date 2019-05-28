import React, {Component} from 'react';
import { StyleSheet, View, Text, Button, Alert, TextInput,TouchableOpacity, Picker,SafeAreaView } from 'react-native';
import RF from 'react-native-responsive-fontsize';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class CreateProfile3Page extends Component{
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
        } else if (!this._checkDescription()) {
            Alert.alert(
                'Invalid response',
                'Please make sure the description is over 10 words',
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                ],
                {cancelable: false}
            )
        } else {
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
                description: this.state.description,
            });
        }
    }

    //Method for adding padding for keyboard inputs
    //on bottom fields
    Add_Padding=()=>{

        this.setState({

            paddingBottom : 100

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
                <View style={{flex:.25 }}>
                <Text style={{textAlign:"center", fontSize:RF(2.3)}}> Are you generally a clean or messy person </Text>
                <RNPickerSelect
                        style={{...pickerSelectStyles}}
                        onValueChange={(itemValue, itemIndex)=> this.setState({clean: itemValue})}
                        placeholder={{label: 'Select Here', value: null}}
                        placeholderTextColor={'red'}
                        items={this.state.cleanPicker}
                        onValueChange={(value) =>{
                            this.setState({
                                clean:value,
                            });
                        }}
                        value={this.state.clean}/>
                </View>
                <View style={{flex:.25}}>
                <Text style={{textAlign:"center", fontSize:RF(2.3)}}> Are you a morning or night person </Text>
                <RNPickerSelect
                        style={{...pickerSelectStyles}}
                        onValueChange={(itemValue, itemIndex)=> this.setState({wake_early: itemValue})}
                        placeholder={{label: 'Select Here', value: null}}
                        placeholderTextColor={'red'}
                        items={this.state.wake_earlyPicker}
                        onValueChange={(value) =>{
                            this.setState({
                                wake_early:value,
                            });
                        }}
                        value={this.state.wake_early}
                        />
                </View>
                <View style={[{flex:.5,paddingBottom: this.state.paddingBottom}]}>
                <Text style={{textAlign:"center", fontSize:RF(2.3)}}> Tell Us About Yourself </Text>
                <View>
                    <TextInput style={{borderColor:"#243456", borderWidth:1,height:"90%", textAlignVertical:"top"}}
                                onChangeText={(description)=> this.setState({description})}
                                value = {this.state.description}
                                placeholder = {"Type here"}
                                placeholderTextColor={'red'}
                                //Adds padding when user clicks on preferred gender field so the keyboard does not
                                //cover the input field
                               onFocus={(event: Event) => {
                                   this.Add_Padding()
                               }}
                                //Deletes the extra padding when the user is not on the preferred gender field
                               onBlur={(event: Event) => {
                                   this.Delete_Padding()
                               }}
                    />
                </View>
                </View>
                <View style={{flexDirection:'row', height:"20%"}}>
                    <View style={styles.backButton}>
                        <TouchableOpacity onPress={this.backslide} style={styles.backButtonStyle}>
                            <View>
                                <Text style={styles.buttontextstyle}>Back</Text>
                            </View>
                        </TouchableOpacity>
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
        borderWidth: 20,
        borderColor:"#fff",
        flex:.5,
    },
    nextButtonStyle:{
        height: "90%",
        width: "100%",
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
        borderWidth: 20,
        borderColor:"#fff",
        flex:.5,
    },
    backButtonStyle:{
        height: "90%",
        width: "100%",
        borderRadius:10,
        backgroundColor:"#2ea9df",
        borderColor:"#2ea9df",
        borderWidth:4, 
        alignItems: "center",
        justifyContent: "center",
    },
    buttontextstyle:{
        textAlign:'center',
        fontSize:RF(4),
        color: "#fff",
        paddingLeft: RF(1),
        paddingRight: RF(1),
    }
})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: RF(3),
        height: "70%",
        width: "100%",
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
        textAlign:"center",
    },
});