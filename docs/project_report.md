# Technical Project Documentation
## AI-Powered Public Health Chatbot for Disease Awareness (Qureon)

---

## 1. Project Overview

### 1.1 Project Title
**Qureon: An AI-Powered Public Health Chatbot for Disease Awareness, Medical Report Analysis, and Emergency Alert Distribution.**

### 1.2 Problem Statement
Access to reliable, understandable, and timely health information is a critical challenge in modern public health. Typical search engines frequently return either overly dense medical jargon or unverified, sensationalized health advice, which leads to confusion, cyberchondria, or self-misdiagnosis. Furthermore, interpreting complex diagnostic medical reports remains a barrier for average patients who must wait days for a doctor's appointment to understand simple blood counts or tumor markers. Lastly, during local disease outbreaks, authorities lack a streamlined, instantaneous tool to disseminate localized alerts and warnings to affected groups directly through accessible channels like WhatsApp and SMS.

### 1.3 Motivation
The COVID-19 pandemic and subsequent localized outbreaks (Dengue, Malaria, Influenza) demonstrated that clear communication saves lives. The motivation behind **Qureon** is to leverage state-of-the-art Large Language Models (LLMs) and accessible Web technologies to bridge the communication gap between complex clinical data and everyday public understanding. By packaging a safe, sandboxed health chatbot, an automated PDF medical report analyzer, and a Twilio-backed alert distribution center into a single, responsive application, Qureon aims to democratize access to basic health literacy.

### 1.4 Objectives
*   **Empathetic Conversational Assistance:** Develop an AI chatbot that answers general health queries, explains symptoms, suggests preventive measures, and handles multilingual queries.
*   **Medical Report Parsing & Explanation:** Implement a secure document parser that extracts text from medical PDFs (with OCR fallbacks for scanned documents) and translates technical terminology into layman's terms.
*   **Role-Based Emergency Notification System:** Create an Alert Center accessible only to administrators, allowing targeted broadcasting of epidemic alerts via SMS and WhatsApp.
*   **Production-Grade User Experience:** Secure the platform using Firebase Authentication (supporting Google OAuth and email recovery) and persist user state across devices.

### 1.5 Scope of the Project
The project encompasses:
*   A responsive Next.js frontend with desktop-grade layouts and mobile-drawer adaptations.
*   An API route interacting with the Sarvam AI Chat Completion API.
*   An OCR-capable parsing utility powered by `pdfjs-dist` and `Tesseract.js`.
*   A Firebase Authentication integration protecting admin routes.
*   An Alert API endpoint linking to Twilio's Messaging services.

The scope is strictly limited to **health awareness and public education**. The chatbot is hard-constrained from diagnosing conditions, prescribing dosages, or replacing professional clinical judgment.

### 1.6 Target Users
1.  **General Public / Patients:** Individuals seeking fast, simple explanations of common symptoms, medical terms, or uploaded diagnostic reports.
2.  **Public Health Administrators:** Authorized community heads or medical officers who need to dispatch immediate local health alerts.

### 1.7 Expected Outcomes
*   Increased health literacy among users via instant, jargon-free explanations.
*   Reduced anxiety when reading complex medical reports.
*   Rapid distribution of disease outbreak alerts to communities.
*   Secure, personalized chat histories preserved across browser sessions.

---

## 2. Problem Analysis

### 2.1 Existing Challenges in Public Health Awareness
*   **Information Overload:** Search engines prioritize ad-revenue and SEO optimization over clinical accuracy, displaying alarming medical diagnoses for common symptoms.
*   **Language Barriers:** Most online health repositories are written in English, excluding non-English speaking regional communities.
*   **Clinical Jargon:** Laboratory test results use abbreviations (e.g., NGAL, CEA, CA-153) and unit metrics that require specialized training to understand.

### 2.2 Limitations of Traditional Awareness Systems
*   **Static Websites:** Static health portals cannot answer customized follow-up questions.
*   **Asynchronous Support:** Traditional health helplines require long hold times or email waiting periods.
*   **One-Way Broadcasting:** Radio, television, and pamphlets reach populations but do not verify receipts or allow immediate clarification queries.

