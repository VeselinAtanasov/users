// Workaround solution, till I find how to exclude sensitive data from the model on retrieve
export default (model) => {
    const modelToJson = model.toJSON();

    delete modelToJson.getJWT;
    delete modelToJson.password;

    return modelToJson;
};
