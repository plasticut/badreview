var mongoose = require('mongoose'),
    Logger = require('./logger');

module.exports.getUser = async function(id) {
  const User = mongoose.model('user');

  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.password) {
    delete user.password;
  }

  user.accessCount += 1;
  await user.save();

  return user;
}

module.exports.getUserList = async function(filter, offset, limit) {
  const User = mongoose.model('user');

  var users = await User.find(JSON.parse(filter))
    .limit(parseInt(limit))
    .offset(parseInt(offset));

  users.forEach(user => {
    if (user.password) {
      delete user.password;
    }
  });

  return users;
}

module.exports.setAvatar = async function(user, avatar, storage) {
  var fs = require('fs');

  var content = fs.readFileSync(avatar)

  (new Logger).updated('user', user);

  if (storage == 's3') {
    var aws = require('aws');
    var s3config = require('./config/s3');

    var res = await new aws.S3({
      accessKeyId: s3config.key,
      secretAccessKey: s3config.secret,
    }).putObject({
      Bucket: 'test',
      Key: user.id + '/avatar.jpeg',
      Body: content,
    }).promise();

    user.avatar = res.Location;
    await user.save();
  } else if (storage == 'local') {
    var azure = require('azure-storage');
    var azureConfig = require('./config/azure');
    var files = azure.createFileService(azureConfig);
    var fileStream = new stream.Readable();

    fileStream.push(content);
    fileStream.push(null);
    var result = await files
        .createFileFromStream('users', 'avatars', user.id + '.jpeg', fileStream, content.length);

    user.avatar = files.getUrl('users', 'avatars', user.id + '.jpeg');
    await user.save();
  }

  return
  {
    avatar: user.avatar
  };
}