### 2.3 Need for AI-Based Disease Awareness Systems
Interactive AI systems provide natural language dialogue, allowing users to ask follow-up questions to break down complex medical terms. AI can adapt its explanations based on the user's reading level, language, and immediate context, offering a personalized education tool available 24/7.

### 2.4 Real-World Relevance
Integrating AI into public health systems acts as a front-line filter. By answering basic wellness, hygiene, and vaccine questions instantly, it alleviates the caseload on physical triage rooms and outpatient clinics, reserving valuable physician time for critical diagnoses.

---

## 3. System Requirements

### 3.1 Functional Requirements
*   **FR-1: Authentication:** Users must register and log in securely. Google Sign-In and Password Reset flows must be supported.
*   **FR-2: Dynamic Health Chat:** Users must be able to ask health-related questions. Responses must include formatting, medical disclaimers, and refuse off-topic inquiries.
*   **FR-3: Report Analysis:** Users must be able to upload PDF medical reports. The system must extract text (using OCR if necessary) and summarize it automatically.
*   **FR-4: Isolated Session History:** The system must save user chats securely in a remote database, queried by user ID, ensuring privacy across multiple logins and multiple devices.
*   **FR-5: Multilingual Interface:** The application must allow selecting preferred languages via a dropdown, or switch naturally in chat.
*   **FR-6: Admin Outbreak Alerts:** Admin accounts must have access to a dashboard tab to send WhatsApp and SMS alerts using Twilio.

### 3.2 Non-Functional Requirements
*   **NFR-1: Security:** User passwords must be hashed and managed securely by Firebase. API keys must not be exposed on the client side where possible.
*   **NFR-2: Performance:** Message streaming/replies should complete within 3 seconds. OCR processing should run on the client side to minimize server loads.
*   **NFR-3: Usability:** The site must display a high-fidelity glassmorphic UI, compatible with mobile viewports and supporting password visibility toggles.
*   **NFR-4: Availability:** The web app must run reliably on high-uptime serverless platforms (Vercel).

### 3.3 Hardware Requirements
*   **Development environment:** Multi-core CPU (Intel i5 or equivalent), 8GB RAM, stable broadband connection.
*   **Client device:** Any modern smartphone, tablet, or desktop with a web browser (Chrome, Safari, Firefox, Edge).

### 3.4 Software Requirements
*   **Runtime Environment:** Node.js (v18.x or higher).
*   **Framework:** Next.js (v15/16) utilizing App Router.
*   **Database & Auth Provider:** Firebase Authentication Core.
*   **Package Manager:** npm.
*   **Styling:** CSS variables, Tailwind CSS, Lucide icons.

---

## 4. Technology Stack

```
+-----------------------------------------------------------------------+
|                             USER INTERFACE                            |
|             HTML5 / React 19 / TypeScript / Tailwind CSS              |
+------------------------------------+----------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------+
|                            APPLICATION LAYER                          |
|                       Next.js App Router (Vercel)                     |
+------------------------------------+----------------------------------+
                                     |
                +--------------------+--------------------+
                |                                         |
                v                                         v
+-------------------------------+         +-----------------------------+
|        DATABASE & AUTH        |         |        EXTERNAL SERVICES    |
|     Firebase Auth Client      |         |   - Sarvam AI Chat API      |
|     Cloud Firestore DB        |         |   - Twilio SMS/WA API       |
+-------------------------------+         +-----------------------------+
```

### 4.1 Next.js & TypeScript
*   **Role:** Core application framework and backend API router.
*   **Why Chosen:** Next.js enables seamless Server-Side Rendering (SSR) and API routing under a unified directory. TypeScript introduces strong typing, eliminating runtime errors.
*   **Alternatives:** Python/Streamlit.
*   **Why Rejected:** Streamlit is excellent for basic scripts but lacks robust component-based customization, routing controls, custom authentication state changes, and production-grade responsive UI frameworks.

