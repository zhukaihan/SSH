import firebase from "firebase";
import User from './User';

export default class House {
	constructor(entry = {}, id = "") {
		this.rawData = entry;
		this.id = id;
		this.landlord = entry.landlord ? entry.landlord : "";
		this.cur_tenant = entry.cur_tenant ? entry.cur_tenant : [];
		this.pictures = entry.pictures ? entry.pictures : [];
		this.availability = entry.availability ? entry.availability : false;
		if (entry.filters_house) {
			this.filters_house = {
				title: entry.filters_house.title ? entry.filters_house.title : "",
				location: entry.filters_house.location ? entry.filters_house.location : "",
				price: entry.filters_house.price ? entry.filters_house.price : 0,
				num_bedroom: entry.filters_house.num_bedroom ? entry.filters_house.num_bedroom : 0,
				num_bathroom: entry.filters_house.num_bathroom ? entry.filters_house.num_bathroom : 0,
				num_parking: entry.filters_house.num_parking ? entry.filters_house.num_parking : 0,
				num_tenant: entry.filters_house.num_tenant ? entry.filters_house.num_tenant : 0,
				additional_tags: entry.filters_house.additional_tags ? entry.filters_house.additional_tags : []
			};
		} else {
			this.filters_house = {
				title: "",
				location: "",
				price: 0,
				num_bedroom: 0,
				num_bathroom: 0,
				num_parking: 0,
				num_tenant: 0,
				additional_tags: []
			};
		}
		
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