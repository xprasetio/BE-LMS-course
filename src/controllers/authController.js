import bcrypt from "bcrypt";
import TransactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js";

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
