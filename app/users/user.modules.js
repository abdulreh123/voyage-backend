const userRoutes =require( "./user.routes");
const UserModule = {
  endpoint: "/api/v1/user",
  router: userRoutes,
};
module.exports = {endpoints:UserModule};
