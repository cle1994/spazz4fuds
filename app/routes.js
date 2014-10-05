// app/routes.js

module.exports = function(app) {
  // Frontend routing to be handled by angular ==========
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });
}