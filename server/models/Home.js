const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const graphql = require("graphql");



const HomeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category"
  },
  name: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipcode: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sqft: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  stories: {
    type: Number,
    required: true
  },
  yearBuilt: {
    type: Number,
    required: true
  },
  garage: {
    type: Boolean,
    required: true
  },
  basement: {
    type: Boolean,
    required: true
  },
});

HomeSchema.statics.updateHomeCategory = (homeId, categoryId) => {
  const Home = mongoose.model("home");
  const Category = mongoose.model("category");

  return Home.findById(homeId).then(home => {
    // if the home already had a category
    if (home.category) {
      // find the old category and remove this home from it's homes
      Category.findById(home.category).then(oldcategory => {
        oldcategory.homes.pull(home);
        return oldcategory.save();
      });
    }
    //  find the Category and push this home in, as well as set this home's category
    return Category.findById(categoryId).then(newCategory => {
      home.category = newCategory;
      newCategory.homes.push(home);

      return Promise.all([home.save(), newCategory.save()]).then(
        ([home, newCategory]) => home
      );
    });
  });
};

module.exports = mongoose.model("home", HomeSchema);