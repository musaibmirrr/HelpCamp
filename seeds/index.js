// our seed setup
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const mongoose = require('mongoose');
// im in seed directory so i need to back out once
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// mongoose.connect('mongodb://127.0.0.1:27017/help-camp')

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl)


const db = mongoose.connection;

db.on('error', console.log.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database is online');
});

// to create a randomm name using this logic
const nameMake = (array) => array[Math.floor(Math.random() * array.length)]


// this is my seed logic as my cities seed file has 1000 cities so i randomly choose them to seed and before everything i delete everything in db..

const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '67209d9a1e9b76f0397175ed',
            title: `${nameMake(descriptors)} ${nameMake(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/doehrt7uk/image/upload/v1730093044/HelpCamp/qlixxhbfteqh0vbdi8m2.jpg',
                    filename: 'HelpCamp/qlixxhbfteqh0vbdi8m2'
                },
                {
                    url: 'https://res.cloudinary.com/doehrt7uk/image/upload/v1730093219/HelpCamp/gypyxmr106zjwczj9rsi.jpg',
                    filename: 'HelpCamp/gypyxmr106zjwczj9rsi',


                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
                ]
            },
            description: 'Discover the best of both worlds where rugged nature meets refined comfort. Our luxury glamping sites provide plush bedding, scenic views, and exclusive access to camping, creating a one-of-a-kind escape for those looking to camp in style.',
            price
            // price : price same thing
        })
        await camp.save();

    }
}
// after doing our stuff we close the connection
seedDb().then(() => {
    mongoose.connection.close();
})