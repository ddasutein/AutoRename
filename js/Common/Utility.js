/** MIT License
 * 
 * Copyright (c) 2021 Dasutein
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

/**
 * Access common utility functions
 */

let Utility = {

    /**
     * Generates random string
     */
    GenerateRandomString : ((length) => {
        const value = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const random = [];
        for (let i = 0; i < length; i++) {
            random.push(value[Math.floor(Math.random() * value.length)]);
        }
        return random.join("");
    }),

    /**
     * Splits URL
     */
    SplitURL : ((url, index) => {
        let split = url.split("/"); 
        return split[index];
    })

}