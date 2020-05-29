const UserModel = require("../models");
const { ec } = require("elliptic");
const EC = new ec("secp256k1");
const bcrypt = require("bcryptjs");

const generatePrivateKey = () => {
  const keyPair = EC.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

const getPublicKey = (privateKey) => {
  const key = EC.keyFromPrivate(privateKey, "hex");
  return key.getPublic().encode("hex");
};

exports.signUp = async (req, res, next) => {
  const { password, username } = req.body;
  try {
    if (username.length === 0 || password.length === 0) {
      return res.json({
        message: "Username or password must not null :))",
      });
    }

    const oldUser = await UserModel.findOne({ username });
    if (!!oldUser) {
      return res.json({
        message: `Username ${username} has already exsit`,
      });
    }
    let privateKey = generatePrivateKey();
    let publicKey = getPublicKey(privateKey);

    const saltValue = await bcrypt.genSalt(10);
    bcrypt.hash(password, saltValue, async (error, hash) => {
      if (!error) {
        const newUser = new UserModel({ username, password: hash, privateKey, publicKey });
        const result = await newUser.save();
        if (!!result) {
          return res.json({ username: username, publicKey, privateKey });
        }
      }
    });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong!",
      error,
    });
  }
};

exports.signIn = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!!user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result)
          return res.json({
            publicKey: user.publicKey,
          });
        else
          return res.json({
            message: "username or password is not correct",
          });
      });
    } else
      return res.json({
        message: "username or password is not correct",
      });
  } catch (error) {
    return res.status(400).json({
      message: "something went wrong!",
      error,
    });
  }
};
