import firebase from "firebase";
import User from './User';

export default class House {
	constructor(entry = {}, id = "") {
		this.rawData = entry;
		this.id = id;
		if (id != "") {
			this.dbRef = firebase.firestore().collection("houses").doc(id);
		}
		this.landlord = entry.landlord ? entry.landlord : "";
		this.cur_tenant = entry.cur_tenant ? entry.cur_tenant : [];
		this.pictures = entry.pictures ? entry.pictures : [];
		this.availability = entry.availability ? entry.availability : false;
		this.description = entry.description ? entry.description : "";
		//  current only string location for the house
		this.title = entry.title ? entry.title : "";
		this.location = entry.location ? entry.location : "";
		this.price = entry.price ? entry.price : 0;
		this.num_bedroom = entry.num_bedroom ? entry.num_bedroom : 0;
		this.num_bathroom = entry.num_bathroom ? entry.num_bathroom : 0;
		this.num_parking = entry.num_parking ? entry.num_parking : 0;
		this.num_tenant = entry.num_tenant ? entry.num_tenant : 0;
		this.additional_tags = entry.additional_tags ? entry.additional_tags : []
		
	}

	static getHouseWithID(id, callback) {
		firebase.firestore().collection("houses").doc(id).get().then((snapshot) => {
			let house = new House(snapshot.data(), id);
			if (callback) {
				callback(house);
			}
		})
	}
}