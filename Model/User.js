import Profile from "./Profile";
import firebase from "firebase";

export default class User {
	constructor(entry = {}, id = "") {
			this.rawData = entry;
			this.id = id;
			if (this.id != "") {
				this.dbRef = firebase.firestore().collection("users").doc(id);
			}

			this.clean = entry.clean ? entry.clean : "";
			this.description = entry.description ? entry.description : "";
			this.first_name = entry.first_name ? entry.first_name : "";
			this.gender = entry.gender ? entry.gender : "";
			this.graduation = entry.graduation ? entry.graduation : "";
			this.last_name = entry.last_name ? entry.last_name : "";
			this.major = entry.major ? entry.major : "";
			this.name_preferred = entry.name_preferred ? entry.name_preferred : "";
			this.wake_early = entry.wake_early ? entry.wake_early : "";
			this.profileimage = entry.profileimage ? entry.profileimage : "";
			this.additional_tags = entry.additional_tags ? entry.additional_tags : [];
			this.house_favorite = entry.house_favorite ? entry.house_favorite : [];

			// this.email = entry.email ? entry.email : "";
			// this.first_name = entry.first_name ? entry.first_name : "";
			// this.last_name = entry.last_name ? entry.last_name : "";
			// if (entry.house_listing) {
			// 		this.house_listing = {
			// 				house_rent_out: entry.house_listing.house_rent_out ? entry.house_listing.house_rent_out : [],
			// 				house_favorite: entry.house_listing.house_favorite ? entry.house_listing.house_favorite : []
			// 		};
			// }else {
			// 		this.house_listing = {
			// 				house_rent_out: [],
			// 				house_favorite: []
			// 		};
			// }
			// this.roommate_listing = entry.roommate_listing ? entry.roommate_listing : [];
			// if (entry.profile) {
			// 	this.getProfile(entry.profile);
			// } else {
			// 	this.profile = new Profile();
			// }
	}
	
// 	getProfile = (ref) => {
// 		if (!ref) {
// 			return;
// 		}
// 		ref.get().then(profile => {
// 			this.profile = new Profile(profile.data());
// 		}).catch((e) => {
// 			this.profile = new Profile();
// 		});
// 	}
	static getUserWithUID(uid, callback) {
		firebase.firestore().collection("users").doc(uid).get().then((snapshot) => {
			let user = new User(snapshot.data(), uid);
			if (callback) {
				callback(user);
			}
		})
	}
}