# Campus Connect 🎓

**Connect, Learn, Grow Together** – CampusConnect is the ultimate social platform for college students to connect across years, find mentors, and build meaningful relationships.

## 🌟 The Impact

In many educational institutions, junior students often struggle to find the right guidance, while senior students have valuable experiences they want to share but lack a structured medium to do so. **Campus Connect** solves this by creating a centralized hub where:
- **Juniors** can seek mentorship, ask academic or career-related questions, and join study groups to learn collaboratively.
- **Seniors/Mentors** can host mentorship sessions, guide juniors through their academic journey, and build their leadership and communication skills.
- **The Campus Community** grows stronger, more connected, and more supportive, leading to better academic outcomes and a richer college experience for everyone.

## ✨ Key Features

- **Cross-Year Networking:** Connect with students from different years.
- **Role-Based Authentication**: Secure login and registration for different roles (Juniors and Seniors/Mentors).
- **Mentorship Hub**: Seniors can schedule and host mentorship sessions. Juniors can easily discover and join these sessions.
- **Study Groups**: Collaborative spaces focused on specific subjects or goals (e.g., "DSA Practice Group") where students can join and learn together.
- **Q&A Forum**: A dedicated community forum where students can post questions, share knowledge, and get answers from peers and mentors.
- **Real-Time Communication**: Integrated WebSockets for real-time interactions and updates.

## 🛠️ Technology Stack

**Frontend:**
- Vite, TypeScript, React
- Tailwind CSS, shadcn-ui, Framer Motion
- Socket.io-client, React Router

**Backend:**
- Node.js & Express.js
- Prisma ORM (with PostgreSQL/MySQL)
- Socket.io (for real-time capabilities)
- JSON Web Tokens (JWT) & bcrypt

## 💻 Getting Started

You can run this project locally by following these steps:

### **1. Clone the repository**
```bash
git clone https://github.com/demonayush11/campus-connect.git
cd campus-connect
```

### **2. Backend Setup**
```bash
cd backend
npm install
# Create a .env file and add your DATABASE_URL and JWT_SECRET

# Sync your database schema
npx prisma db push

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
