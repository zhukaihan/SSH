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
} from 'react-native';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';
import { Constants, ImagePicker, Permissions } from 'expo';
import uuid from 'uuid';
import * as firebase from 'firebase';



export default class AddProfilePage extends React.Component{
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
            profileimage: null,
            image: null,
            uploading: false,
        }
    }   
    /*
            
    */
    async ComponentDidMount() {


    }
    _uploadToFirebase = (items) =>{
        let userId = firebase.auth().currentUser.uid;
        console.log(this.state.first_name);
        var data = {
            first_name: items.first_name,
            last_name: items.last_name,
            name_preferred: items.name_preferred,
            gender: items.gender,
            major: items.major,
            graduation: items.graduation,
            additional_tags: items.additional_tags,
            clean: items.clean,
            wake_early: items.wake_early,
            description: items.description,
            profileimage: items.profileimage
        }
        firebase.firestore().collection("users").doc(`${userId}`).set(Object.assign({}, data)
        )
    }
    render() {
        let { image } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    onPress={this._pickImage}
                    title="picking photo from photo roll"
                />
                <Button onPress={this._takePhoto} title="Take a photo" />
                {this._maybeRenderImage()}
                {this._maybeRenderUploadingOverlay()}
                <Button
                    onPress={this._uploadToFirebase(this.state)}
                    title="finish"
                />
                <Text>jhk</Text>
                <StatusBar barStyle="default" />
            </View>
        );
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
                style={{
                    marginTop: 30,
                    width: 250,
                    borderRadius: 3,
                    elevation: 2,
            }}>
            <View
                style={{
                    borderTopRightRadius: 3,
                    borderTopLeftRadius: 3,
                    shadowColor: 'rgba(0,0,0,1)',
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 4, height: 4 },
                    shadowRadius: 5,
                    overflow: 'hidden',
                }}>
            <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
            </View>
            <Text
                onPress={this._copyToClipboard}
                onLongPress={this._share}
                style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                {image}
            </Text>
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
    
    _takePhoto = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
    
        this._handleImagePicked(pickerResult);
    };
    
    _pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
    
        this._handleImagePicked(pickerResult);
    };
    
    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });
            if (!pickerResult.cancelled) {
                uploadUrl = await uploadImageAsync(pickerResult.uri);
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
        .child(`${userId}/images/${uuid.v4()}.jpg`);
    const snapshot = await ref.put(blob);
    
    // We're done with the blob, close and release it
    blob.close();
    
    return await snapshot.ref.getDownloadURL();
}