const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    content:{
        type: String,
        required:true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    blog_id:{
        type:Schema.Types.ObjectId,
        ref:'blog',
        required:true,
    }
},{timestamps:true});


const COMMENT = model("comment",commentSchema); // model name : comment
module.exports = COMMENT;  