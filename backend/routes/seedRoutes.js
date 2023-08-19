import express from 'express';
import Product from '../Models/productModel.js';
import data from '../data.js';
import User from '../Models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.deleteMany();
  const createProduct = await Product.insertMany(data.products);
  await User.deleteMany();
  const createUser = await User.insertMany(data.users);
  res.send({ createProduct, createUser });
});
export default seedRouter;
