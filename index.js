const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8000;
require('dotenv').config()

app.use(cors());
app.use(cors({
    credentials: true,
    origin: [`http://localhost:${port}`]
}));


// Sử dụng body-parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "projectTTNM",
    saveUninitialized: true,
    cookie: {
        maxAge: oneDay
    },
    resave: false
}));

app.use(cookieParser());

// Tạo router
const router = express.Router();

// Định nghĩa các router con
require('./app/router/productRouter')(router);
require('./app/router/orderRouter')(router);
require('./app/router/cartRouter')(router);
require('./app/router/commentRouter')(router);
require('./app/router/homeRouter')(router);

// Sử dụng tiền tố /api cho tất cả các route trong router
app.use('/api', router);



// Lắng nghe cổng
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}/`);
});