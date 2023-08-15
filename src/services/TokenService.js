import Token from '../models/Token.js';

class TokenManager {
    constructor(user, token, decoded) {
        this.user = user;
        this.decoded = decoded;
        this.token = token;
    }

    async addTokenInUserBlackList() {
        // get the tokens array by username if exists ot create the record with empty array
        const tokenData = await Token.findOrCreate({
            where: { username: this.user.username },
            defaults: {
                tokens: []
            }
        });

        // get the model instance
        const tokenInstance = tokenData[0];

        // get the array of tokens:
        const tokens = Object.assign([], tokenInstance.tokens);

        // check if current token exists in the array
        const isPresent = tokens.filter((e) => e[0] === this.token).length !== 0;

        // If the token does not exists - add it in the black list array
        if (!isPresent) {
            tokens.push([this.token, this.decoded.exp]);
            return await tokenInstance.update({ tokens });
        }
        return await true;
    }

    async checkIfTokenIsInBlackList() {
        const username = this.user.username;
        const tokenData = await Token.findByPk(username);

        if (!tokenData) {
            return false;
        }

        const isInBlackList = tokenData.tokens.filter((e) => e[0] === this.token).length !== 0;

        if (isInBlackList) {
            return true;
        }
        return false;
    }

    async removeTokensFromBlackList(user) {
        // delete all tokens by user

        // TODO...
        return await true;
    }
};

export default TokenManager;
