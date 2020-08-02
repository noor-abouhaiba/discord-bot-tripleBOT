let userProfile = module.exports = {
    twitchConnection: null,
    userProfile: null,
    twitchFollowDate: null,
    guildFound: "INVALID",
    guildName: "WRECKnation",

    setTwitchConnection: function (twitch) {
        userProfile.twitchConnection = twitch;
    },
    setUserProfile: function (profile) {
        userProfile.userProfile = profile;
    },
    setGuildFound: function () {
        userProfile.guildFound = "VALID";
    }
};
