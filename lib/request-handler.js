var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var db = require('../app/config');
var User = require('../app/config.js').User;
var Link = require('../app/config').Link;

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function(err, links) {
    if (err) {
      return console.log(err);
    }
    res.send(200, links);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ 'url': uri }, function(err, found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          visits: 0,
          base_url: req.headers.origin
        });
        newLink.save(function(err, newLink) {
          // Links.add(newLink);
          console.log(newLink.url);
          res.send(200, newLink);
        });
      });
    }
  });
};
exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.findOne({
    'username': username
  }, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect('/login');
    }else if(!user){
      res.redirect('/login');
    } else {
      user.comparePassword(password).then(function(isMatch) {
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });


exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user = new User({ username: username, password: password});
    user.save(function(err, user) {
      if (err) {
        console.log('duplicate user error: ' + err);
        res.redirect('/signup')
      }else{
        console.log('created session for ' + username);
        util.createSession(req, res, user);
      }
    })
  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });
};
exports.navToLink = function(req, res) {
    console.log(req.params[0]);
    Link.findOne({
      'code': req.params[0]
    }).exec(function(err, model) {
      if (!model) {
        res.redirect('/');
      }
      model.visits++;

      console.log(err);
      console.log(model);
      model.save(function(err) {
        if (err) {
          throw err;
          console.log("nav error")
        }
        return res.redirect(model.url);
      });

    })

  // Link.findOne({ code: req.params[0] }).exec(function(err, link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};
