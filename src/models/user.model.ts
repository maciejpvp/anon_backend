import mongoose, { Document, Model } from "mongoose";
import { comparePasswords, hashPassword } from "../utils/bcrypt";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/jwt";

interface IUser {
  username: string;
  publicKey: string;
  password: string;
  passwordChangedAt?: Date;
  profilePic?: string;
}

interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {
  register(
    username: string,
    password: string,
    publicKey: string,
    profilePic?: string
  ): Promise<{
    _id: string;
    username: string;
    profilePic?: string;
    publicKey: string;
  }>;
  login(
    username: string,
    password: string
  ): Promise<{
    user: {
      _id: string;
      username: string;
      profilePic?: string;
      publicKey: string;
    };
    token: string;
  }>;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    passwordChangedAt: Date,
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

userSchema.statics.register = async function (
  username: string,
  password: string,
  publicKey: string,
  profilePic?: string
) {
  const doesExist = await this.findOne({ username });
  if (doesExist) {
    throw new ApiError("Username already taken", 401);
  }

  const user = new this({
    username,
    password,
    publicKey,
    profilePic,
  });
  await user.save();
  return {
    _id: user._id,
    username: user.username,
    profilePic: user.profilePic,
    publicKey: user.publicKey,
  };
};

userSchema.statics.login = async function (username: string, password: string) {
  const user = await this.findOne({ username }).select("+password");
  if (!user) {
    throw new ApiError("Password Incorrect1", 401);
  }
  const isPasswordCorrect = await comparePasswords(password, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError("Password Incorrect2", 401);
  }

  const token = generateToken(user._id.toString());
  return {
    user: {
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
      publicKey: user.publicKey,
    },
    token,
  };
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default User;
