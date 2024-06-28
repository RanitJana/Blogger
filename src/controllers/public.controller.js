const url = require("url");
const blogSchema = require("../models/blog.model.js");
const userSchema = require("../models/user.model.js");
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

    blog.forEach(val => {
        val.formattedDate = val.updatedAt.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });
    });

    res.locals.blog = blog;

    return res.render("home")
}

const displayBlog = async function (req, res) {
    try {
        const myUrl = url.parse(req.url);
        const queryId = myUrl.query.replace("query=", "");

        const blog = await blogSchema.findById(queryId).populate("user");
        blog.formattedDate = blog.updatedAt.toLocaleDateString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric'
        });

        res.locals.blog = blog;

        return res.render("blog");

    } catch (error) {
        return res.redirect("/");
    }
}

const displayWriter = async function (req, res) {
    try {

        let myUrl = url.parse(req.url);

        let userId = myUrl.query.replace("query=", "");

        let blogNotPopulate = await blogSchema.find({ user: userId });

        let blogs = await blogSchema.populate(blogNotPopulate, 'user');

        blogs.forEach(val => {
            val.formattedDate = val.updatedAt.toLocaleDateString('en-US', {
                month: 'short', day: '2-digit', year: 'numeric'
            });
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