const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});


const Post = sequelize.define('Post', {
  PostID: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  UserID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  MediaLink: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
   

      const newPost = await Post.create({
        PostID : uuidv4(),
        UserID: data.user_id,
        Content: data.content,
        MediaLink: data.media_link,
      });

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ok',
        }),
      };
   
  } catch (error) {
    console.error('Error adding post:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Error adding post',
      }),
    };
  }
};