# HelpCamp
HelpCamp is a full-stack web application that enables users to create, view, and review campgrounds. Designed as an interactive platform for outdoor enthusiasts (camping/hiking), this project allows registered users to share their favorite campgrounds with others by adding new campground entries and reviewing existing ones, with authentication and authorization ensuring only authorized users can modify content. This project is part of Colt Steele’s Web Development Bootcamp on Udemy, where it serves as a practical application of full-stack web development skills (MERN). Musiab/Me has contributed to this project by implementing a review system with fake review detection using a library NLP natural which enforces that the reviews on each campgrounds are authentic and are not degrading the image of the campground, hence ensuring credibility and authenticity of the ratings on each campground.

#Key Features
 User Authentication and Authorization
  - Registration and Login: Secure account creation, login, and logout features using Passport.js with the local strategy. 
  - Protected Routes and Role-Based Access: Authorization restricts actions like editing and deleting campgrounds or reviews to the respective creators.
