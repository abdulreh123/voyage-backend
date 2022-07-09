
const UserModel = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };
  //  Create user
     const createUser = async (req,res ) => {
    try {
        const data= req.body
        const password = await hashPassword(data.password)
        delete data.password;
        const userData ={
            password: password,
            ...data
        }
      const user = await UserModel.create({ ...userData });
      res.status(200).json({ success: true, data: user });;
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: error.message,
        });
    }
  };
   //Get users
     const getUsers = async (req,res) => {
    try {
      const users = await UserModel.findAll({});
      res.status(200).json({ success: true, data: users});
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: error.message,
          });
    }
  };
  //  Get user
     const getUser = async (req , res )=> {
    try {
        const userId = req.param.id
      const result = await UserModel.findByPk(userId);
      
      res.status(200).json({ success: true, data: result});
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: error.message,
          });
    }
  };
  //  Update user
 const updateUser = async (
    req , res 
  ) => {
    try {
        const userId = req.param.id
        const data = req.body
      const user = await this.getuser(userId);
      await UserModel.update(
        { ...data },
        { where: { id: userId } }
      );
      
      res.status(200).json({ success: true, data: user,message:'record updated' });
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: error.message,
          });
    }
  };
  //  Delete user
     const deleteUser = async (
    req , res 
  ) => {
    try {
        const userId = req.param.id
      const user = await UserModel.findOne({
        where: {
          id: userId,
        },
        paranoid: false,
      });
      user.destroy();
      res.status(200).json({ success: true, data: user,message:'record deleted' });
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: error.message,
          });
    }
  };
  const generateToken = async (data )=> {
    try {
      const token = await jwt.sign(data, "voyage789", {
        expiresIn: 36000,
      });
      return token;
    } catch (error) {
      throw (error);
    }
  };
 
   const  loginViaForm =async(req , res ) =>{
    try {
        const data = req.body
      const { email, password } = data;
     const users = await UserModel.findOne({
        where: { email: email },
      });
      if (!users) throw Error("Invalid Credentials");
      const comparePassword =  await bcrypt.compare(password,users.password);
      if (!comparePassword) {
        throw Error("Invalid Credentials");
      }
      const token = await generateToken({
        userId: users.id ,
        name: users.name,
        surname: users.surname,
        email: users.email,
        location: users.location,
      });

      const result = {
        token,
        user: {
            userId: users.id ,
            name: users.name,
            surname: users.surname,
            location: users.location,
            email: users.email,
            nationality: users.nationality,
        },
      };
      req.session.isLoggedIn = result ? true : false; // Set Logged in session to true
      req.session.user = result?.user;
      res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: error.message,
          });
    }
  }

  /**
* verify user
* @param param
*/
     const verifyUser =async(req, res) =>{
    try {
    const email = req.session?.user?.email;
    if (!email) throw new Error("Please sign in");
      const users = await UserModel.findOne({
        where: {
            email:email
        },
      })

      if (!users) throw Error("User Does not Exist!");
      //  If user exist and activated
      //  Generate jwt token
      const token = await generateToken({
        userId: users.id ,
        name: users.name,
        surname: users.surname,
        email: users.email,
        location: users.location,
      });

      const result = {
        token,
        user: {
            userId: users.id ,
            name: users.name,
            surname: users.surname,
            email: users.email,
            location: users.location,
        },
      };
      res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({
            success: false,
            data: [],
            message: error.message,
          });
    }
  }
  module.exports = {
    Create:createUser,
    getAll:getUsers,
    getOne:getUser,
    update:updateUser,
    delete:deleteUser,
    loginForm:loginViaForm,
    verify:verifyUser
};