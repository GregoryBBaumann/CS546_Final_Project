const loginRoutes = require('./login');


const constructorMethod = (app) => {
  app.use('/', loginRoutes);
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
