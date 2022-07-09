const express =require("express");
const  cors =require("cors");
const  UserModule =require("./users/user.modules");
const routeControllers = [UserModule.endpoints]
const session = require("express-session");
// initalize sequelize with session store
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dotenv = require("dotenv");
dotenv.config();
const connectDb =require( "./utils/connection");

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
    session({
        secret: 'voyagearsaha',
        resave: false,
        saveUninitialized: false,
        store: new SequelizeStore({
          db: connectDb,
          // table: "Sessions",
          expires: new Date(
            Date.now() + 3600000
          ),
        }),
        name: 'voyagesession',
    }))
    
  //  Add all endpoint and router
  
  routeControllers.forEach((resource) => {
    app.use(resource.endpoint, resource.router);
})
 connectDb.sync({
        force: false,
 });
app.listen(7000, () => {
        console.log("------------------------------------------------");
        console.log(`V2 Server successfully running on 7000`);
        console.log("-------------------------------------------------");
});


