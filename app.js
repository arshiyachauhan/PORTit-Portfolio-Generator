const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require("mongoose");
const Register = require("./models/register");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Folder to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Generate unique filename
    }
});
const upload = multer({ storage: storage });

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle form submission
app.post('/generate', upload.single('profilePhoto'), (req, res) => {
    const formData = req.body;
    const username = formData.username;
    const profilePhoto = req.file ? req.file.filename : 'default.jpg';
    const portfolioHTML = generatePortfolioHTML(formData, profilePhoto);
    const portfolioFileName = `${username}.html`;

    // Write the portfolio HTML to a file
    fs.writeFile(portfolioFileName, portfolioHTML, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error generating portfolio');
        } else {
            res.redirect(`/${portfolioFileName}`);
        }
    });
});

app.get('/:username', (req, res) => {
    const username = req.params.username;
    const portfolioFileName = `${username}`;

    res.sendFile(path.join(__dirname, portfolioFileName), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error loading portfolio');
        }
    });
});

// Function to generate the portfolio HTML based on form data
function generatePortfolioHTML(formData, profilePhoto) {
    const {
        username,
        about,
        education,
        skills,
        project,
        background,
        address,
        emailaddress,
        phone,
        github,
        medium,
        twitter,
    } = formData;

    const educationArray = education.split(',').map(edu => `<li>${edu.trim()}</li>`).join('');
    const skillsArray = skills.split(',').map(skill => `<li>${skill.trim()}</li>`).join('');
    const projectArray = project.split(',').map(proj => `<li>${proj.trim()}</li>`).join('');

    const profilePhotoPath = profilePhoto !== 'default.jpg' ? `uploads/${profilePhoto}` : `uploads/${profilePhoto}`;

    return `<!DOCTYPE html>
    <html lang="en-gb">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title>Portfolio</title>
      <!-- Bootstrap CSS -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      <!-- Google Fonts -->
      <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet">
      <style>
        /* Global Styles */
        body {
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(to right, #9abaf3, #f8ade4);
          animation: changeBackground 10s infinite alternate;
        }
        @keyframes changeBackground {
          0% {
            background: linear-gradient(to right, #c5c6df, #a5a8e1);
          }
          50% {
            background: linear-gradient(to right, #e3a0d6, #78beed);
          }
          100% {
            background: linear-gradient(to right, #ee94ac, #8f94fb);
          }
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
        }
        /* Navbar Styles */
        .navbar {
          background-color: #280445;
        }
        .navbar-nav .nav-link {
          color: #ecabeb;
        }
        .navbar-nav .nav-link:hover {
          color: #cb3636;
        }
        .navbar-toggler {
          border-color: #e4d3e2;
        }
        .navbar-toggler-icon {
          background-color: #fff;
        }
        .navbar-brand {
          color: #f28cd7;
        }
        .navbar-brand:hover {
          color: #efe4e4;
        }
        /* Section Styles */
        .section-heading {
          color: #000000;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
          font-size: 2rem;
        }
        .section-heading-small {
          font-size: 1.2rem;
        }
        /* Card Styles */
        .card {
          border: none;
          border-radius: 20px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        }
        .card-body {
          padding: 20px;
        }
        .card-title {
          font-size: 1.2rem;
        }
        .card-text {
          font-size: 1rem;
        }
        /* Container Styles */
        .container {
          margin-top: 20px;
        }
        /* Profile Photo */
        .profile-photo-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 320px;
          width: 320px;
          overflow: hidden;
          border-radius: 50%;
        }
        .profile-photo-container img {
            align-items: center;
          width: 100%;
          height: auto;
          border-radius: 10%;
        }
      </style>
    </head>
    <body>
      <!-- Navigation bar -->
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container">
          <a class="navbar-brand" href="#">Portfolio</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href="#aboutme">About Me</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#skills">Skills</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#projects">Projects</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#contact">Contact Me</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="container">
        <!-- About Me -->
        <section id="aboutme">
          <h2 class="section-heading">About me</h2>
          <div class="row">
            <div class="col-lg-6">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">${username}</h5>
                  <p class="card-text">${about}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card mb-3">
                <div class="card-body">
                  <div class="profile-photo-container">
                    <img src="${profilePhotoPath}" alt="Profile Photo">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Education -->
        <section id="education">
          <h2 class="section-heading">Education</h2>
          <div class="row">
            <div class="col-lg-12">
              <div class="card mb-3">
                <div class="card-body">
                  <ul>
                    ${educationArray}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Skills -->
        <section id="skills">
          <h2 class="section-heading">Skills</h2>
          <div class="row">
            <div class="col-lg-12">
              <div class="card mb-3">
                <div class="card-body">
                  <ul>
                    ${skillsArray}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Projects -->
        <section id="projects">
          <h2 class="section-heading">Projects</h2>
          <div class="row">
            <div class="col-lg-12">
              <div class="card mb-3">
                <div class="card-body">
                  <ul>
                    ${projectArray}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Contact Me -->
        <section id="contact">
          <h2 class="section-heading">Contact Me</h2>
          <div class="row">
            <div class="col-lg-4">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">Address</h5>
                  <p class="card-text">${address}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">Email</h5>
                  <p class="card-text">${emailaddress}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">Phone</h5>
                  <p class="card-text">${phone}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">GitHub</h5>
                  <p class="card-text">${github}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">Medium</h5>
                  <p class="card-text">${medium}</p>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="card mb-3">
                <div class="card-body">
                  <h5 class="card-title">Twitter</h5>
                  <p class="card-text">${twitter}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <!-- Bootstrap JS -->
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    </body>
    </html>    
`;
}

// Route for serving index.html (login page)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route for serving home.html (homepage)
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});

// Register user
app.post("/register", async (req, res) => {
    try {
        const registerUser = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        });
        const registered = await registerUser.save();
        res.redirect('/home.html');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login user
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await Register.findOne({ email: email });

        if (!user) {
            // If user does not exist, redirect with error message
            return res.redirect('/login?error=Invalid email');
        }

        if (user.password !== password) {
            // If password does not match, redirect with error message
            return res.redirect('/login?error=Password does not match');
        }

        // If login successful, redirect to the homepage
        res.redirect('/home.html');
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
