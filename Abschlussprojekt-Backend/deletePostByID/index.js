
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
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  UserID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
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
    // Extract postId from the request parameters
    const postId = event.pathParameters.post_id;

    // Find the post by postId
    const post = await Post.findOne({
      where: {
        PostID: postId,
      },
    });

    if (!post) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Post not found',
        }),
      };
    }

    // Delete the post
    await post.destroy();

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
    console.error('Error deleting post:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Error deleting post',
      }),
    };
  }
};
