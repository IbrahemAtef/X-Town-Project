const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('config');
const secretKey = config.get('jwtSecret');
const connectDB = require("./database/index");
connectDB();

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLID,
} = require("graphql");

const {
  BookmarkModel,
  CartModel,
  CategoryModel,
  CommentModel,
  GalleryModel,
  PostModel,
  LikeModel,
  ProductModel,
  ReviewModel,
  RoleModel,
  UserModel,
} = require("./models/models");

const UserType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    RoleID: { type: GraphQLInt },
    payService: { type: GraphQLString },
    mobile: { type: GraphQLInt },
    serviceName: { type: GraphQLString },
    location: { type: GraphQLString },
    address: { type: GraphQLString },
    avatar: { type: GraphQLString },
    cover: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    video: { type: GraphQLString },
    description: { type: GraphQLString },
    workingHours: { type: GraphQLString },
    facilities: { type: GraphQLString },
    categoryID: { type: GraphQLID }, // what is it for
    token: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(root, args) {
        // return await knex('post').select().where({ userID: root.id });
        return await PostModel.find({ userID: root.id });
      },
    },
    categoryName: {
      type: CategoryType,
      async resolve(root, args) {
        // return await knex('category')
        //   .select()
        //   .where({ id: root.categoryID })
        //   .first();
        return await CategoryModel.findOne({ _id: root.categoryID }); // maybe need to take the first index
      },
    },
  }),
});

const LikeType = new GraphQLObjectType({
  name: "like",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    postID: { type: GraphQLID },
  }),
});

const cartType = new GraphQLObjectType({
  name: "cart",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    productID: { type: GraphQLID },
    sold: { type: GraphQLBoolean },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "category",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    category: { type: GraphQLString },
    // user: {
    //   type: new GraphQLList(UserType),
    //   async resolve(parent, args){
    //     return await knex('user').select().where({categoryID : parent.id});
    //   }
    // }
  }),
});

const productType = new GraphQLObjectType({
  name: "product",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    price: { type: GraphQLInt },
    userID: { type: GraphQLID },
    rating: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    pic: { type: GraphQLString },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "comment",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    postID: { type: GraphQLID },
    text: { type: GraphQLString },
    date: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(root, args) {
        // return await knex('user').select().where({ id: root.userID }).first();
        return await UserModel.findOne({ _id: root.userID });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "post",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    date: { type: GraphQLString },
    text: { type: GraphQLString },
    image: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(root, args) {
        // return await knex('user').select().where({ id: root.userID }).first();
        return await UserModel.findOne({ _id: root.userID });
      },
    },
  }),
});

const GalleryType = new GraphQLObjectType({
  name: "gallery",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    image: { type: GraphQLString },
  }),
});

const bookmarkType = new GraphQLObjectType({
  name: "bookmark",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    providerID: { type: GraphQLID },
    provider: {
      type: UserType,
      async resolve(root, args) {
        // return await knex('user')
        //   .select()
        //   .where({ id: root.providerID })
        //   .first();
        return await UserModel.findOne({ _id: root.providerID });
      },
    },
  }),
});

const rolesType = new GraphQLObjectType({
  name: "roles",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    Role: { type: GraphQLString },
  }),
});

