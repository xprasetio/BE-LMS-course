import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
export const signUpAction = async (req, res) => {
  try {
    const body = req.body;
    const hashPassword = await bcrypt.hash(body.password, 10);
    body.password = hashPassword;
    const user = new userModel({
      name: body.name,
      email: body.email,
      photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      password: body.password,
      role: "manager",
    });
    await user.save();
    return res.json({
      message: "Sign up success",
      data: {
        midtrans_payment_url: "https://app.sandbox.midtrans.com/snap/snapToken",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
