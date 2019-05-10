import React, {Component} from 'react';
import { StyleSheet, View, Text, Button, Alert, TextInput, Picker, SafeAreaView, Dimensions, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import RF from 'react-native-responsive-fontsize';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';


export default class CreateProfile1Page extends Component{
    constructor(props){
        super(props)
        this.state={
            firstName:"First Name",
            lastName:"Last Name",
            preferredName: "Preferred Name",
            gender: undefined,
            items:[
                {
                    label: 'Male', value:'male',
                },
                {
                    label: 'Female', value:'female',
                },
                {
                    label: 'Trans', value: 'Trans',
                },
                {
                    label: 'Other', value: 'Other'
                }
            ]

        }
        this.width= Dimensions.get('window').width;
        this.inputRefs={};
    }
    ComponentDidMount(){
        let firstName = this.props.navigation.state.params.page2.firstName;
        let lastName = this.props.navigation.state.params.page2.lastName;
        let preferredName = this.props.navigation.state.params.page2.preferredName;
        let gender = this.props.navigation.state.params.pag2.gender;
        this.setState({
            firstName,lastName,preferredName,gender
        })
    }
    nextslide = () =>{
        this.props.navigation.navigate('CreateProfile2Page',{page1: this.state});
    }
    render(){
        return(
            <SafeAreaView style={styles.pageContainer}>
            <View style={styles.objectContainer}>
                    <View style={styles.personalInfo}>
                        <Text numberOfLines= {1}
                         style={styles.personalInfoText}> Create Your Profile </Text>
                    </View>
                    <View>
                        <Text style={styles.textFont}> Personal Information </Text>
                    </View>
                    <View>
                        <Text style={styles.oneOverthree}> 1/3 </Text>
                    </View>
            </View>
            <View style={styles.inputView}>
                <View
                    style={{flexDirection:"row", alignItems: "center", marginBottom: RF(3)}}>
                    <Icon name={"asterisk"} style={{color:"red"}}></Icon>
                    <Text style={{fontSize:RF(2.4)}}> Required Field </Text>
                </View>
                <TextInput 
                        style={styles.textBox}
                        placeholder={this.state.firstName}
                        onChangeText={(firstName)=>{this.setState({firstName})}}></TextInput>
                <TextInput 
                        style={styles.textBox}
                        placeholder={this.state.lastName}
                        onChangeText={(lastName)=>{this.setState({lastName})}}></TextInput>
                <TextInput 
                        style={styles.textBox}
                        placeholder={this.state.preferredName}
                        onChangeText={(preferredName)=>{this.setState({preferredName})}}></TextInput>
                <View style={styles.pickerBox}> 
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
                </View>
                <View style={styles.nextButton}>
                    <TouchableOpacity onPress={this.nextslide} style={styles.nextButtonStyle}>
                    <View>
                        <Text style={styles.buttontextstyle}>Next</Text>
                    </View>
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
    personalInfo:{
        width: "90%",
        height: "33%",
        justifyContent: 'center',
        textAlign:'center',
        backgroundColor: '#2ea9df',
        borderColor:'#2ea9df',
        borderRadius: 10,
        borderWidth: 10,
    },
    personalInfoText:{
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
        height: "9%",
        flexDirection:"column",
        justifyContent: "center",
        alignItems:'flex-end',
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