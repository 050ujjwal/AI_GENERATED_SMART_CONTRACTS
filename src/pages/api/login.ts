import { NextApiRequest, NextApiResponse } from 'next';
import db from '../utils/db';
import mongoose from 'mongoose';
import UserModel from '../Model/UserModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db();
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    console.log(user)

    try{
      if(password === user?.passWord){
        res.status(200).json({message: "Login successful!"})
      }else{
        res.status(404).json({message: "Not successful!"})
      }
    }catch(e){
      console.log(e)
    }
  }
}

