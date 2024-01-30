/*global fetch*/

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    console.log("################# FETCHING GOOGLE OAUTH2 #################");

    const googleUserData = await fetch("https://www.googleapis.com/oauth2/v3/userinfo",
        {
            headers: {
                Authorization: `Bearer ${body.accessToken}`,
            },
        });
    const userData = await googleUserData.json();

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    };
};