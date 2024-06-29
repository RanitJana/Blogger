const blogSchema = require("../models/blog.model.js");
const userSchema = require("../models/user.model.js");
const likeSchema = require("../models/like.model.js");

const url = require("url");
const jwt = require("jsonwebtoken");

async function getAllRandomBlogs() {
    try {
        const totalCount = await blogSchema.countDocuments();
        const blogs = await blogSchema.aggregate([{ $sample: { size: totalCount } }]);
        const ans = await blogSchema.populate(blogs, "user");
        return ans;
    } catch (err) {
        console.error(err);
    }
}

const displayHome = async function (req, res) {

    let blog = await getAllRandomBlogs();
    let likes = await likeSchema.find();

    blog.forEach(val => {
        val.formattedDate = val.updatedAt.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });

        let likeIndex = likes.findIndex(element => element.blog.toString() === val._id.toString());

        val.likes = likes[likeIndex].likers?.length || 0;

    });

    res.locals.blog = blog;

    return res.render("home")
}

const displayBlog = async function (req, res) {

    try {

        const myUrl = url.parse(req.url);
        const queryId = myUrl.query.replace("query=", "");

        const blog = await blogSchema.findById(queryId).populate("user");

        let likes = await likeSchema.findOne({ blog: queryId });

        blog.formattedDate = blog.updatedAt.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });

        blog.likes = likes.likers?.length || 0;

        blog.likeImgHref = "/images/icons8-like-32.png";

        if (likes.likers) {

            try {

                const token = req.cookies?.accessToken || req.header["Authentication"]?.replace("Bearer ", "");
                const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

                likes.likers.forEach(like => {
                    if (like.toString() === decoded._id) blog.likeImgHref = "/images/icons8-like-24.png";
                })
            }
            catch (err) { }
        }

        res.locals.blog = blog;

        return res.render("blog");

    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

const displayWriter = async function (req, res) {
    try {

        let myUrl = url.parse(req.url);

        let userId = myUrl.query.replace("query=", "");

        let blogNotPopulate = await blogSchema.find({ user: userId });

        let blogs = await blogSchema.populate(blogNotPopulate, 'user');

        let likes = await likeSchema.find();

        blogs.forEach(val => {

            val.formattedDate = val.updatedAt.toLocaleDateString('en-US', {
                month: 'short', day: '2-digit', year: 'numeric'
            });

            let likeIndex = likes.findIndex(element => element.blog.toString() === val._id.toString());

            val.likes = likes[likeIndex].likers?.length || 0;
        });

        res.locals.blogs = blogs;

        return res.render("writer");

    } catch (error) {
        return res.redirect("/");
    }
}

module.exports = {
    displayHome,
    displayBlog,
    displayWriter
}