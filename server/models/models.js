const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userID: { type: Number, required: true },
  providerID: { type: Number, required: true },
});

const CartSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userID: { type: Number, required: true },
  productID: { type: Number, required: true },
  sold: { type: Boolean, required: true },
});

const CategorySchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  category: { type: String, required: true },
});

const CommentSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userID: { type: Number, required: true },
  postID: { type: Number, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
});

const GallerySchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userID: { type: Number, required: true },
  image: { type: String, required: true },
});

const PostSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userID: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
  text: { type: String, required: true },
  image: { type: String, required: true },
});

const LikeSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userID: { type: Number, required: true },
  postID: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  userID: { type: Number, required: true },
  rating: { type: String, default: "0" },
  quantity: { type: Number, default: 0 },
  pic: { type: String, default: null },
});

const ReviewSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userID: { type: Number, required: true },
  providerID: { type: Number, required: true },
  text: { type: String, required: true },
  rating: { type: String, default: "0", required: true },
  pic: { type: String, default: null, required: true },
  date: { type: Date, default: Date.now, required: true },
});

const RoleSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  Role: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  RoleID: { type: Number, default: 3 },
  mobile: { type: Number, default: null },
  serviceName: { type: String, default: null },
  location: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: null },
  cover: { type: String, default: null },
  thumbnail: { type: String, default: null },
  video: { type: String, default: null },
  description: { type: String, default: null },
  workingHours: {
    type: String,
    default:
      '{"Saturday":["closed","closed"],"Sunday":["closed","closed"],"Monday":["closed","closed"],"Tuseday":["closed","closed"],"Wednesday":["closed","closed"],"Thursday":["closed","closed"],"Friday":["closed","closed"]}',
  },
  facilities: { type: String, default: null },
  categoryID: { type: Number, default: null }, ///////maybe wrong the default value
  token: { type: String, default: null },
  payService: { type: String, default: null },
});

module.exports = {
  BookmarkModel: mongoose.model("Bookmarks", BookmarkSchema),
  CartModel: mongoose.model("Cart", CartSchema),
  CategoryModel: mongoose.model("Category", CategorySchema),
  CommentModel: mongoose.model("Comments", CommentSchema),
  GalleryModel: mongoose.model("Gallery", GallerySchema),
  PostModel: mongoose.model("Posts", PostSchema),
  LikeModel: mongoose.model("Likes", LikeSchema),
  ProductModel: mongoose.model("Products", ProductSchema),
  ReviewModel: mongoose.model("Reviews", ReviewSchema),
  RoleModel: mongoose.model("Role", RoleSchema),
  UserModel: mongoose.model("Users", UserSchema),
};
