# VoiceBite: Elite AI-Powered Voice Ordering Concierge

VoiceBite is a next-generation food ordering application that transforms the traditional menu browsing experience into a proactive, conversational journey. Powered by Gemini, the application acts as a digital sales agent that understands intent, reasons through subjective requests, and handles the complete checkout life-cycle via natural language.

---

## 🚀 Key Features

- **Semantic Intent Recognition**: The AI understands natural speech, filtering out filler words and identifying core actions.
- **Elite AI Concierge Persona**: 
  - **Subjective Intelligence**: Understands "something light", "something heavy", or "thirsty".
  - **The "Yes" Policy**: Proactively suggests alternatives if an item is out of stock.
  - **Guided Help**: If a command is misunderstood, the agent politely guides the user on what to ask.
- **Automated Workflow**: 
  - Voice-activated "Add to Cart".
  - One-tap category filtering and search.
  - Full voice checkout and simulated payment processing.
- **Dynamic Offer Integration**: Automatically highlights items with discounts when asked for "deals".

---

## 🛠️ Technology Stack

### Backend & AI Engine
- **Node.js & Express**: Core API infrastructure and route management.
- **Python 3.10+**: Used for AI research, prompt engineering, and data analysis.
- **Google Generative AI**: SDKs for both Node.js (`@google/generative-ai`) and Python (`google-generativeai`).
- **Jupyter & Pandas**: Utilized for testing model outputs and analyzing menu datasets.
- **MongoDB & Mongoose**: Database for menu and orders.

### Frontend
- **React (Vite)**: Modern component-based UI.
- **React Context API**: Global state management for handling the shopping cart and user sessions.
- **Axios**: Promised-based HTTP client for seamless API communication with the backend.
- **Lucide React**: Vector icons for a premium UI feel.
- **React Hot Toast**: Real-time feedback for AI actions and order processing.

---

## ⚙️ Environment Setup

### 1. Prerequisites
- **Node.js** (v16+)
- **Python** (v3.10+) for AI research scripts.
- **MongoDB** running on `localhost`.
- **Gemini API Key** from Google AI Studio.

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_key_here
MONGODB_URI=mongodb://127.0.0.1:27017/voicebite
PORT=5000
```

### 3. VoiceBite AI Environment (Python)
To set up the AI research and prototyping environment:

```bash
cd backend/research
python -m venv voicebite_env
# On Windows:
.\voicebite_env\Scripts\activate
# On macOS/Linux:
source voicebite_env/bin/activate

pip install -r requirements.txt
```

### 4. Application Installation
Open two terminals to run both components:

**Terminal 1: Backend**
```bash
cd backend
npm install
npm start
```

**Terminal 2: Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🗃️ Database Initialization

To populate the menu with the Elite Concierge's categories (Pizza, Pasta, Traditionals, Desserts, Beverages) and current offers, run the seed script:

```bash
cd backend
node seed.js
```

---

## 🎙️ AI Agent Handbook (How to Interact)

Try speaking these natural phrases to the VoiceBite Assistant:

| Intent | Example Phrase |
| :--- | :--- |
| **Discovery** | "What is there to eat?" or "What's for dinner?" |
| **Filtered Search** | "I'm thirsty" or "Show me something light." |
| **Deals** | "Do you have any discounts today?" |
| **Cart Action** | "Add a Margherita Pizza to my bucket." |
| **Checkout** | "Open my cart" or "I'm ready to pay." |
| **Finalize** | "Process my payment" or "Place the order." |

---

## 👨‍💻 Hackathon Mode

Developed with a focus on **proactive salesmanship** and **user guidance**, ensuring that no voice command ever leads to a dead end. VoiceBite isn't just an app; it's your personal waiter.