### 4.2 Firebase Authentication
*   **Role:** User validation, session tokens, and admin authorization.
*   **Why Chosen:** Offloads encryption, password resets, and Google OAuth compliance to a secure provider.
*   **Alternatives:** Auth0 or Custom database auth.
*   **Why Rejected:** Auth0 adds billing complexity; custom DB auth poses security vulnerabilities (hashing, CSRF tokens) that increase developmental overhead.

### 4.3 Sarvam AI API
*   **Role:** Generates conversational responses and translates messages.
*   **Why Chosen:** Sarvam AI models are optimized specifically for Indian languages (Hindi, Tamil, Telugu, etc.), providing accurate regional vocabulary translation.
*   **Alternatives:** OpenAI GPT-4o.
*   **Why Rejected:** GPT models often struggle with colloquial phrasing in regional dialects, and their API costs are significantly higher for multi-lingual tasks.

### 4.4 Twilio API
*   **Role:** Sends emergency SMS alerts and WhatsApp sandbox messages.
*   **Why Chosen:** Twilio is the industry standard for telephony APIs, featuring high deliverability and easy webhook integration.
*   **Alternatives:** Vonage / MessageBird.
*   **Why Rejected:** Vonage has restricted sandbox options and limited developer documentation for Indian regional carrier routing.

---

## 5. System Architecture

```
User (Browser) 
  --> Interacts with React Components (ChatTab, ReportTab, AlertTab)
  --> Firestore stores user-isolated chat sessions
  --> Firebase Auth manages login tokens
  --> Serverless Next.js API Routes:
       |--> /api/chat   --> Checks API key --> Sarvam AI completions API
       |--> /api/twilio --> Sends alert payload --> Twilio API Gateway
```

### 5.1 End-to-End Workflow
1.  **Authentication:** The user logs in via Firebase. The page loads the unique `user.uid`.
2.  **Chat Session Loading:** The app listens to Firestore collection updates matching the `userId` via `onSnapshot` and renders the user's history in real-time.
3.  **Prompt Dispatch:** The user types a query or selects a dropdown language. The React state compiles the message array.
4.  **Backend Processing:** Next.js `/api/chat` receives the message array, applies the system restrictions, calls Sarvam AI, cleanses reasoning tokens, and returns the response.
5.  **Output Display:** The client renders markdown, updating history records in real-time.

---

## 6. Detailed Module Description

### Module 1: User Interface
Renders the landing page, glassmorphic login screen, dashboard panel, and responsive sidebar. Displays dynamic state markers (e.g., active tabs, password visibility, admin indicators).

### Module 2: Query Processing
Manages input cleaning, character bounds, speech-to-text transcriptions, and API payloads. Prepares conversation arrays to ensure the model retains conversation context without exceeding memory buffers.

### Module 3: Prompt Engineering Layer
Appends strict structural constraints to all API queries, enforcing the boundaries of medical disclaimers, scope limits, and off-topic refusals.

### Module 4: AI Response Generation
Communicates with the LLM API, parses response payloads, cleanses raw output (such as removing `<think>` tags), and formats text into readable Markdown lists.

### Module 5: Disease Awareness Knowledge Handling
Parses uploaded diagnostic reports. Uses `pdfjs-dist` to extract structured digital text, falling back to client-side OCR (`Tesseract.js`) when processing flat image-based PDFs.

### Module 6: Multilingual Support
Handles language detection and switching. Syncs user selected languages from the UI dropdown or chat triggers, translating system payloads before forwarding them to the LLM.

### Module 7: WhatsApp & SMS Integration
Formulates outbound Twilio payloads using custom variables and pre-approved templates. Logs delivery reports directly to the administration console.

### Module 8: Deployment Module
Controls configurations, handles environment variables (`.env.local` vs. Vercel System Env), and manages Vercel build pipelines.

---

## 7. Implementation Details

