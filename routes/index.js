var express = require('express');
var router = express.Router();
var User = require('../models/User');
var mid = require('../middleware/middleware');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cuisine | Home' });
});

/* GET foods page. */
router.get('/foods', function(req, res, next) {
  res.render('foods', { title: 'Cuisine | Foods' });
});

/* GET signup page. */
router.get('/signup', mid.loggedIn, function(req, res, next) {
  res.render('signup', { title: 'Cuisine | Sign Up' });
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {
  if (req.body.name && req.body.email && req.body.password) {
  	var userData = {
  		email: req.body.email,
  		name: req.body.name,
  		password: req.body.password
  	}

  	//Use schema's 'create' method to insert the data inot the database
  	User.create(userData, (error,user) => {
  		if (error) {
  			return next(error)
  		} else {
  			req.session.userId = req._id;
  			return res.redirect('/profile');
  		}
  	})
  } 


  else {
  	var err = new Error('All fields are required');
  	err.status = 401;
  	return next(err);
  }
});

/* GET login page. */
router.get('/login', mid.loggedIn, function(req, res, next) {
  res.render('login', { title: 'Cuisine | Log In' });
});


/* POST login page. */
router.post('/login', (req,res,next) => {
	if (req.body.email && req.body.password) {

		User.authenticate(req.body.email, req.body.password, (err,user) => {
			if (error || !user) {
				var err = new Error('Wrong email or password');
				err.status = 401;
				return next(err);
			} 

			else {
				req.session.userId = req._id;
				return res.redirect('/profile');
			}
		})

	} else {
		var err = new Error('All fields are required');
		err.status = 401;
		return next(err);
	}
})


/* GET logout. */
router.get('/logout', (req,res,next) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		})
	}
})


/* GET profile page. */
router.get('/orders', mid.requiresLogin, (req,res,next) => {
	//If session is in place
	User.find(req.session.userId)
	.exec((error,user) => {
		if (error) {
			return next(error);
		} else {
			return res.render('orders', {
				user: user.name,
				title: 'Profile'
			})
		}
	})
})


/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Cuisine | About Us' });
});



module.exports = router;
