const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./utility/db.js');
const adminRoutes = require('./routes/admin.js')
const sellerRoutes = require('./routes/seller.js');
const userRoutes = require('./routes/user.js');
const port = 5000;
const relationships = require('./models/relationship.js');
const sequelize = require('./utility/db');
const session = require('express-session');
const cors = require('cors')
require('dotenv').config();
const path = require('path')


// sequelize.sync({force:true});


app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoutes);
app.use('/seller', sellerRoutes);
app.use('/user', userRoutes);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});



