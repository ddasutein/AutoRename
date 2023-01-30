/** MIT License
 * 
 * Copyright (c) 2023 Dasutein
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 * 
 * See more: https://github.com/ddasutein/AutoRename/blob/master/LICENSE
 * 
 */

(async function () {

  /**
   * First we need to establish a connection to Twitter API using the credientials we generated.
   * Once we provide the API key and secret, it should return a bearer token key which we can use
   * to access Twitter API. Note for all developers, you must provide your own keys if you wish to 
   * utilize this extension for your own use.
   */
  var TwitterAuth = {

    API_KEY: "<GENERATE YOUR OWN API KEY>",
    API_SECRET: "<GENERATE YOUR OWN API SECRET>",

    Initialize: (async () => {
      const authUrl = "https://api.twitter.com/oauth2/token";
      try {
        let response = await fetch(authUrl, {
          method: "POST",
          body: "grant_type=client_credentials",
          headers: {
            "Authorization": "Basic " + btoa(TwitterAuth.API_KEY + ":" + TwitterAuth.API_SECRET),
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": GLOBAL_VARIABLES.UA_HEADER
          }
        });
        let data = await response.json();  
        return data;
      } catch(e){
        console.error(e)
      }
    })

  }
  let TOKEN_KEY = await TwitterAuth.Initialize();

  let tokenObj = {};
  tokenObj[GLOBAL_VARIABLES.TOKEN_KEY_NAME] = TOKEN_KEY.access_token;
  chrome.storage.session.set(tokenObj);

})();