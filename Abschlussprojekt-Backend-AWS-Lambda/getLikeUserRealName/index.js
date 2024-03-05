const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});

const Like = sequelize.define('Like', {
  LikeID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  PostID: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  UserID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  IsLike: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
},{
    tableName : 'Like'
});

const User = sequelize.define('User', {
  UserID: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  RealName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},{
    tableName : 'User'
});


exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    const postID = data.post_id;

    const likes = await Like.findAll({
      where: {
        PostID: postID,
        IsLike: true, 
      },
    });

    
    const userIDs = likes.map((like) => like.UserID);

    const users = await User.findAll({
      attributes: ['RealName'],
      where: {
        UserID: userIDs,
      },
    });

    const realNames = users.map((user) => user.RealName);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        realNames,
      }),
    };
  } catch (error) {
    console.error('Error getting users who liked the post:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Error getting users who liked the post',
      }),
    };
  }
};
