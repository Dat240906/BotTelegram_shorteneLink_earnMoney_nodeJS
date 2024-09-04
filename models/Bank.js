import mongoose from "mongoose";



const bankSchema = new mongoose.Schema({
    typeBank: {
        type:  String,
        required: true,
    },
    nameBank: {
        type: String,
        required: true,
    },
    numberAccountBank: {
        type: String,
        required: true,
        unique: true,
    }
})
bankSchema.pre('remove', async function(next) {
  try {
    const User = mongoose.model('User');
    const user = await User.findOne({ bank: this._id });

    if (user) {
      user.bank = null;
      await user.save();
    }

    next();
  } catch (err) {
    next(err);
  }
});


const BankModel = mongoose.model("Bank", bankSchema);

export default BankModel;

