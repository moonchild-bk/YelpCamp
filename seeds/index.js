if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '6a45d70c5afcd520e857aa24',

            location: `${cities[random1000].city}, ${cities[random1000].state}`,

            title: `${sample(descriptors)} ${sample(places)}`,

            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione cum quidem facilis eaque, assumenda exercitationem nulla iusto dolores eius placeat laborum dolorem in vero rerum aut soluta sed eveniet quas!',

            price,

            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },

            images: [
                {
                    url: `https://picsum.photos/seed/camp-${i}/800/600`,
                    filename: `picsum/camp-${i}`
                }
            ]
        });

        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});