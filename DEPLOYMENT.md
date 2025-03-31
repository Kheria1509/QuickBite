# QuickBite Deployment Guide

This document outlines the steps needed to deploy the QuickBite application on Vercel.

## Project Structure

The QuickBite application consists of three separate components:

1. **Frontend** - Customer-facing React application
2. **Admin** - Administration panel React application
3. **Backend** - Express.js API server

Each component will be deployed as a separate project on Vercel.

## Prerequisites

1. A Vercel account
2. MongoDB Atlas account (for the database)
3. Stripe account (for payment processing)
4. Node.js and npm installed locally

## Setup Environment Variables

### Backend Environment Variables

In the Vercel project settings for the backend, add the following environment variables:

- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `MONGODB_URL` - MongoDB connection string
- `NODE_ENV` - Set to "production" for deployment
- `SALT` - Salt rounds for password hashing (e.g., 10)

### Frontend & Admin Environment Variables

In the Vercel project settings for both the frontend and admin panel, add:

- `VITE_API_URL` - URL of your deployed backend API (e.g., https://quickbite-backend.vercel.app)

## Deployment Steps

### Backend Deployment

1. From the Vercel dashboard, click "Add New" → "Project"
2. Import the backend directory from your Git repository
3. Configure the project:
   - Build Command: `npm run build`
   - Output Directory: Leave empty
   - Install Command: `npm install`
4. Add the environment variables mentioned above
5. Deploy

### Frontend Deployment

1. From the Vercel dashboard, click "Add New" → "Project"
2. Import the frontend directory from your Git repository
3. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add the required environment variables
5. Deploy

### Admin Panel Deployment

1. Follow the same steps as the frontend deployment, but import the admin directory instead

## Post-Deployment Checklist

1. Test user authentication flows
2. Verify image uploads are working
3. Test order placement and checkout with Stripe
4. Ensure admin panel can access and modify data
5. Check that CORS is properly configured to allow all three applications to communicate

## Handling Static Files

The backend is configured to serve uploaded images from the `/images` route. In a production environment, consider using a cloud storage service like AWS S3 for storing and serving user-uploaded files.

## Troubleshooting

### CORS Issues

If you encounter CORS errors:
1. Verify that the backend's allowed origins include your frontend and admin URLs
2. Check that credentials are properly enabled in both frontend and backend

### Database Connection

If the application can't connect to MongoDB:
1. Verify the connection string is correct
2. Ensure your MongoDB Atlas cluster is properly configured to accept connections from Vercel

### Stripe Integration

If payment processing fails:
1. Check that the Stripe secret key is correctly set
2. Verify that the Stripe configuration is properly imported in the orderController

## Monitoring

Once deployed, monitor your application's performance and errors through:
- Vercel's built-in analytics
- MongoDB Atlas monitoring tools
- Application logs (accessible through Vercel dashboard) 