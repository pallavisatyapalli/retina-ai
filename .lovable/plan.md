

# Diabetic Retinopathy Detection — Frontend App

## Overview
A modern, professional React web application for early detection of diabetic retinopathy from fundus images. The app provides image upload, analysis results display, and user authentication — designed to connect to your separately hosted Flask/ML backend API.

> **Note:** The ML model (Xception) and Flask backend must be hosted separately (e.g., Render, Railway, AWS). This app will be the frontend that communicates with that API.

## Pages & Features

### 1. Landing Page
- Hero section explaining the purpose: early detection of diabetic retinopathy using deep learning
- How it works section (upload → analyze → results)
- Call-to-action buttons to register or upload an image

### 2. Register & Login Pages
- Registration form (name, email, password)
- Login form (email, password)
- Form validation with error feedback
- Auth state management (stored in local state/localStorage for now — can integrate with Supabase later)

### 3. Image Upload & Prediction Page (core feature)
- Drag-and-drop or click-to-upload fundus image interface
- Image preview before submission
- "Analyze" button that sends the image to your Flask API endpoint (configurable URL)
- Loading state with spinner during analysis
- Results display showing:
  - Prediction result (e.g., "Diabetic Retinopathy Detected" / "No Diabetic Retinopathy")
  - Confidence score
  - Uploaded image alongside the result

### 4. Dashboard / History (optional stretch)
- List of previous analyses with timestamps and results
- Stored in localStorage (or Supabase if connected later)

### 5. Logout
- Clear session and redirect to login

## Design
- Clean, medical/healthcare-inspired design with a blue/teal color palette
- Professional and trustworthy look appropriate for a health-related application
- Fully responsive (mobile + desktop)

## API Integration Setup
- Configurable API base URL so you can point it to your Flask backend
- Ready-made API service functions for `/predict` endpoint
- Example of expected request/response format documented in code comments

