import React, {Component} from 'react';
import { StyleSheet, View, Text, Button, Alert, TextInput, Picker } from 'react-native';


export default class CreateProfile3Page extends Component{
    constructor(props){
        super(props)
        this.state={
            firstName:"First Name",
            lastName: "Last Name",
            preferredName: "Preferred Name",
            gender:"",
            major:"",
            expectGraduatingYear:"",
            Interest:[],
            clean:"",
            morningOrNight:"",
            description:"",
        }
    }
    ComponentDidMount(){
        const { navigate } = this.props.navigation;
        let firstName = navigate.state.params.page2.firstName;
        let lastName = navigate.state.params.page2.lastName;
        let preferredName = navigate.state.params.page2.preferredName;
        let gender = navigate.state.params.page2.gender;
        let major = navigate.state.params.page2.major;
        let expectGraduatingYear = navigate.state.params.page2.expectGraduatingYear;
        let Interest = navigate.state.params.page2.Interest;
        let clean = navigate.state.params.page2.clean;
        let morningOrNight = navigate.state.params.page2.morningOrNight;
        let description = navigate.state.params.page2.description;
        this.setState({
            firstName,lastName,preferredName,gender,major,expectGraduatingYear,Interest,clean,morningOrNight,description
        })
    }
    backslide =() =>{
        this.props.navigation.navigate("CreateProfile2Page",{page3: this.state});
    }
    nextslide = () =>{
        this.props.navigation.navigate("AddProfilePageS",{page3: this.state});
    }
    render(){
        return(
            <View style={{flexDirection:"column"}}>
                <Text> Are you generally a clean or messy person </Text>
                <Picker>
                    <Picker.Item label = "Clean" value = "Clean" />
                    <Picker.Item label = "Messy" value = "Messy" />
                </Picker>  
                <Text> Are you a morning or night person </Text>
                <Picker>
                    <Picker.Item label = "Morning" value = "Morning" />
                    <Picker.Item label = "Night" value = "Night" />
                </Picker>  
                <Text> Tell Us About Yourself </Text>
                <TextInput></TextInput>
                <Button title={"Back"} onPress={this.backslide}></Button>
                <Button title={"Next"} onPress={this.nextslide} style={{flex:1}}></Button>            
            </View>
        );
    }
}