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
        type: Sequelize.INTEGER,
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
}, {
    tableName: 'Like'
});

exports.handler = async (event, context) => {
    try {
        const data = JSON.parse(event.body);


        const isLike = data.action === 'like';


        const likeAction = isLike ? Like.create : Like.destroy;
        await likeAction({
            PostID: data.post_id,
            UserID: data.user_id,
            IsLike: isLike,
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
        console.error('Error handling like/unlike:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Error handling like/unlike',
            }),
        };
    }
};
