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

var TwitterAPI = {};

TwitterAPI.RetrieveTweetData = (async (tweetId, token) => {
    try {
        const getSingleTweetEndpoint = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=created_at,attachments&expansions=author_id`
        let response = await fetch(getSingleTweetEndpoint, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "User-Agent": GLOBAL_VARIABLES.UA_HEADER
            }
        });
        let data = await response.json();
        console.log(data);
        return data;
    } catch (e) {
        console.error(e);
    }
})