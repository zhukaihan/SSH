import React, {Component} from 'react';
import { StyleSheet, View, Text, Button, Alert, TextInput, Picker, SafeAreaView, Dimensions, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import RF from 'react-native-responsive-fontsize';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';


export default class CreateProfile2Page extends Component{
    constructor(props){
        super(props)
        this.state={
            firstName:"First Name",
            lastName: "Last Name",
            preferredName: "Preferred Name",
            gender:"",
            major:"Major",
            expectGraduatingYear:"Graduation Year",
            Interest:"Interests"
        }
    }
    ComponentDidMount(){
        const { navigate } = this.props.navigation;
        let firstName = navigate.state.params.page1.firstName;
        let lastName = navigate.state.params.page1.lastName;
        let preferredName = navigate.state.params.page1.preferredName;
        let gender = navigate.state.params.page1.gender;
        let major = navigate.state.params.page3.major;
        let expectGraduatingYear = navigate.state.params.page3.expectGraduatingYear;
        let Interest = navigate.state.params.page3.Interest;
        this.setState({
            firstName,lastName,preferredName,gender,major,expectGraduatingYear,Interest
        })
    }
    backslide = ()=>{
        this.props.navigation.navigate("CreateProfile1Page",{page2: this.state});
    }
    nextslide=()=>{
        this.props.navigation.navigate("CreateProfile3Page",{page2: this.state});
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
            <View style={styles.inputView}>
                <View
                    style={{flexDirection:"row", alignItems: "center", marginBottom: RF(1), textAlign:'center'}}>
                    <Text style={{fontSize:RF(2.4), textAlign:"center"}}> Major </Text>
                </View>
                <TextInput 
                        style={styles.textBox}
                        placeholder={this.state.major}
                        onChangeText={(major)=>{this.setState({major})}}></TextInput>
                <View
                    style={{flexDirection:"row", alignItems: "center", marginBottom: RF(1), textAlign:'center'}}>
                    <Text style={{fontSize:RF(2.4)}}> Expected Graduating Year </Text>
                </View>
                <TextInput 
                        style={styles.textBox}
                        placeholder={this.state.expectGraduatingYear}
                        onChangeText={(expectGraduatingYear)=>{this.setState({expectGraduatingYear})}}></TextInput>
                <View
                    style={{flexDirection:"row", alignItems: "center", marginBottom: RF(1)}}>
                    <Text style={{fontSize:RF(2.4), textAlign:"center"}}> Interests and Hobbies </Text>
                </View>
                <TextInput 
                        style={styles.textBox}
                        placeholder={this.state.Interest}
                        onChangeText={(Interest)=>{this.setState({Interest})}}></TextInput>
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
        height: "33%",
        justifyContent: 'center',
        textAlign:'center',
        backgroundColor: '#2ea9df',
        borderColor:'#2ea9df',
        borderRadius: 10,
        borderWidth: 10,
    },
    additionalInfoText:{
        fontSize: RF(4),
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
        height: "80%",
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
        height: "80%",
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
    }
})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: RF(3),
        height: "100%",
        width:"100%",
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
        textAlign:"center",
    },
});