### 7.1 Folder Structure
```
web-app/
├── public/                 # Static assets (logos, icons)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts  # Sarvam AI Integration endpoint
│   │   │   └── twilio/
│   │   │       └── route.ts  # Twilio messaging dispatch endpoint
│   │   ├── layout.tsx
│   │   └── page.tsx        # View coordinator & auth observer
│   ├── components/
│   │   ├── tabs/
│   │   │   ├── AlertTab.tsx  # Admin Broadcast Controller
│   │   │   ├── ChatTab.tsx   # Conversational layout & Speech input
│   │   │   └── ReportTab.tsx # PDF / OCR Report extractor
│   │   ├── AuthScreen.tsx  # Register, Login & Password Reset forms
│   │   ├── Dashboard.tsx   # Main Workspace & state manager
│   │   ├── Sidebar.tsx     # Session switcher & Language selector
│   │   └── ParticleBackground.tsx # High-fidelity background visuals
│   └── lib/
│       ├── adminConfig.ts  # Whitelist definition of admins
│       ├── firebase.ts     # Firebase initialization script
│       └── constants.ts    # System constants & templates
├── package.json
└── tsconfig.json
```

### 7.2 Main Code Workflow: `/src/components/tabs/ChatTab.tsx`
```typescript
const handleSendMessage = async (text: string = input) => {
  if (!text.trim() || !apiKey) return;

  const detectedLang = detectLanguageSwitch(text);
  const activeLang = detectedLang || currentLanguage || dropdownLanguage;
  if (detectedLang) {
    setCurrentLanguage(detectedLang);
  }

  const newMessages = [...messages, { role: 'user', content: text }];
  const workingSessionId = updateSessionMessages(newMessages, activeSessionId);
  setInput('');
  setLoading(true);

  try {
    let apiMessages = newMessages.slice(-19); // Context window constraint
    
    // Inject priority language instructions
    const langOverride = activeLang
      ? [
          { role: 'user', content: `[SYSTEM LANGUAGE OVERRIDE: You MUST respond ONLY in ${activeLang}...]` },
          { role: 'assistant', content: `Understood. I will now respond only in ${activeLang}.` }
        ]
      : [];

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...langOverride, ...apiMessages], apiKey })
    });
    // Update session message states...
  } catch(err) { /* Error Handling */ }
};
```

---

## 8. Prompt Engineering

Prompt engineering is the core safety shield of Qureon. The system prompt is prepended to every message array sent to the API.

### 8.1 System Prompt Design
*   **Identity:** "You are Qureon, an AI-powered health intelligence assistant designed strictly for disease awareness and health education."
*   **Scope Restriction:** "You must ONLY answer queries related to health, diseases, infections, outbreaks, hygiene, and preventive care. If a user asks anything outside this scope, respond EXACTLY with: 'I'm Qureon, designed to provide information only about health, diseases, and public health awareness. Please ask a relevant health-related question.'"
*   **Clinical Safety Constraints:**
    1.  Do NOT diagnose conditions.
    2.  Do NOT prescribe medications or specify dosages.
    3.  Suggest medical consulting for complex, symptomatic inquiries.
    4.  Recommend immediate emergency care for high-risk flags (e.g. chest pains).

---

## 9. Multilingual System

### 9.1 The Language Memory Challenge
When a conversation context grows, LLMs tend to match the patterns of previous dialogue turns. If a user previously asked a question in Tamil and now says *"tell the same in English"*, the LLM frequently responds with Tamil explanations about why it should speak English. 

### 9.2 Client-Side Solution
Qureon overcomes this by using a dual-detection mechanism:
1.  **Dropdown Selector:** Directly sets `dropdownLanguage` in React state.
2.  **Regex Matcher:** Parses input patterns (e.g., *"reply in hindi"*, *"telugu"*).
3.  **Active Override Injection:** Before sending history to the API, the client prepends a system instruction:
    `[SYSTEM LANGUAGE OVERRIDE: You MUST respond ONLY in {activeLang}...]`
    followed by a mocked assertion from the assistant:
    `Understood. I will now respond only in {activeLang}.`
This forces the model to ignore historical language patterns.

---

## 10. Twilio WhatsApp Integration

```
Admin Dashboard (AlertTab)
  --> Pre-configures Recipients List (One per line)
  --> Dispatches JSON to Next.js API Route (/api/twilio)
       |--> Generates payload (MessageBody, To, From)
       |--> Calls Twilio Gateway API
             |--> Delivers SMS / WhatsApp alerts
```

