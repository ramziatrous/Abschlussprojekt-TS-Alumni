const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD,
});

const Comment = sequelize.define("Comment", {
  CommentID: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  UserID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  PostID: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

exports.handler = async (event, context) => {
  try {
    
    const commentIdToDelete = event.pathParameters.id;

    // Check if the comment with the specified ID exists
    const existingComment = await Comment.findByPk(commentIdToDelete);

    if (!existingComment) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Comment not found",
        }),
      };
    }

    // Delete the comment from the database
    await Comment.destroy({
      where: {
        CommentID: commentIdToDelete,
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "ok",
      }),
    };
  } catch (error) {
    console.error("Error deleting comment:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Error deleting comment",
      }),
    };
  }
};
const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testDatabaseConnection();