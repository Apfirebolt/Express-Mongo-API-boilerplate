const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors')
const connectDB = require('./config/db');
const session = require('express-session');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

dotenv.config();

// Connect to database
connectDB();

const app = express();

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.1', // YOU NEED THIS
      info: {
        title: "Express Boilerplate",
        description: "This is a simple express boilerplate API",
        contact: {
          name: "Apfirebolt",
          email: "aspper20@gmail.com"
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            }
          }
        },
        security: [{
          bearerAuth: []
        }],
        servers: ["http://localhost:5000/"]
      }
    },
    apis: ["./router/auth.js", "./router/user.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Global variables
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

const authRouter = require('./router/auth');
const usersRouter = require('./router/user');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
})

module.exports = app;
