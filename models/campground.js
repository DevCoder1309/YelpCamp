const mongoose = require('mongoose');
const Review = require('./reviews')
const Schema = mongoose.Schema;


const opts = {toObject: { virtuals: true }, toJSON: {virtuals: true}};
const CampgroundSchema = new Schema({
    title: String,
    image: [
        {
            url: String,
            filename: String,
        }
    ],
    geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}....</p>`;
})

CampgroundSchema.post('findOneAndDelete', async (found) => {
    // the found here refers to the campground which has been deleted we can access the found (obj) and remove the corresponding review of that particular campground
    if(found){
        await Review.deleteMany({})
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);