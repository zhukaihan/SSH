export default class User {
    constructor(entry) {
        this.email = entry.email ? entry.email : "";
        this.first_name = entry.first_name ? entry.first_name : "";
        this.last_name = entry.last_name ? entry.last_name : "";
        this.house_listing = this.house_listing ? {
            house_rent_out: entry.house_listing.house_rent_out ? entry.house_listing.house_rent_out: [],
            house_favorite: entry.house_listing.house_favorite ? entry.house_listing.house_favorite: []
        } : {
            house_rent_out: [],
            house_favorite: []
        };
        this.roommate_listing = entry.roommate_listing ? entry.roommate_listing : [];
        this.profile = entry.profile ? entry.profile : "";
    }
}