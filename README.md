# HelpCamp
HelpCamp is a full-stack web application that enables users to create, view, and review campgrounds. Designed as an interactive platform for outdoor enthusiasts (camping/hiking), this project allows registered users to share their favorite campgrounds with others by adding new campground entries and reviewing existing ones, with authentication and authorization ensuring only authorized users can modify content. This project is part of Colt Steele’s Web Development Bootcamp on Udemy, where it serves as a practical application of full-stack web development skills (MERN). Musiab/Me has contributed to this project by implementing a review system with fake review detection using a library NLP natural which enforces that the reviews on each campgrounds are authentic and are not degrading the image of the campground, hence ensuring credibility and authenticity of the ratings on each campground and also implemented helmet which is an NPM library for handling common security issues.

# Key Features
 User Authentication and Authorization
  - Registration and Login: Secure account creation, login, and logout features using Passport.js with the local strategy. 
  - Protected Routes and Role-Based Access: Authorization restricts actions like editing and deleting campgrounds or reviews to the respective creators.
    
 Campground Creation and Management
  - Users can create new campground entries with details like name, image, location, and description.
  - Cloud-based image storage with Cloudinary (integrated via Multer) allows users to upload campground images.
  - Campgrounds feature interactive maps integrated through MapTiler Cloud to help users locate them and also displays map clusters indicating the number of campgrounds in a particular location.

 Review System with Fake Review Detection
  - Logged-in users can leave reviews that include text and star ratings.
  - A fake review detection feature, powered by the Natural language processing library Natural, flags overly positive or negative reviews. The sentiment is rated on a scale from -5 to 5, where reviews scoring >3 are flagged as very
    positive and those scoring <-3 as very negative. In natural, the sentiment score is specifically polarity it measures the positivity or negativity of the text. It’s derived from an underlying lexicon (like the AFINN lexicon), which
    assigns sentiment values to words based on their positive or negative emotional weight. 

 Geocoding using maptiler
  - Provides maps with many navigation and control    
    features to locate the campground. When a user          enters a location while creating a campground it is geocoded and the respective location is displayed in the map

 Responsive Design
  - Built with Bootstrap to ensure a mobile-friendly design, making it accessible across devices.

# Technologies Used
 Backend:
  - Node.js and Express.js for server-side logic and routing.
  - MongoDB as the database, managed with Mongoose ODM.
 
 Frontend:
  - EJS templating for dynamic HTML.
  - Bootstrap for responsive, consistent styling.
  
Additional Integrations:
  - Passport.js (local strategy) for secure user authentication.
  - Cloudinary for cloud storage of images, integrated with Multer for handling file uploads.
  - MapTiler Cloud for interactive map integration.
  - Natural library for fake review detection based on sentiment.
  - Helmet for handling common web security issue like XSS, mongo injection etc.

# Installation
 Clone this repo
 Make account on cloudinary, maptiler and add you api keys, cloud name and secret in the .env file.
 Navigate to the Project Directory: Open a terminal and go to the directory where your package.json file is located:
 cd /path/to/your/project
 Run npm install: This command will read the package.json file and install all dependencies listed under "dependencies".
 npm install
 Run the server using nodemon app.js (install nodemon globally first) on localhost.
