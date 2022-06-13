const express = require('express');
const cookieParser = require('cookie-parser');

const { initializeDatabase } = require('./config/database');
const { auth } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandlerMIddleware');
const routes = require('./routes');
const app = express();

require('./config/handlebars')(app);

app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(auth);
app.use(routes);
app.use(errorHandler);

initializeDatabase()
    .then(() => {
        app.listen(5000, () => console.log(`App is listening on port 5000`));
    })
    .catch((err) => {
        console.log('Cannot connect to db:', err);
    });
