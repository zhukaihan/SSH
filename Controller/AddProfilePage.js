import React from 'react';
import {
    ActivityIndicator,
    Button,
    Clipboard,
    Image,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { Constants, ImagePicker, Permissions } from 'expo';
import uuid from 'uuid';
import RF from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/AntDesign';
import * as firebase from 'firebase';
import BloomFilter from './bloomfilter';
import { ImageManipulator } from 'expo';


export default class AddProfilePage extends React.Component{
    constructor(props){
        super(props)
        let defaultimage = firebase.auth().currentUser.photoURL;
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
        console.log(this.bloomfilter);
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
            smoke: this.smoke,
            pets: this.pets,
            profileimage: defaultimage,
            image: defaultimage,
            uploading: false,
            isVisible: false,
        }
    }   

    render() {
        let { image } = this.state;
        return (
            <SafeAreaView style={styles.pageContainer}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection:"column" }}>
                    <View style={styles.textBoxContainer}>
                        <Text style={styles.textBoxfont}>-</Text>
                        <Text style={styles.textBoxfont}>Would you like to add a picture for your profile?</Text>
                    </View>
                    <Overlay
                        isVisible={this.state.isVisible}
                        width="auto"
                        height="auto"
                        onBackdropPress={() => this.setState({ isVisible: false })}>
                        <View>
                        <Button
                            onPress={this._pickImage}
                            title="picking photo from photo roll"
                        />
                        <Button onPress={this._takePhoto} title="Take a photo" />
                        </View>
                    </Overlay>
                <View style={styles.imageSection}>
                    {this._maybeRenderImage()}
                </View>
                <View style={{flex:.15, borderColor: "#455455"}}>
                        <TouchableOpacity onPress={()=>this.setState({ isVisible:true})}>
                            <Icon name={"pluscircle"} 
                            color ="#453456"
                            size ={RF(8)}></Icon>
                        </TouchableOpacity>
                </View>
            </View>
            <View style={{width: '100%',flexDirection:'row', height:75}}>
                <View style={styles.backButton}>
                    <TouchableOpacity onPress={this.backslide} style={styles.backButtonStyle}>
                        <Text style={styles.buttontextstyle}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.nextButton}>
                    <TouchableOpacity onPress={this.uploadToFirebase} style={styles.nextButtonStyle}>
                        <Text style={styles.buttontextstyle}>Finish</Text>
                    </TouchableOpacity>
                </View>
            </View>
                <StatusBar barStyle="default" />
            </SafeAreaView>
        );
    }
    backslide =() =>{
        this.props.navigation.navigate("CreateProfile3Page",{
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
    uploadToFirebase = () =>{
        let userId = firebase.auth().currentUser.uid;
        console.log(this.state.first_name);
        var data = {
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
            profileimage: this.state.profileimage,
        }
        firebase.firestore().collection("users").doc(`${userId}`).set(Object.assign({}, data)
        )
        this.props.navigation.navigate("TabNavigator");
    }
    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
            <View
            style={[
                StyleSheet.absoluteFill,
                {
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                },
            ]}>
            <ActivityIndicator color="#fff" animating size="large" />
            </View>
            );
        }
    };
    
    _maybeRenderImage = () => {
        let { image } = this.state;
        if (!image) {
        return;
        }
        return (
                <View
                    style={
                        styles.imageContainer
                    }>
                        <Image source={{ uri: image, cache: 'force-cache' }} style={styles.imageStyle} />
                </View>
        );
    };
   
    _share = () => {
        Share.share({
            message: this.state.image,
            title: 'Check out this photo',
            url: this.state.image,
        });
    };
    
    _copyToClipboard = () => {
        Clipboard.setString(this.state.image);
        alert('Copied image URL to clipboard');
    };
    
    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
      }
      //Ask to access Camera Roll
      askPermissionLibAsync = async () =>{
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
    _takePhoto = async () => {
        await this.askPermissionsAsync();
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        this.setState({ isVisible:false})
        this._handleImagePicked(pickerResult);
        this._maybeRenderUploadingOverlay();
    };
    
    _pickImage = async () => {
        await this.askPermissionLibAsync();
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        this.setState({ isVisible:false})
        this._handleImagePicked(pickerResult);
        this._maybeRenderUploadingOverlay();
    };
    
    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });
            if (!pickerResult.cancelled) {
                // Resize the image to a width of 240, and height calculated automatically. 
                const manipResult = await ImageManipulator.manipulateAsync(
                    pickerResult.uri,
                    [{ resize: { width: 240 }}],
                    { format: 'jpg' }
                );
                uploadUrl = await uploadImageAsync(manipResult.uri);
                this.setState({ image: uploadUrl, profileimage: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };
}
    
async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
        resolve(xhr.response);
        };
        xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    let userId = firebase.auth().currentUser.uid;
    
    const ref = firebase
        .storage()
        .ref()
        .child(`users/${userId}/images/${uuid.v4()}.jpg`);

    const imageMetadata = {
        contentType: 'image/jpeg',
        cacheControl: 'max-age=604800'
    }
    const snapshot = await ref.put(blob, imageMetadata);
    
    // We're done with the blob, close and release it
    blob.close();
    
    return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
    pageContainer:{
        flex:1,
        flexDirection:"column",
        borderWidth: 20,
        borderColor:"#2ea9df",
    },
    textBoxContainer:{
        flex: .2,
        width: "95%",
        height: "20%",
    },
    textBoxfont:{
        textAlign: "center",
        fontSize: RF(4.5)
    },
    imageSection:{
    flex:.55,
    borderColor: "#345435", 
    width:"100%", 
    alignItems:"center"
    },
    imageContainer:{
        flex: 1,
        borderColor: "#345145",
        overflow: 'hidden',
        justifyContent: "center",        
    },
    imageStyle:{
        width: Dimensions.get('window').width*0.68,
        height: Dimensions.get('window').width*0.68,
        alignItems: "center",
        borderRadius: Dimensions.get('window').width*0.68/2,
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
    }
})