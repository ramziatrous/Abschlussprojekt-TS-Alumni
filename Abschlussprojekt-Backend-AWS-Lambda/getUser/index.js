const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: process.env.TSNET_DB_DIALECT,
    host: process.env.TSNET_DB_HOST,
    database: process.env.TSNET_DB_DATABASE,
    port: process.env.TSNET_DB_PORT,
    username: process.env.TSNET_DB_USER,
    password: process.env.TSNET_DB_PASSWORD,
});

const User = sequelize.define('User', {
    UserID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    GoogleID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    RealName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    EmailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    BirthDate: {
        type: Sequelize.DATE,
    },
    Course: {
        type: Sequelize.STRING,
    },
    CreatedAt: {
        type: Sequelize.DATE,
    },
    AuthProvider: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ProfileImg: {
        type: Sequelize.STRING,
    },
},{
    tableName : 'User'
});



exports.handler = async (event) => {
    const userID = event.pathParameters.user_id;

    try {

        const userData = await User.findOne({
            where: {
                UserID: userID,
            },
            attributes: [
                'UserID',
                'GoogleID',
                'RealName',
                'EmailAddress',
                'BirthDate',
                'Course',
                'CreatedAt',
                'AuthProvider',
                'ProfileImg',
            ],
        });

        return {
            statusCode: 200,
            body: JSON.stringify(userData),
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
