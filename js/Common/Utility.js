let Utility = {

    GenerateRandomString : ((length) => {
        const value = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const random = [];
        for (let i = 0; i < length; i++) {
            random.push(value[Math.floor(Math.random() * value.length)]);
        }
        return random.join("");
    }),

    SplitURL : ((url, index) => {
        let split = url.split("/"); 
        return split[index];
    })

}