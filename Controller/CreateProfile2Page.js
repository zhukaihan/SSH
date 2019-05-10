import React, {Component} from 'react';
import { StyleSheet, View, Text, Button, Alert, TextInput, Picker } from 'react-native';


export default class CreateProfile2Page extends Component{
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
            <View style={{flexDirection:"column", justifyContent:"space-evenly"}}>
                <Text> Major </Text>
                <Picker
                    onValueChange={(itemValue, itemIndex)=> this.setState({major: itemValue})}>
                    <Picker.Item label = "ComputerScience" value = "Computer Science" />
                </Picker>  
                <Text> Expected Graduating Year </Text>
                <Picker
                onValueChange={(itemValue, itemIndex)=> this.setState({expectGraduatingYear: itemValue})}>
                    <Picker.Item label = "TBD" value = "TBD" />
                </Picker>  
                <Text> Interests and Hobbies </Text>
                <Picker
                    onValueChange={(itemValue, itemIndex)=> this.setState({Interest: itemValue})}>
                    <Picker.Item label = "TBD" value = "TBD" />
                </Picker>    
                <Button title={"Back"} onPress={this.backslide}></Button>
                <Button title={"Next"} onPress={this.nextslide}></Button>            
            </View>
        );
    }
}