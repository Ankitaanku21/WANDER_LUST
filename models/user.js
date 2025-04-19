import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

//automatically implement username, password, hasing and salting
userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);
