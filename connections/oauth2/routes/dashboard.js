const router = require('express').Router();
const profile = require('./profiletest');

function getDate(followDate) {
    const date = new Date(followDate);

    return (`${leadingZero(date.getMonth()+1)}/${leadingZero(date.getDate())}/${date.getFullYear()}`);
}

function leadingZero(num){
    return (num < 10) ? ("0" + num) : num;
}

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

router.get('/', userIsAuthorized, async (req, res) => {
    if (req.user.Item.followDate === "") {
        setTimeout(() => {}, 5000);
    }
    const followDate = req.user.Item.twitchFollowDate;

    let formattedDate;
    if (followDate === null) {
        formattedDate = "NOT FOLLOWING";
    }
    else {
        formattedDate = await getDate(followDate);
    }
    res.render('dashboard', {
        // username        : req.user.Item.username,
        // userID          : profile.userProfile.id,
        // userAvatar      : profile.userProfile.avatar,
        // discriminator   : req.user.Item.discordHash,
        // guild           : profile.guildName,
        // verification    : profile.guildFound,
        // twitch          : req.user.Item.twitch,
        // followDate      : formattedDate
    });
});

module.exports = router;