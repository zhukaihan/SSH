export default class Profile {
    constructor(entry = {}) {
        this.name_preferred = entry.name_preferred ? entry.name_preferred : "";
        this.profileimage = entry.profileimage ? entry.profileimage : "";
        this.filter_allowed = entry.filter_allowed ? entry.filter_allowed : false ;
				this.gender = entry.gender ? entry.gender : "";
				this.major = entry.major ? entry.major : "";
				this.graduation = entry.graduation ? entry.graduation : 0;
				this.clean = entry.clean ? entry.clean : false;
				this.wake_time = entry.wake_time ? entry.wake_time : 0;
				this.additional_tags = entry.additional_tags ? entry.additional_tags : [];
				this.first_name = entry.first_name ? entry.first_name : "";
				this.last_name = entry.last_name ? entry.last_name : "";
				this.wake_early = entry.wake_early ? entry.wake_early : "";
				this.description = entry.description ? entry.description : "";
    }
}