### 10.1 Sandbox Setup
*   **Sandbox Sender:** `whatsapp:+14155238886`
*   **Authentication:** Requires recipient verification during sandbox development. Recipient numbers must text the sandbox keyword (e.g., `join lucky-mountain`) to opt-in before receiving any automated broadcasts.

### 10.2 API Implementation: `/src/app/api/twilio/route.ts`
The route handles standard SMS delivery as well as free-form WhatsApp alerts:
```typescript
const client = twilio(accountSid, authToken);
const fromNumber = channel === 'SMS' ? customSmsFrom : 'whatsapp:+14155238886';
// For each number in the array:
const msg = await client.messages.create({
  body: messageBody,
  from: fromNumber,
  to: formattedNumber,
});
```

---

## 11. Deployment

### 11.1 Vercel Hosting
The platform is deployed globally via Vercel. 
*   **Build command:** `npm run build` (triggering Next.js Turbopack compiler check).
*   **Deployments:** Pushes to the `main` branch trigger automated integration runs and updates.

### 11.2 Environment Variables
Sensitive keys are injected through the hosting provider's panel:
*   `NEXT_PUBLIC_SARVAM_API_KEY`: API authentication key.
*   `NEXT_PUBLIC_TWILIO_ACCOUNT_SID`: Twilio administrative identifier.
*   `NEXT_PUBLIC_TWILIO_AUTH_TOKEN`: Twilio API call credentials.

---

## 12. Challenges Faced & Solutions Implemented

### 12.1 Language Sticking
*   **Root Cause:** Context pattern-matching of LLMs.
*   **Final Solution:** Client-side mock injection of system overrides.

### 12.2 PDF Extraction Failures
*   **Root Cause:** Flat scanned images in PDF files lack text data.
*   **Final Solution:** Integrated client-side OCR using `Tesseract.js` as an automatic fallback when initial text extraction yields empty arrays.

### 12.3 Multi-user Session Leakage & Synchronization
*   **Root Cause:** Universal local keys shared across logins, and inability to view chats across different devices.
*   **Final Solution:** Migrated from local storage to Firebase Cloud Firestore. Implemented server-side user-isolation where sessions are queried strictly matching the authenticated Firebase `userId` via real-time `onSnapshot` listeners.

---

## 13. Testing and Validation

| Test Case | Inputs | Expected Output | Status |
|---|---|---|---|
| TC-01: Off-scope query | "Write a python script" | "I'm Qureon, designed to provide information only about health..." | PASS |
| TC-02: Prescription request | "Suggest medicine for fever" | Explains general home care but explicitly refuses to suggest drugs | PASS |
| TC-03: Language Switch | "Now tell me in Hindi" | Translates the previous response into Hindi instantly | PASS |
| TC-04: Non-Admin Tab Lock | Login with regular user email | "Alert Center" tab is hidden; direct URL navigation blocked | PASS |
| TC-05: PDF OCR fallback | Scanned report PDF file | Extracted text displayed in textbox, sent to chat for summary | PASS |

---

## 14. Future Enhancements
*   **Voice Integration:** Real-time speech-to-speech engine using local languages.
*   **Direct E-Consulting:** Automatically link patients to nearby specialists based on report analysis flags.
*   **Offline Support:** Native mobile apps offering cached local first-aid guidelines.

---

## 15. Learning Outcomes
*   **Fullstack Architecture:** Deepened expertise in React state lifecycles and Serverless endpoint configurations.
*   **AI Safety Enforcement:** Learned techniques in guardrail programming and system prompting.
*   **Mobile Adaptability:** Experienced design strategies for responsive layouts.

---

## 16. References
1.  Next.js Documentation. [https://nextjs.org/docs](https://nextjs.org/docs)
2.  Firebase Authentication. [https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
3.  Sarvam AI Developer Docs. [https://docs.sarvam.ai](https://docs.sarvam.ai)
4.  Twilio Developer Documentation. [https://www.twilio.com/docs](https://www.twilio.com/docs)
5.  Tesseract.js OCR engine. [https://github.com/naptha/tesseract.js](https://github.com/naptha/tesseract.js)
