
# Iventory-Managment-System

A RESTful API for managing product inventory, built with Node.js and Express.js, implementing CQRS pattern for better separation of concerns.



## Technologies
- Runtime: Node.js (v14 or higher)
- Framework: Express.js
- Database: MongoDB with Mongoose ODM
- Validation: Joi
- Dependency Injection: Typedi
- Testing:
    - Jest for unit tests
    - MongoDB Memory Server for test database
- Documentation: Postman Collection
## Features

- Complete CRUD operations for product management
- Stock level management with restock and sell operations
- Order management system with stock validation
- Input validation using Joi
- Comprehensive error handling
- Environment-based configuration
- Full test coverage
- API documentation via Postman Collection


## Installation

Clone the repository:

```bash
  git clone [repository-url]
  cd inventory-management-system
```
Install dependecies

```bash
  yarn install 
```

Create .env file based on example.env

```bash
  cp example.env .env
```

Init MongoDB

```bash
  docker compose up --build -d
```

Start Application
```bash
  yarn dev
```
Testing
```bash
  yarn test
  yarn test:coverage
```


## Project Structure

```plaintext
src/
├── api/                # API Layer
│   ├── controllers/    # Route controllers
│   ├── routes/         # API route definitions
│   ├── middleware/     # Custom middleware
│   └── validators/     # Request validation using Joi
│
├── domain/             # Domain Layer
│   ├── models/         # Mongoose models
│   ├── commands/       # Command handlers (CQRS)
│   ├── queries/        # Query handlers (CQRS)
│   └── repositories/   # Repositories for operations with DB
│
├── config/             # Config files
|
├── types/              # Shared objects
|
│
└── app.js              # Application entry point

test/
├── unit/               # Unit tests
└── setup.js            # Test configuration

postman/
└── collection.json     # Postman API collection