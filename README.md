 CampusConnect
# Campus Connect 🎓

**Connect, Learn, Grow Together** – CampusConnect is the ultimate social platform for college students to connect across years, find mentors, and build meaningful relationships.

---


## 🌐 Project Info
In many educational institutions, junior students often struggle to find the right guidance, while senior students have valuable experiences they want to share but lack a structured medium to do so. **Campus Connect** solves this by creating a centralized hub where:
- **Juniors** can seek mentorship, ask academic or career-related questions, and join study groups to learn collaboratively.
- **Seniors/Mentors** can host mentorship sessions, guide juniors through their academic journey, and build their leadership and communication skills.
- **The Campus Community** grows stronger, more connected, and more supportive, leading to better academic outcomes and a richer college experience for everyone.

<!-- **Live Project URL:** [https://your-project-url.com](https://your-project-url.com)   -->
**Tech Stack:** Vite, TypeScript, React, Tailwind CSS, shadcn-ui  
## ✨ Key Features

---
- **Cross-Year Networking:** Connect with students from different years.
- **Role-Based Authentication**: Secure login and registration for different roles (Juniors and Seniors/Mentors).
- **Mentorship Hub**: Seniors can schedule and host mentorship sessions. Juniors can easily discover and join these sessions.
- **Study Groups**: Collaborative spaces focused on specific subjects or goals (e.g., "DSA Practice Group") where students can join and learn together.
- **Q&A Forum**: A dedicated community forum where students can post questions, share knowledge, and get answers from peers and mentors.
- **Real-Time Communication**: Integrated WebSockets for real-time interactions and updates.


## 🛠️ Technology Stack

- **Cross-Year Networking:** Connect with students from different years.  
- **Mentorship Opportunities:** Find mentors or become a mentor for others.  
- **Profile & Activity Feed:** Showcase your skills, projects, and interests.  
- **Real-Time Updates:** Engage with the community with instant notifications.  
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile.
**Frontend:**
- Vite, TypeScript, React
- Tailwind CSS, shadcn-ui, Framer Motion
- Socket.io-client, React Router

---
**Backend:**
- Node.js & Express.js
- Prisma ORM (with PostgreSQL/MySQL)
- Socket.io (for real-time capabilities)
- JSON Web Tokens (JWT) & bcrypt

## 💻 Getting Started

You can edit and run this project in multiple ways.
<!-- 
### **1. Use the Online Editor**
<!-- - Open your project link in the editor: [Project Link](https://your-project-url.com)   -->
- Changes are auto-saved and reflected immediately. -->
You can run this project locally by following these steps:

### **2. Local Development**
Clone the repository and start developing locally.

```sh
# Step 1: Clone the repository
### **1. Clone the repository**
```bash
git clone https://github.com/demonayush11/campus-connect.git
# Step 2: Navigate to the project folder
cd campus-connect
```

# Step 3: Install dependencies
### **2. Backend Setup**
```bash
cd backend
npm install
# Create a .env file and add your DATABASE_URL and JWT_SECRET

# Sync your database schema
npx prisma db push

# Step 4: Start the development server
# Start the server
npm start
```

### **3. Frontend Setup**
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## 📄 License
This project is licensed under the ISC License.
