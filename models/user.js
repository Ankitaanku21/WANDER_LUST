import mongoose from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
    email: { type: String },
    username: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    instagramId: { type: String },
});

//automatically implement username, password, hashing and salting
userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);
