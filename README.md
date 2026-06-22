# India Post Decision Support System (DSS) — AI-Enabled Financial Service Promotion

A modern, data-driven planning and decision-support platform designed to boost financial inclusion and optimize target scheme promotions at micro-local levels (State, District, Sub-Post Office, Branch Post Office, and Village) for the Department of Posts.

---

## 🌟 Key Capabilities

### 1. Regional Demographic Intelligence
*   **Micro-Local Mapping:** Detailed population distributions, household density, gender balance, and workforce classification down to the village level.
*   **Census-Grounded Metrics:** Visualization of literacy rates, agricultural vs. salaried workforce distribution, and youth/senior cohorts.
*   **Dynamic Visualizations:** Interactive charts (Recharts & ApexCharts) for comparing demographic splits and analyzing local trends.

### 2. Deterministic Suitability Recommender
*   **Opportunity Index Scoring:** Computes a suitability score (0-100) for each village based on local demographic characteristics.
*   **Diversified Scheme Support:** Supports traditional Post Office Savings Bank (POSB) products (e.g., SB, RD, TD, MIS, PPF, SCSS, SSA, NSC, KVP, MSSC), India Post Payments Bank (IPPB) accounts, and third-party social security schemes (PMJJBY, PMSBY, APY).
*   **Evidence-Backed Reasoning:** Traces recommendations to specific local drivers (e.g., high female literacy gap recommending Sukanya Samriddhi Account).

### 3. Campaign & Event Calendar
*   **Outreach Coordinator:** Plan and track financial promotion events (Melas) directly on an interactive calendar.
*   **Agricultural Alignment:** Matches campaign timelines with agricultural cycles (sowing and harvesting timelines of Rice, Turmeric, Banana, Cotton, Maize, etc.) to target periods of high rural cash liquidity.

### 4. Beneficiary Directory & Profile Dashboards
*   **Unified Directory:** Central list of local citizens with demographic metadata, income tier, occupation, and current account status.
*   **Top 3 Eligible Schemes:** Identifies individual eligibility rankings to maximize successful conversions.
*   **Individual Trackers:** In-depth user profile dashboards with pending enrollment trackers and days-left-to-enroll alerts.

### 5. Branch Office Targets & Gamification
*   **Target Milestone Tracker:** Monitor set targets and achievements for Sub-Post Offices (SPOs) and Branch Post Offices (BPOs).
*   **Gamified Leaderboard:** Incentivizes field workers with points, rank achievements, and performance badges (e.g., *Target Master*, *Mela Champion*).

### 6. Grounded Gemini AI Chatbot
*   **Smart Query Resolver:** Natural language assistance powered by Gemini 2.0 Flash to help postmasters draft outreach messages, build campaign plans, or check scheme guidelines.
*   **Metrics Grounding Layer:** Includes an automated validation script that scans model outputs to prevent hallucinated interest rates, incorrect codes, or ungrounded statistics.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** Next.js (App Router, React 18, TypeScript)
*   **Styling:** TailwindCSS, DaisyUI, Framer Motion
*   **State Management:** Zustand
*   **Database & ORM:** MongoDB, Mongoose
*   **AI Integration:** Vercel AI SDK (`@ai-sdk/google`) utilizing Gemini 2.0 Flash

---

## 🚀 Getting Started

### 📋 Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### ⚙️ Setup & Configuration

1.  **Clone the repository & install dependencies:**
    ```bash
    git clone https://github.com/MOULEESWARAN-25/Postal-Service.git
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    # MongoDB connection string
    MONGODB_URI=your_mongodb_connection_uri

    # Secret key for JWT auth
    JWT_SECRET=your_jwt_secret_key

    # Gemini API Credentials
    GEMINI_API_KEY=your_gemini_api_key
    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
    ```

3.  **Seed the Database:**
    Populate your database collections with demographic records, schemes, agricultural timings, and mock beneficiary data:
    ```bash
    node seed-all.js
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.

---

## 👤 Author

*   **Mouleeswaran**
*   [GitHub Repository](https://github.com/MOULEESWARAN-25/Postal-Service.git)
