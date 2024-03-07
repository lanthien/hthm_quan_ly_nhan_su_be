import jwt from "jsonwebtoken";

let generateToken = (user: any, secretSignature: any, tokenLife: any) => {
  return new Promise((resolve, reject) => {
    const userData = {
      _id: user.id,
      name: user.name,
      role: user.role,
    };

    jwt.sign(
      { data: userData },
      secretSignature,
      { algorithm: "HS512", expiresIn: tokenLife },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

let verifyToken = (token: any, secretKey: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error: any, decoded: any) => {
      if (error) {
        return reject(error);
      }
      return resolve(decoded);
    });
  });
};

export default { generateToken: generateToken, verifyToken: verifyToken };
