const {Schema, model} = require('mongoose');

const blogSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    content:{
        type: String,
        required:true,
    },
    coverImage:{
        type: String,
        default:"/images/blog-default.jpg"
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    }
},{timestamps:true});


const BLOG = model("blog",blogSchema); // model name : blog
module.exports = BLOG;  