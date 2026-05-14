Team Task Manager (Full-Stack)

Team Task Manager (Full-Stack)

A full-stack project management application built with Next.js and MongoDB.

Features
- Authentication with Signup and Login
- Admin and Member roles with role-based authorization
- Project creation, member assignment, and team collaboration
- Task creation, assignment, priority, status updates, and overdue tracking
- Dashboard with project/task counts, status summaries, and overdue visibility
- REST APIs with MongoDB-backed persistence
- Deployable on Railway with `npm start`

Setup
1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` and `JWT_SECRET` in `.env`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL displayed by Next.js (for example, `http://localhost:3001`).

How to use
- Use Signup to create a new account.
- Use Login to access the dashboard.
- Admins can create projects and invite team members by email.
- Members can view assigned projects and tasks.
- Task cards show priority, due date, assignment, and status.

Deployment
- Railway: use `Procfile` with `web: npm start`.
- Set required environment variables in Railway: `MONGO_URI`, `JWT_SECRET`.

Submission Placeholders
Live Application URL: *add after deployment*
GitHub Repository Link: *add after pushing*

Final Notes
This project is a complete, functional full-stack task management app. It is built to be clean, minimal, and ready for deployment.
