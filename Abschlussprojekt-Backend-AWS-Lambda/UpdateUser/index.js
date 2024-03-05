const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: process.env.TSNET_DB_DIALECT,
  host: process.env.TSNET_DB_HOST,
  database: process.env.TSNET_DB_DATABASE,
  port: process.env.TSNET_DB_PORT,
  username: process.env.TSNET_DB_USER,
  password: process.env.TSNET_DB_PASSWORD
});

const User = sequelize.define('User', {
  BirthDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Course: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'User' 
});

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  try {
    const updatedUser = await User.update({
      BirthDate: body.BirthDate,
      Course: body.Course,
    }, {
      where: {
        UserID: body.user_id
      },
      returning: true, 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "error", message: "Failed to update user." }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "ok" }),
  };
};
