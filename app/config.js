
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var crypto = require('crypto');

var dbUrl = process.env.dbUrl || 'mongodb://hr35:student@ds052408.mongolab.com:52408/yh-shortly';
mongoose.connect(dbUrl);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Connected!');
});

var Users = mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

var Links = mongoose.Schema({
  url: { type: String, required: true, index: { unique: true } },
  base_url: String,
  code: String,
  title: String,
  visits: Number
});



Users.method('comparePassword', function(attemptedPassword) {
  var hash = this.password;
  return new Promise(function (res, rej) {
  bcrypt.compare(attemptedPassword, hash, function(err, isMatch) {
      if(err){
        rej(err);
      }else{
      res(isMatch);
      }
    });
    
  })
});

module.exports.User = mongoose.model('User', Users);
module.exports.Link = mongoose.model('Link', Links);


  // hashPassword: function(){
    // var cipher = Promise.promisify(bcrypt.hash);
    // return cipher(this.password), null, null).bind(this)
      // .then(function(hash) {
        // this.password = hash);
      // });

Users.pre('save', function(next, done) { 
  var user = this;
  if (!user.isModified('password')) {
     return next();
    }
  bcrypt.hash(user.password, null, null, function(err, hash) {
     if (err) { 
      return next(err);
    }
   user.password = hash;
   next();
  });
});


Links.pre('save', function(next, done) {
  var link = this;
  if(!link.isModified('url')) {
    return next();
  }
  var shasum = crypto.createHash('sha1');
  shasum.update(link.url);
  link.code = shasum.digest('hex').slice(0, 5);
  next();
})






