Team Task Manager (Full-Stack)

A full-stack project management application built with Next.js, MongoDB, and role-based team collaboration.

Live Demo
- https://team-task-manager-full-stack-two.vercel.app

GitHub Repository
- https://github.com/krishna-ethara/team-task-manager-full-stack

Features
- Email/password authentication with signup and login
- Admin and Member roles with access control
- Project creation, member assignment, and team collaboration
- Task creation, assignment, priority, status updates, and overdue tracking
- Dashboard with project/task counts and quick status summaries
- REST API routes backed by MongoDB and Mongoose
- Ready for production deployment on Vercel or Railway

Setup
1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` and `JWT_SECRET` in `.env`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL displayed by Next.js, typically `http://localhost:3000`.

How to Use
- Sign up to create a new account.
- Log in to access the dashboard.
- Admin users can create projects and add team members.
- Team members can view assigned projects and tasks.
- Task cards show priority, due date, assignee, and status.

Deployment
- Vercel: deploy with `vercel` and connect the GitHub repository.
- Production environment variables should include `MONGO_URI` and `JWT_SECRET`.
- If using Railway, deploy with `web: npm start` and set the same environment variables.

Notes
- The project has been built and verified with `npm run build`.
- The live deployment is currently available at the demo URL above.
