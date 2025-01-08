import transactionModel from "../models/transactionModel.js";

export const handlePayment = async (req, res) => {
  try {
    const body = req.body;
    const orderId = body.order_id;

    switch (body.transaction_status) {
      case "capture":
      case "settlement":
        await transactionModel.findByIdAndUpdate(orderId, {
          status: "success",
        });
        break;
      case "deny":
      case "cancel":
      case "expire":
      case "failure":
        await transactionModel.findByIdAndUpdate(orderId, {
          status: "failed",
        });
        break;
      default:
        break;
    }

    return res.status(200).json({
      message: "success",
      data: {}
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};