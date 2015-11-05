
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var crypto = require('crypto');


mongoose.connect('mongodb://hr35:student@ds052408.mongolab.com:52408/yh-shortly');

module.exports.db = mongoose.connection;

module.exports.db.on('error', console.error.bind(console, 'connection error:'));
module.exports.db.once('open', function (callback) {
  console.log('Connected!');
});

module.exports.Users = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

module.exports.Links = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});


// module.exports.User = mongoose.model('User', 'Users');

module.exports.Users.methods.comparePassword = function(attemptedPassword) {
  return new Promise(function (res, rej) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      if(err){rej(err);}else{
      res(isMatch);
      }
    });
    
  })
  },



  // hashPassword: function(){
    // var cipher = Promise.promisify(bcrypt.hash);
    // return cipher(this.password), null, null).bind(this)
      // .then(function(hash) {
        // this.password = hash);
      // });

module.exports.Users.pre('save', function(next, done) { 
  var user = this;
  if (!user.isModified('password')) {
     return next();
    }
  bcrypt.hash(user.password, null, function(err, hash) {
     if (err) { 
      return next(err);
    }
   user.password = hash;
   next();
  });
});


module.exports.Links.pre('save', function(next, done) {
  var link = this;
  if(!link.isModified('url')) {
    return next();
  }
  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
  next();
})






