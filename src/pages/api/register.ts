import { NextApiRequest, NextApiResponse } from 'next';
import db from '../utils/db';
import mongoose from 'mongoose';
import UserModel from '../Model/UserModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (name && email && password) {
      const test = new UserModel({ name: name, email: email, passWord: password })
      await test.save();
    } else {
      console.log("Ujjwal")
    }

  }
}
