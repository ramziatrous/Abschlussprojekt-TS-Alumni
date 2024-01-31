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
}, {
    tableName: 'User'
});



exports.handler = async (event) => {

    try {
        const requestBody = JSON.parse(event.body);
        const name = requestBody.name;
        const usersData = await User.findAll({
            where: {
                RealName: {
                    [Sequelize.Op.like]: `${name}%`,
                },
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
            body: JSON.stringify(usersData),
        };
    } catch (error) {
        console.error('Error fetching users data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};