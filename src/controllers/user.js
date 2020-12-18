module.exports = function(app) {
  const { getUser, getUserList, setAvatar } = require("../user.utils");
  var multer  = require('multer')

  app.get('/user/get-one', (req, res) => {
    getUser(req.query.id)
      .then(user => res.json(user.toJSON()));
  });

  app.get('/user/get-list', (req, res) => {
    getUserList(req.query.offset, req.query.limit)
      .then(users => res.json(users));
  });

  app.post('/user/set-avatar', multer.single(), (req, res) => {
    getUser(req.query.id)
      .then(user => {
        return setAvatar(user, req.files[0].path, req.query.storage)
          .then(avatar => res.send(avatar));
      });
  });
}
