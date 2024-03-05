const { Sequelize, DATE } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

console.log("################# DATABASE PART #################");
console.log("Connecting to database...");
const sequelize = new Sequelize({
    dialect: process.env.TSNET_DB_DIALECT,
    host: process.env.TSNET_DB_HOST,
    database: process.env.TSNET_DB_DATABASE,
    port: process.env.TSNET_DB_PORT,
    username: process.env.TSNET_DB_USER,
    password: process.env.TSNET_DB_PASSWORD
});
const testDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.log("Error at Sequelize");
        console.log(error);
        antwortFrontend.status = "error";
        antwortFrontend.steps.database = JSON.stringify(error);
        console.error("Unable to connect to the database:", error);
    }
};

/*global fetch*/
exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);
    console.log(body);
    const googleUserData = body.user;
    const googleToken = body.accessToken;
    const antwortFrontend = {
        status: "ok",
        message: "",
        user:"",
        steps: {}
    };
    try {
        await testDatabaseConnection();
    } catch (error) {
        console.log("Error at Sequelize");
        console.log(error);
        antwortFrontend.status = "error";
        antwortFrontend.steps.database = JSON.stringify(error);
    }

    async function createSession(googleUserData, googleToken) {
        const newSessionUUID = uuidv4();
        antwortFrontend["sessionData"] = newSessionUUID;
        try {
            const [session, _] = await sequelize.query(`
                INSERT INTO Session (SessionID, RealName, Token, CreatedAt, UpdatedAt)
                VALUES ('${newSessionUUID}', '${googleUserData.name}', '${googleToken}', '${new Date().toISOString()}', '${new Date().toISOString()}' )
                `);
        } catch (error) {
            console.log("Derzeit noch kein Session Management");
            console.log(error);
            antwortFrontend.status = "error";
            antwortFrontend.steps.session = JSON.stringify(error);
        }
        return newSessionUUID;
    }
    try {
        const [existingUser, _] = await sequelize.query(` SELECT * FROM User WHERE GoogleID = '${googleUserData.sub}' `);
        antwortFrontend.steps.existingUser = "ok";
        if (existingUser.length > 0) {
            antwortFrontend.isNewUser = false;
            antwortFrontend.steps.existingUserMessage = JSON.stringify(existingUser);
            // Function Select * From Session WHERE RealName = '${googleUserData.name}'
            const [restoreSession, _] = await sequelize.query(`
                SELECT * FROM Session WHERE RealName = '${googleUserData.name}'
            `);
            console.log(typeof restoreSession);
            console.log(restoreSession);
            if (restoreSession.length > 0) {
                const [deleteSession, _] = await sequelize.query(`
                    DELETE FROM Session WHERE RealName = '${googleUserData.name}'
                `);
                const newSessionKnownUser = await createSession(googleUserData, googleToken);
                antwortFrontend.steps.session = "ok";
                antwortFrontend.sessionData = newSessionKnownUser;
            } else {
                // Known User, without Session? Cleared Browser Cache?
                const newSessionKnownUser = await createSession(googleUserData, googleToken);
                antwortFrontend.steps.session = "ok";
                antwortFrontend.sessionData = newSessionKnownUser;
            }
        } else {
            antwortFrontend.isNewUser = true;
            try {
                const [insertUser, _] = await sequelize.query(`
                    INSERT INTO User (UserID, GoogleID, RealName, EmailAddress, BirthDate, Course, CreatedAt, AuthProvider, ProfileImg)
                    VALUES ('${uuidv4()}', '${googleUserData.sub}', '${googleUserData.name}', '${googleUserData.email}', null, null,'${new Date().toISOString()}', "google", '${googleUserData.picture}')
                `);
                antwortFrontend.steps.insertUser = "ok";
                antwortFrontend.steps.insertUserMessage = JSON.stringify(insertUser);
                let sessionID = await createSession(googleUserData, googleToken);
                antwortFrontend.steps.session = "ok";
                antwortFrontend.sessionData = sessionID;
                const existingUser = await sequelize.query(` SELECT * FROM User WHERE GoogleID = '${googleUserData.sub}' `);
            antwortFrontend.user = JSON.stringify(existingUser);
            } catch (error) {
                antwortFrontend.status = "error";
                antwortFrontend.steps.insertUser = JSON.stringify(error);
            }
        }
    } catch (error) {
        console.log("Error at Finde User in DB");
        antwortFrontend.status = "error";
        antwortFrontend.steps.existingUser = JSON.stringify(error);
    }
    console.log("################# Antwort an Frontend #################");
    console.log(antwortFrontend);

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(antwortFrontend),
    };
};