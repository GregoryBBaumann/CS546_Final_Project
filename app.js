const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        asJSON: (obj, spacing) =>{
            if(typeof spacing == 'number') return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    }
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
    next();
  };

  app.use;
  app.use('/public', static);
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(rewriteUnsupportedBrowserMethods);
  
  app.engine('handlebars', handlebarsInstance.engine);
  app.set('view engine', 'handlebars');

  app.use(
      session({
        name: 'AuthCookie',
        secret: 'Secret Message',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 6000000}
      })
    )
    
    configRoutes(app);

  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });