# opstalent
test task

#how to use
1) clone repo <br>
2) npm install <br>
3) in root project folder create folder config <br>
4) goto config folder and create js file default.js like below: <br>

module.exports = {<br>
  client_id:   'put_your_app_spotify_client_id', <br>
  client_secret: 'put_your_app_spotify_client_secret', <br>
  redirect_uri: 'http://localhost:5300/aftercode' -- this value is MANDATORY <br>
};

4) npm start
