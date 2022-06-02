const express = require('express');

const { initializeDatabase } = require('./config/database');
const routes = require('./routes');
const app = express();

require('./config/handlebars')(app);

app.use('/static', express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(routes);

initializeDatabase()
    .then(() => {
        app.listen(5000, () => console.log(`App is listening on port 5000`));
    })
    .catch((err) => {
        console.log('Cannot connect to db:', err);
    });
