const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  date: {
    type: Date,
    default: Date.now
  },
  watchlist: [{
    type: Schema.Types.ObjectId,
    ref: "home"
  }]
});

UserSchema.statics.addHomeToWatchlist = (userId, homeId) => {
  const User = mongoose.model("user");
  const Home = mongoose.model("home");

  return User.findById(userId).then(user => {
    return Home.findById(homeId).then(home => {
      user.watchlist.push(home)
      return user.save().then(user => user.watchlist)
    })
  })
}


module.exports = mongoose.model('user', UserSchema);
// module.exports = mongoose.model('user', UserSchema)