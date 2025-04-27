# QuickBite
This is a full stack food delivery web application that consists of two main interfaces: a customer-facing frontend and an admin dashboard for restaurant management.

## Application Overview

### Customer Frontend
The frontend is a user-friendly interface where customers can:
- Browse through a variety of food items with images and descriptions
- Add items to their cart
- Place orders and track delivery status
- View their order history
- Manage their profile and delivery addresses

### Admin Dashboard
The admin dashboard provides restaurant management capabilities:
- Manage food items (add, edit, delete)
- View and update order statuses
- Track order history and customer details
- Monitor delivery status
- Manage menu categories and pricing
- View order analytics and reports

Here's a preview of the admin interface showing the food items management and order tracking system:

![Admin Dashboard Preview](./admin/src/assets/Screenshot%202025-04-27%20124754.png)
![Admin Dashboard Preview](./admin/src/assets/Screenshot%202025-04-27%20124815.png)
![Admin Dashboard Preview](./admin/src/assets/Screenshot%202025-04-27%20124903.png)


## Run Locally

Clone the project

```bash
   https://github.com/Kheria1509/QuickBite.git
```
Go to the project directory

```bash
    cd QuickBite

```
Install dependencies (frontend)

```bash
    cd frontend
    npm install
```
Install dependencies (admin)

```bash
    cd admin
    npm install
```
Install dependencies (backend)

```bash
    cd backend
    npm install
```
Setup Environment Vaiables

```Make .env file in "backend" folder and store environment Variables
  JWT_SECRET=YOUR_SECRET_TEXT
  SALT=YOUR_SALT_VALUE
  MONGO_URL=YOUR_DATABASE_URL
  STRIPE_SECRET_KEY=YOUR_KEY
 ```

Setup the Frontend and Backend URL
   - App.jsx in Admin folder
      const url = YOUR_BACKEND_URL
     
  - StoreContext.js in Frontend folder
      const url = YOUR_BACKEND_URL

  - orderController in Backend folder
      const frontend_url = YOUR_FRONTEND_URL 

Start the Backend server

```bash
    nodemon server.js
```

Start the Frontend server

```bash
    npm start
```

Start the Backend server

```bash
    npm start
```
## Tech Stack
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en)
* [Express.js](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com/)
* [Stripe](https://stripe.com/)
* [JWT-Authentication](https://jwt.io/introduction)
* [Multer](https://www.npmjs.com/package/multer)



## Contributing

Contributions are always welcome!
