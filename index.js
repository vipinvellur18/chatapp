const express = require('express')
const path = require('path')
const app = express();
const mysql = require('mysql2')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require("./app/models");
// const moment = require('moment')
require('dotenv/config')
var corsOptions = {
    origin: ["https://beta-node.solminds.com","https://app.gisaschools.org","https://new.solminds.in","https://gisaschools.org","http://localhost:3000","http://gisanodejs.us-east-1.elasticbeanstalk.com"]
};
global.__basedir = __dirname;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


// // app.get('/', function (req, ress) { 
  
// //   res.write("welcome to node js" ) 
// //   res.end();
// // });

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   //res.header('Access-Control-Allow-Credentials', true)
//   res.header('Access-Control-Allow-Methods', '*')
//   res.header('Access-Control-Allow-Headers', '*')
//   next()
// })

 

db.sequelize.sync().then(() => {
  console.log('Drop and Resync Db');
   //initial();
}).catch(err => {
  console.log(err);
});

app.use('/api/auth',require('./app/routes/authRoutes'));
app.use('/api/user',require('./app/routes/userRoutes'));
app.use('/api/follow',require('./app/routes/followRoutes'));
app.use('/api/post',require('./app/routes/postRoutes'));
app.use('/api/upload',require('./app/routes/uploadRoutes'));
app.use('/api/like',require('./app/routes/likeRoutes'));
app.use('/api/comment',require('./app/routes/commentRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
