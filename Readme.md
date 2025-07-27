# WanderLust - Airbnb Clone

A full-stack web application built with Node.js, Express, and EJS that replicates core features of Airbnb. This project demonstrates a solid understanding of server-side rendering, RESTful routing, database management with MongoDB, and MVC architecture.

---

## 📋 Project Status

* **Local Development:** Complete. All CRUD features for listings are fully functional.
* **Deployment:** In Progress. The application has been prepared for deployment.
* **Next Steps:** Deploy as a Web Service on Render and configure environment variables for the live database.

---

## 🌟 Key Features

* **Full CRUD Functionality:** Create, Read, Update, and Delete property listings.
* **Server-Side Validation:** Implemented robust schema validation using Joi to ensure data integrity.
* **RESTful Routing:** Follows best practices for building a clear and maintainable API structure.
* **MVC Architecture:** The code is cleanly separated into Models, Views (EJS templates), and Controllers (routes).

---

## 🛠️ Technologies Used

* **Backend:** Node.js, Express.js
* **Frontend:** EJS (Embedded JavaScript templates), HTML, CSS, Bootstrap
* **Database:** MongoDB with Mongoose
* **Middleware:** `cors`, `method-override`

---

## ⚙️ How to Run Locally

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Ensure MongoDB is running locally.
4.  Create a `.env` file in the root and add your local `MONGO_URI`.
5.  Start the server: `npm start` (or `node app.js`)