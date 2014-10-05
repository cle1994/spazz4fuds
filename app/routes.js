module.exports = function(app, router) {
  //
  // Backend routing for node
  //
  var User = require('./models/user');

  router.use(function(req, res, next) {
      console.log('Middleware');
      next();
  });

  router.route('/user')
      .get(function(req, res) {
          User.find(function(err, user) {
              if (err) {
                  res.send(err);
              } else {
                  res.json(user);
              }
          });
      })
      .post(function(req, res) {
          var user = new User();
          user.name = req.body.name;
          user.blurb = req.body.blurb;
          user.links = req.body.links;
          user.color = req.body.color;
          user._id = shortId.generate();

          user.save(function(err) {
              if (err) {
                  res.send(err);
              } else {
                  res.json({ userID: user._id });
              }
          });
      });

  router.route('/user/:userid')
      .get(function(req,res) {
          Swatch.findById(req.params.userid, function(err, swatch) {
              if (err) {
                  res.send(err);
              } else {
                  res.json(swatch);
              }
          });
      });

  app.use('/api', router);

  //
  // Frontend routing for angular
  //
  app.use(function(req, res) {
      res.sendfile(__dirname + '/public/index.html');
  });

  router.get('*', function(req, res) {
      res.sendfile('/public/index.html');
  });
}