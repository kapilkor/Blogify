const {Schema, model} = require('mongoose');
const {createHmac,randomBytes} = require('crypto');
const { generateToken} = require ('../utils/auth.js')

const userSchema = new Schema({
    fullname:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required:true,
    },
    gender:{
        type: String,
        enum:['male','female'],
        default:'male'
    },
    profileImage:{
        type: String,
        default: function() {
            return this.gender === 'female' ? '/images/female-avtar.svg' : '/images/male-avatar.svg';
        }
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }

},{timestamps:true})

userSchema.pre("save", async function () {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;
});

userSchema.static('ismatchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const hashedPasswordUserProvide = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    
    if(hashedPasswordUserProvide !== hashedPassword){
        throw new Error("Invalid password");
    }
    
    const token = generateToken(user);
    return token;
});


const USER = model("user",userSchema);

module.exports = USER;  
