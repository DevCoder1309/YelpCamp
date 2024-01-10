const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require('./cities')
const {descriptors, places} = require('./seedhelpers')

const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("MONGODB CONNECTED");
  })
  .catch((err) => {
    console.log("OH NO! ERROR", err);
  });


const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i<3; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        await new Campground({
          author: `6598e0d933737494e7735685`,
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          geometry: {
            type: "Point",
            coordinates: [cities[random1000].longitude, cities[random1000].latitude]
          },
          image: [
                    {
                      url: 'https://res.cloudinary.com/dgicslzpc/image/upload/v1704610130/YelpCamp/ogwtqdslrqbubxobbyy9.jpg',
                      filename: 'YelpCamp/ogwtqdslrqbubxobbyy9',
                    },
                    {
                      url: 'https://res.cloudinary.com/dgicslzpc/image/upload/v1704610130/YelpCamp/rlpczm2oh9gmtaak2ncb.jpg',
                      filename: 'YelpCamp/rlpczm2oh9gmtaak2ncb',
                    }
                  ],
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam cupiditate obcaecati modi amet dolores quos dicta nulla quo maxime similique, sunt, hic officiis, dolore eum iure soluta deleniti minima alias!",
          price: price,
        }).save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})