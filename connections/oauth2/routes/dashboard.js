const router = require('express').Router();

// Global may not work, best to store this in the DB
global.globalTwitchConnection = null;
global.globalUserProfile;
global.globalGuildFound = "INVALID";

const guildName = "WRECKnation";

// Middleware function that is run before the user is sent back data,
// run before below router.get(...) body is run
function userIsAuthorized(req, res, next) {
    if (req.user) {
        console.log('User is logged in');
        console.log(req.user);
        next();
    }
    else {
        console.log('User is not logged in');
        res.redirect('/');
    }
}

router.get('/', userIsAuthorized, (req, res) => {
    console.log("TEST: " + req.user.Item.username);
    console.log(globalUserProfile.icon);
    res.render('dashboard', {
        username        : req.user.Item.username,
        userID          : globalUserProfile.id,
        userAvatar      : globalUserProfile.avatar,
        discriminator   : req.user.Item.discordHash,
        guild           : guildName,
        verification    : globalGuildFound,
        twitch          : globalTwitchConnection.name
    });
});

module.exports = router;