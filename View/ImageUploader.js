
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import User from '../Model/User';
import firebase from 'firebase';
import { Constants, ImagePicker, Permissions } from 'expo';
import uuid from 'uuid';

uploadImageAsync = async (uri, toStorageUri) => {
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
	
	const ref = firebase
		.storage()
		.ref()
		.child(`${toStorageUri}/${uuid.v4()}.jpg`);
	const snapshot = await ref.put(blob);
	
	// We're done with the blob, close and release it
	blob.close();
	
	return await snapshot.ref.getDownloadURL();
}

export default class ImageUploader {
	static chooseImageToUpload(uploadToUri, callback, pickerOptions = {}) {

		_handleImagePicked = async pickerResult => {
			try {
				if (!pickerResult.cancelled) {
					uploadUrl = await uploadImageAsync(pickerResult.uri, uploadToUri);
					if (callback) {
						callback(uploadUrl)
					}
				}
			} catch (e) {
				console.log(e);
				Alert.alert(
					'Upload Failed',
					'Please try agian later',
					[{text: 'Okay'}],
					{cancelable: false},
				)
			}
		};

		//Ask to access Camera
		askPermissionsAsync = async () => {
			await Permissions.askAsync(Permissions.CAMERA);
		}

		//Ask to access Camera Roll
		askPermissionLibAsync = async () =>{
			await Permissions.askAsync(Permissions.CAMERA_ROLL);
		}

		_takePhoto = async () => {
			askPermissionsAsync();
			let pickerResult = await ImagePicker.launchCameraAsync(pickerOptions);
			_handleImagePicked(pickerResult);
		};
		
		_pickImage = async () => {
			askPermissionLibAsync();
			let pickerResult = await ImagePicker.launchImageLibraryAsync(pickerOptions);
			_handleImagePicked(pickerResult);
		};

		Alert.alert(
			'Upload a Photo',
			'Choose from: ',
			[
				{text: 'Pick From Existing Photos', onPress: () => _pickImage()},
				{text: 'Take a Photo', onPress: () => _takePhoto()},
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
			],
			{cancelable: false},
		);

	}
}