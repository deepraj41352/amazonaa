import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'deepraj932000@gmail.com',
    pass: 'juwnwkdiothfivzc',
  },
});
transporter.verify().then(console.log).catch(console.error);

export const nodeMailer = (mail) => {
  try {
    const info = transporter.sendMail(mail);
    console.log('info ', info);
    return info;
  } catch (err) {
    console.log('Error ', err);
    return err;
  }
};

export const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : 'https://amozona.com';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorizattion = req.headers.authorizattion;
  if (authorizattion) {
    const token = authorizattion.slice(7, authorizattion.lenght);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
