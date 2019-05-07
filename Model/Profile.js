export default class Profile {
    constructor(entry) {
        this.name_preferred = entry.name_preferred ? entry.name_preferred : "";
        this.profile_photo = entry.profile_photo ? entry.profile_photo : "";
        this.filter_allowed = entry.filter_allowed ? entry.filter_allowed : false ;
        if (entry.filters_user) {
            this.filters_user = {
                gender: entry.filters_user.gender ? entry.filters_user.gender : "",
                major: entry.filters_user.major ? entry.filters_user.major : "",
                graduation: entry.filters_user.graduation ? entry.filters_user.graduation : 0,
                clean: entry.filters_user.clean ? entry.filters_user.clean : false,
                wake_early: entry.filters_user.wake_early ? entry.filters_house.wake_early : "",
                additional_tags: entry.filters_user.additional_tags ? entry.filters_user.additional_tags : []
            };
        } else {
            this.filters_user = {
                gender: "",
                major: "",
                graduation: 0,
                clean: false,
                wake_early: "",
                additional_tags: []
            };
        }

    }
}