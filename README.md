# 📝 Blogify - A Modern Blogging Platform

A full-stack blogging platform built with Node.js, Express, MongoDB, and EJS. Users can create, read, edit, and comment on blog posts with secure authentication.

## ✨ Features

- **User Authentication**
  - Secure signup/signin with JWT tokens
  - Password hashing using crypto
  - Session management with cookies
  - Role-based access (User/Admin)

- **Blog Management**
  - Create new blog posts with cover images
  - Edit your own blog posts
  - View all blogs on home page
  - Individual blog detail pages
  - Author information display

- **Comment System**
  - Add comments to blog posts
  - View all comments with timestamps
  - Author profile images in comments
  - Collapsible comments section

- **User Profiles**
  - Personal profile page
  - View your published blogs
  - Track your comments
  - Profile statistics

- **File Upload**
  - Image upload for blog covers
  - File type validation (JPEG, PNG, GIF, WebP)
  - File size limits (5MB max)
  - Organized user-specific directories

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Templating**: EJS (Embedded JavaScript)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Styling**: Bootstrap 5
- **Environment**: dotenv

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BlogSite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   JWT_SECRET=your_secret_key_here
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/blogifyDB
   ```

4. **Create uploads directory** (if not exists)
   ```bash
   mkdir -p public/uploads
   ```

5. **Run the application**
   
   Development mode (with nodemon):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000

## 🔒 Security Features

- Password hashing with salt using Node.js crypto
- JWT token-based authentication
- HTTP-only cookies for token storage
- Environment variable protection
- File upload validation and size limits
- Input validation middleware
- Route protection middleware

## 📝 API Routes

### User Routes (`/user`)
- `GET /signin` - Show login page
- `POST /signin` - Authenticate user
- `GET /signup` - Show registration page
- `POST /signup` - Register new user
- `GET /logout` - Logout user

### Blog Routes (`/blog`)
- `GET /add` - Show create blog form (auth required)
- `POST /` - Create new blog (auth required)
- `GET /:id` - View blog details
- `GET /:id/edit` - Show edit blog form (auth required)
- `POST /:id/edit` - Update blog (auth required)
- `GET /profile` - View user profile (auth required)
- `POST /:id/comment` - Add comment to blog (auth required)

### Home Route
- `GET /` - Homepage with all blogs

## 🎨 Default Images

Make sure to add these default avatar images in `public/images/`:
- `male-avatar.svg` - Default male profile picture
- `female-avatar.svg` - Default female profile picture

## 🧪 Testing

To test the application:

1. Register a new account
2. Login with your credentials
3. Create a blog post with an image
4. View your profile
5. Edit your blog post
6. Add comments to blogs
7. Test logout functionality

## 📦 Dependencies

```json
{
  "cookie-parser": "^1.4.7",
  "dotenv": "^17.2.3",
  "ejs": "^4.0.1",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.1.5",
  "multer": "^2.0.2"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Kapil Kor - kapilkor234@gmail.com

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- MongoDB for the database
- Express.js community for excellent documentation
- All contributors who help improve this project

---

**Happy Blogging! 📝✨**