const reviewType = new GraphQLObjectType({
  name: "review",
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    providerID: { type: GraphQLID },
    text: { type: GraphQLString },
    rating: { type: GraphQLString },
    pic: { type: GraphQLString },
    date: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(root, args) {
        // return await knex('user').select().where({ id: root.userID }).first();
        return await UserModel.findOne({ _id: root.userID });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('user').select().where({ id: args.id }).first();
        return await UserModel.findOne({ _id: args.id });
      },
    },
    getUsers: {
      type: new GraphQLList(UserType),
      args: {
        RoleID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('user').select().where(args);
        // return await UserModel.find(args); //////////////////// check if it works like this
        return await UserModel.find({ RoleID: args.RoleID });
      },
    },
    // ( check if we need it)
    // carts: {
    //   type: new GraphQLList(cartType),
    //   args: {
    //     userID: { type: new GraphQLNonNull(GraphQLID) },
    //   },
    //   async resolve(root, args) {
    //     return await knex('cart')
    //       .select()
    //       .where({ userID: args.userID, sold: false }); // why sold is false
    //   },
    // },
    productsByUserID: {
      type: new GraphQLList(productType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('product')
        //   .select()
        //   .where({ userID: args.userID })
        //   .limit(50);
        return await ProductModel.find({ userID: args.userID }).limit(50);
      },
    },
    // ( check if we need it)
    // productsByCategory: {
    //   type: new GraphQLList(productType),
    //   args: {
    //     category: { type: new GraphQLNonNull(GraphQLString) },
    //   },
    //   async resolve(root, args) {
    //     return await knex('product')
    //       .select()
    //       .where({ category: args.category })
    //       .limit(50);
    //   },
    // },
    comments: {
      type: new GraphQLList(CommentType),
      args: {
        postID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('comment').select().where({ postID: args.postID });
        return await CommentModel.find({ postID: args.postID });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('post').select().where({ userID: args.userID });
        return await PostModel.find({ userID: args.userID });
      },
    },
    ////////********* review it to check if it's needed and compare between it and get users*************/
    // usersByCategory: {
    //   type: new GraphQLList(UserType),
    //   args: {
    //     category: { type: new GraphQLNonNull(GraphQLString) },
    //   },
    //   async resolve(parent, args) {
        // try {
        //   var categoryData = await knex('category')
        //     .select()
        //     .where({ category: args.category })
        //     .first();
        //   return await knex('user')
        //     .select()
        //     .where({ categoryID: categoryData.id });
        // } catch (err) {
        //   return err;
        // }
      // },
    // },
    // ( check if we need it)
    // category: {
    //   type: CategoryType,
    //   args: {
    //     id: { type: new GraphQLNonNull(GraphQLID) },
    //   },
    //   async resolve(root, args) {
    //     return await knex('category').select().where({ id: args.id }).first();
    //   },
    // },

    // ( check if we need it)
    // getAllCategories: {
    //   type: new GraphQLList(CategoryType),
    //   async resolve(root, args) {
    //     return await knex('category').select();
    //   },
    // },
    gallery: {
      type: new GraphQLList(GalleryType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('gallery').select().where({ userID: args.userID });
        return await GalleryModel.find({ userID: args.userID });
      },
    },
    // ( check if we need it)
    // getRoles: {
    //   type: new GraphQLList(rolesType),
    //   async resolve(root, args) {
    //     return await knex('roles').select();
    //   },
    // },

    bookmarks: {
      // change it to bookmarksByUserID
      type: new GraphQLList(bookmarkType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('bookmark').select().where({ userID: args.userID });
        return await BookmarkModel.find({ userID: args.userID });
      },
    },

    //****************** change it ro bookmarksByProviderID and compare between it and bookmarks****************/
    allBookmarks: {
      type: new GraphQLList(bookmarkType),
      args: {
        providerID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('bookmark')
        //   .select()
        //   .where({ providerID: args.providerID });
        return await BookmarkModel.find({ providerID: args.providerID });
      },
    },

    // ( check if we need it)
    // role: {
    //   type: rolesType,
    //   args: {
    //     id: { type: new GraphQLNonNull(GraphQLID) },
    //   },
    //   async resolve(root, args) {
    //     return await knex('roles').select().where({ id: args.id }).first();
    //   },
    // },
    getCategoryByID: {
      type: CategoryType,
      args: {
        categoryID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        // return await knex('category')
        //   .select('category')
        //   .where({ id: args.categoryID })
        //   .first();
        return await CategoryModel.findOne({ _id: args.categoryID });
      },
    },
    getReviews: {
      type: new GraphQLList(reviewType),
      args: {
        providerID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('review')
        //   .select()
        //   .where({ providerID: args.providerID });
        return await ReviewModel.find({ providerID: args.providerID });
      },
    },

    getLikesByPostID: {
      type: new GraphQLList(LikeType),
      args: {
        postID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('likes').select().where({ postID: args.postID });
        return await LikeModel.find({ postID: args.postID });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // for user table
    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        //login
        try {
          // const data = await knex('user')
          //   .select('*')
          //   .where({ email: args.email })
          //   .first();
          const data = await UserModel.findOne({ email: args.email });
          if (data.password) { /////// why we put this condition + Cannot read property 'password' of null
            if (await bcrypt.compare(args.password, data.password)) {
              const token = jwt.sign(
                { id: data.id, username: data.username, email: data.email },
                secretKey,
                {
                  algorithm: "HS256",
                  expiresIn: "2 days",
                }
              );
              // await knex('user')
              //   .update({ token: token })
              //   .where({ email: args.email });
              // return await knex('user')
              //   .select('*')
              //   .where({ email: args.email })
              //   .first();
              return await UserModel.findOne({ email: args.email });
            }
          } else {
            console.log("invalid username or password");
          }
        } catch (err) {
          console.log(err);
        }
      },
    },
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        RoleID: { type: GraphQLString }, // compare it with database key and check if it needs default value
        mobile: { type: GraphQLInt },
        serviceName: { type: GraphQLString },
        location: { type: GraphQLString },
        address: { type: GraphQLString },
        avatar: { type: GraphQLString },
        cover: { type: GraphQLString },
        thumbnail: { type: GraphQLString },
        video: { type: GraphQLString },
        description: { type: GraphQLString },
        facilities: { type: GraphQLString },
        payService: { type: GraphQLString },
      },
      async resolve(root, args) {
        // add user with crpted password to database
        args.password = await bcrypt.hash(args.password, 10);
        args._id = await UserModel.countDocuments() + 1;
        // return await knex('user').insert(args);
        const user = new UserModel(args);
        return await user.save();
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex('user').where({ id: args.id }).del();
        return await UserModel.deleteOne({_id: args.id});
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        RoleID: { type: GraphQLInt },
        mobile: { type: GraphQLInt },
        serviceName: { type: GraphQLString },
        location: { type: GraphQLString },
        address: { type: GraphQLString },
        avatar: { type: GraphQLString },
        cover: { type: GraphQLString },
        thumbnail: { type: GraphQLString },
        video: { type: GraphQLString },
        description: { type: GraphQLString },
        workingHours: { type: GraphQLString },
        facilities: { type: GraphQLString },
        categoryID: { type: GraphQLID },
        payService: { type: GraphQLString },
      },
      async resolve(root, args) {
        if (args.password) {
          args.password = await bcrypt.hash(args.password, 10);
        }
        // return await knex('user').where({ id: args.id }).update(args);
        return await UserModel.updateOne({_id: args.id},args);
      },
    },
    // for product table
    addProduct: {
      type: productType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        userID: { type: new GraphQLNonNull(GraphQLID) },
        rating: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        pic: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("product").insert(args);
        args._id = await ProductModel.countDocuments() + 1;
        const product = new ProductModel(args);
        return await product.save();
      },
    },
    deleteProduct: {
      type: productType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("product").where({ id: args.id }).del();
        return await ProductModel.deleteOne({_id: args.id});
      },
    },
    editProduct: {
      type: productType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        price: { type: GraphQLInt },
        userID: { type: GraphQLID },
        rating: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        pic: { type: GraphQLString },
      },
      async resolve(root, args) {
        // return await knex("product").where({ id: args.id }).update(args);
        return await ProductModel.updateOne({_id: args.id},args);
      },
    },
    // for cart table
    addCart: {
      type: cartType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        productID: { type: new GraphQLNonNull(GraphQLID) },
        sold: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      async resolve(root, args) {
        // return await knex("cart").insert(args);
        args._id = await CartModel.countDocuments() + 1;
        const cart = new CartModel(args);
        return await cart.save();
      },
    },
    deleteCart: {
      type: cartType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("cart").where({ id: args.id }).del();
        return await CartModel.deleteOne({_id: args.id});
      },
    },
    editCart: {
      type: cartType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: GraphQLID },
        productID: { type: GraphQLID },
        sold: { type: GraphQLBoolean },
      },
      async resolve(root, args) {
        // return await knex("cart").where({ id: args.id }).update(args);
        return await CartModel.updateOne({_id: args.id},args);
      },
    },
    //for like table
    addLike: {
      type: LikeType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        postID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("likes").insert(args);
        args._id = await LikeModel.countDocuments() + 1;
        const like = new LikeModel(args);
        return await like.save();
      },
    },

    deleteLike: {
      type: LikeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("likes").where({ id: args.id }).del();
        return await LikeModel.deleteOne({_id: args.id});
      },
    },

    // for comment table
    addComment: {
      type: CommentType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        postID: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLString }, // should we remove it
      },
      async resolve(root, args) {
        // return await knex("comment").insert(args);
        args._id = await CommentModel.countDocuments() + 1;
        const comment = new CommentModel(args);
        return await comment.save();
      },
    },
    deleteComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("comment").where({ id: args.id }).del();
        return await CommentModel.deleteOne({_id: args.id});
      },
    },
    editComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        postID: { type: GraphQLID },
        text: { type: GraphQLString },
        date: { type: GraphQLString },
      },
      async resolve(root, args) {
        // return await knex("comment").where({ id: args.id }).update(args);
        return await CommentModel.updateOne({_id: args.id},args);
      },
    },
    // for post table
    addPost: {
      type: PostType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        date: { type: GraphQLString },
        text: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("post").insert(args);
        args._id = await PostModel.countDocuments() + 1;
        const post = new PostModel(args);
        return await post.save();
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("post").where({ id: args.id }).del();
        return await PostModel.deleteOne({_id: args.id});
      },
    },
    editPost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: GraphQLID },
        date: { type: GraphQLString },
        text: { type: GraphQLString },
        image: { type: GraphQLString },
      },
      async resolve(root, args) {
        // return await knex("post").where({ id: args.id }).update(args);
        return await PostModel.updateOne({_id: args.id},args);
      },
    },
    addCategory: {
      type: CategoryType,
      args: {
        category: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("category").insert(args);
        args._id = await CategoryModel.countDocuments() + 1;
        const category = new CategoryModel(args);
        return await category.save();
      },
    },
    deleteCategory: {
      type: CategoryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("category").where(args).del();
        return await CategoryModel.deleteOne({_id: args.id});
      },
    },
    editCategory: {
      type: CategoryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        category: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("category").where({ id: args.id }).update(args);
        return await CategoryModel.updateOne({_id: args.id},args);
      },
    },
    addGallery: {
      type: GalleryType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("gallery").insert(args);
        args._id = await GalleryModel.countDocuments() + 1;
        const gallery = new GalleryModel(args);
        return await gallery.save();
      },
    },
    deleteGallery: {
      type: GalleryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("gallery").where(args).del();
        return await GalleryModel.deleteOne({_id: args.id});
      },
    },
    editGallery: {
      type: GalleryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: GraphQLID },
        image: { type: GraphQLString },
      },
      async resolve(root, args) {
        // return await knex("gallery").where({ id: args.id }).update(args);
        return await GalleryModel.updateOne({_id: args.id},args);
      },
    },
    addBookmark: {
      type: bookmarkType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        providerID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("bookmark").insert(args);
        args._id = await BookmarkModel.countDocuments() + 1;
        const bookmark = new BookmarkModel(args);
        return await bookmark.save();
      },
    },
    deleteBookmark: {
      type: bookmarkType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("bookmark").where(args).del();
        return await BookmarkModel.deleteOne({_id: args.id});
      },
    },
    addRole: {
      type: rolesType,
      args: {
        Role: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("roles").insert(args);
        args._id = await RoleModel.countDocuments() + 1;
        const role = new RoleModel(args);
        return await role.save();
      },
    },
    deleteRole: {
      type: rolesType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        // return await knex("roles").where(args).del();
        return await RoleModel.deleteOne({_id: args.id});
      },
    },
    editRole: {
      type: rolesType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        Role: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("roles").where({ id: args.id }).update(args);
        return await RoleModel.updateOne({_id: args.id},args);
      },
    },
    addReview: {
      type: reviewType,
      args: {
        providerID: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLString },
        rating: { type: new GraphQLNonNull(GraphQLString) },
        pic: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        // return await knex("review").insert(args);
        args._id = await ReviewModel.countDocuments() + 1;
        const review = new ReviewModel(args);
        return await review.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});





/*
what if i delete a user his id is 2 and there is a 3 user and then add another one 
should the new one take the id 4 or 3 and the user of id 3 should take the place of 2
*/