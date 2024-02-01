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
    const postIdToDelete = event.pathParameters.post_id;

    const existingComments = await Comment.findAll({
      where: {
        PostID: postIdToDelete,
      },
    });

    if (existingComments.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Keine Kommentare gefunden",
        }),
      };
    }

   
    await Comment.destroy({
      where: {
        PostID: postIdToDelete,
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
    console.error("Fehler beim Löschen der Kommentare:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Fehler beim Löschen der Kommentare",
      }),
    };
  }
};

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Verbindung zur Datenbank wurde erfolgreich hergestellt.");
  } catch (error) {
    console.error("Verbindung zur Datenbank fehlgeschlagen:", error);
  }
};

testDatabaseConnection();
