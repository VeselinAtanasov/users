import Token from '../models/Token.js';

class TokenService {
    constructor(user, token, decoded) {
        this.user = user;
        this.decoded = decoded;
        this.token = token;
    }

    async addTokenInUserBlackList() {
        // get the tokens array by username if exists ot create the record with empty array
        return await Token.create({
            user_id: this.decoded.id,
            token: this.token
        });
    }

    async checkIfTokenIsInBlackList() {
        const id = this.decoded.id;

        const tokenData = await Token.findAll({ where: { user_id: id } });

        if (!tokenData) {
            return false;
        }

        return tokenData.filter((model) => model.token === this.token).length !== 0;
    }

    async removeTokensFromBlackList() {
        const userId = this.user.id;
        // how to get user along with its tokens:
        // const tokenData = await User.findOne({
        //     include: [{
        //         model: Token,
        //         where: { user_id: userId }
        //     }]
        // });

        const tokenData = await Token.findAll({ where: { user_id: userId } });

        return await Promise.allSettled(tokenData.map((model) => model.destroy()));
    }
};

export default TokenService;
