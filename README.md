# Public Health Chatbot (Next.js Migration)

A modern, full-stack Next.js application migrated from Streamlit. It provides AI-powered health chat, OCR medical report analysis, and a Twilio-powered alert system (WhatsApp & SMS) for public health emergencies.

## Features Preserved from Streamlit:
- 💬 **Health Chat:** Interacts with the Sarvam AI API for answering health queries.
- 📄 **Medical Report Analysis:** Uses Tesseract.js (Images) and PDF.js (PDFs) to extract text and analyze it using the Chat AI.
- 🚨 **Alert Center:** Sends WhatsApp templates/freeform messages and SMS via Twilio to bulk recipients.
- 🔐 **Authentication:** Email/Password + Google Login via Firebase.

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend:** Next.js API Routes (Node.js).
- **Authentication:** Firebase Auth.
- **APIs:** Sarvam AI, Twilio SDK.

## Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   cd web-app
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and add your keys:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Firebase config is strictly required for Auth to work.*

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser.

## Deployment
This app is ready to be deployed on **Vercel**:
1. Push the code to GitHub.
2. Import the project in Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_FIREBASE_*`).
4. Click Deploy.
