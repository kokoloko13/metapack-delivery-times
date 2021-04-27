require('dotenv').config();

const express = require('express');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const routes = require('./routes/routes');

const cors = require('cors');

const User = require('./models/user');
const Role = require('./models/role');


const { MONGO_DB_KEY } = process.env;

const MongoURI = `mongodb://127.0.0.1/delivery-time?retryWrites=true&w=majority`;

// api:${MONGO_DB_KEY}@
// 

// async function getUserRole() {
//     const userRole = await Role.findOne({ name: "USER" });

//     for(let i=1; i < 5; i++){
//         const devUser = new User({ username: `test${i}@test.pl`, password: "test123", role: userRole._id });
//         devUser.save();
//     }
// }

// getUserRole();

mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then( res => console.log(`Database connected!`));



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;


const whitelist = [];

const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if( origin === undefined || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

app.use(cors(corsOptions));

app.use('/', routes);


module.exports = app.listen(PORT, console.log(`Server is running on ${PORT}`));
