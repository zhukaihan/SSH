import User from "./User";
import firebase from "firebase";

export class MessageRoom {
	constructor(entry = {}, id = "", recipientReadyCallback) {
		this.rawData = entry;
		this.id = id;
		if (id != "") {
			this.dbRef = firebase.firestore().collection("messages").doc(firebase.auth().currentUser.uid).collection("rooms").doc(id);
		}
		this.last_contact_date = entry.last_contact_date ? entry.last_contact_date : firebase.firestore.Timestamp.now();
		this.messages = [];
		if (entry.messages && entry.messages.forEach) {
			entry.messages.forEach((message) => {
				this.messages.push(new Message(message));
			})
		}
		User.getUserWithUID(id, (user) => {
			this.recipient = user
			if (recipientReadyCallback) {
				recipientReadyCallback();
			}
		})
	}


}

export class Message {
	constructor(entry = {}) {
		this.rawData = entry;
		this.timestamp = entry.timestamp ? entry.timestamp : firebase.firestore.Timestamp.now();
		this.message = entry.message ? entry.message : "";
		this.isRead = entry.isRead ? entry.isRead : false;
		this.isSentByUser = entry.isSentByUser ? entry.isSentByUser : false;
	}
}