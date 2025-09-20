# NEAT Schedule Backend

A comprehensive backend API for educational timetable management system built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Faculty, Student)
- 📊 **Timetable Management**: Complete CRUD operations for timetables, subjects, faculty, classrooms, and batches
- 🤖 **Smart Timetable Generation**: AI-powered algorithm with conflict detection and optimization
- ✏️ **Correction Workflow**: Faculty can suggest edits with admin approval system
- 📈 **Reports & Analytics**: Faculty workload and classroom utilization reports
- 📄 **Export Functionality**: PDF and Excel export capabilities
- 🐳 **Docker Support**: Complete containerization with docker-compose
- 🔒 **Security**: Rate limiting, CORS, Helmet, input validation
- 📝 **Logging**: Comprehensive logging with Winston

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neat-schedule-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed database (optional)
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

### Database Setup

1. **Install PostgreSQL** and create a database
2. **Update .env** with your database credentials
3. **Run migrations and seed data**
   ```bash
   npm run db:push
   npm run db:seed
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Faculty Management

- `GET /api/faculty` - List all faculty
- `POST /api/faculty` - Create faculty (Admin only)
- `GET /api/faculty/:id` - Get faculty by ID
- `PUT /api/faculty/:id` - Update faculty (Admin only)
- `DELETE /api/faculty/:id` - Delete faculty (Admin only)
- `PUT /api/faculty/:id/availability` - Update availability

### Subject Management

- `GET /api/subjects` - List all subjects
- `POST /api/subjects` - Create subject (Admin only)
- `GET /api/subjects/:id` - Get subject by ID
- `PUT /api/subjects/:id` - Update subject (Admin only)
- `DELETE /api/subjects/:id` - Delete subject (Admin only)

### Classroom Management

- `GET /api/classrooms` - List all classrooms
- `POST /api/classrooms` - Create classroom (Admin only)
- `GET /api/classrooms/:id` - Get classroom by ID
- `PUT /api/classrooms/:id` - Update classroom (Admin only)
- `DELETE /api/classrooms/:id` - Delete classroom (Admin only)

### Batch Management

- `GET /api/batches` - List all batches
- `POST /api/batches` - Create batch (Admin only)
- `GET /api/batches/:id` - Get batch by ID
- `PUT /api/batches/:id` - Update batch (Admin only)
- `DELETE /api/batches/:id` - Delete batch (Admin only)

### Timetable Management

- `GET /api/timetable` - List timetable entries
- `POST /api/timetable` - Create timetable entry (Admin only)
- `GET /api/timetable/:id` - Get timetable entry by ID
- `PUT /api/timetable/:id` - Update timetable entry (Admin only)
- `DELETE /api/timetable/:id` - Delete timetable entry (Admin only)

### Timetable Generation

- `POST /api/timetable-generator/generate` - Generate timetable (Admin only)
- `POST /api/timetable-generator/generate-multiple` - Generate multiple options (Admin only)
- `POST /api/timetable-generator/approve` - Approve timetable (Admin only)

### Reports & Export

- `GET /api/reports/summary` - Get report summary
- `GET /api/reports/faculty-workload` - Faculty workload report
- `GET /api/reports/classroom-utilization` - Classroom utilization report
- `POST /api/reports/export` - Export reports (PDF/Excel) (Admin only)

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/neat_schedule_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="info"
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and user management
- **Faculty**: Faculty information and availability
- **Students**: Student information linked to batches
- **Subjects**: Course subjects with faculty assignments
- **Classrooms**: Room information and capacity
- **Batches**: Student batches by department and semester
- **Timetable Entries**: Scheduled classes with conflict prevention
- **Timetable Suggestions**: Faculty suggestions for timetable changes

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm test            # Run tests
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
```

### Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── lib/            # Utilities and configurations
└── index.ts        # Application entry point
```

## Security Features

- JWT-based authentication
- Role-based access control
- Rate limiting
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- SQL injection prevention with Prisma
- Password hashing with bcrypt

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
