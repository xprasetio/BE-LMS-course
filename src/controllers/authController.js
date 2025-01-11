import bcrypt from "bcrypt";
import TransactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import jwt from "jsonwebtoken";

export const signUpAction = async (req, res) => {
  const midtransUrl = process.env.MIDTRANS_URL;
  const midtransAuthString = process.env.MIDTRANS_AUTH_STRING;

  try {
    const body = req.body;
    const hashPassword = await bcrypt.hash(body.password, 10);
    body.password = hashPassword;
    const user = new userModel({
      name: body.name,
      email: body.email,
      photo: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      password: body.password,
      role: "manager",
    });
    const transaction = new TransactionModel({
      user: user._id,
      price: 100000,
    });

    const midtrans = await fetch(midtransUrl, {
      method: "POST",
      body: JSON.stringify({
        transaction_details: {
          order_id: transaction._id.toString(),
          gross_amount: transaction.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: user.email,
        },
        callbacks: {
          finish: "http://localhost:5173/success-checkout",
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${midtransAuthString}`,
      },
    });
    const midtransResponse = await midtrans.json();
    await user.save();
    await transaction.save();
    
    return res.json({
      message: "Sign up success",
      data: {
        midtrans_payment_url: midtransResponse.redirect_url,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const SignInAction = async (req, res) => {
  try { 
    const body = req.body;
    const existingUser = await userModel.findOne({ email: body.email });
    const comparePassword = await bcrypt.compareSync(
      body.password,
      existingUser.password
    );
    if (comparePassword) {
      return res.status(200).json({
        message: "Sign in success",
        data: existingUser,
      });
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isValidUser = await transactionModel.findOne({
      user: existingUser._id,
      status: "success",
    });
    if (existingUser.role !=="student" && !isValidUser) {
      return res.status(401).json({
        message: "user no verified",
      });
    }
    const token = jwt.sign(
      {
        data : {
          id: existingUser._id.toString(),
        }
      },
      process.env.SCRET_KEY_JWT,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).json({
      message: "Sign in success",
      data: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
