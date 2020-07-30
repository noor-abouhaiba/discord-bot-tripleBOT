const router = require('express').Router();
const passport = require('passport');


// Starting from parent route that uses this .../auth/~
// Lets us hit the discord api to authenticate the user
router.get('/', passport.authenticate('discord'));

router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/',
    successRedirect: '/dashboard'
}));


router.get('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

module.exports = router;