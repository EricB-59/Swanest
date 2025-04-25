# Swanest - Dating Application

## Overview

Swanest is a modern dating application built with Angular on the frontend and Symfony on the backend. The application connects users through an intuitive interface and provides a seamless experience for finding personal connections.

## Technology Stack

### Frontend

- **Framework**: Angular
- **Asynchronous State Management**: RxJS
- **Styling**: TailwindCSS

### Backend

- **Framework**: Symfony
- **ORM**: Doctrine
- **Authentication & Security**: Symfony Security Bundle
- **Database**: MySQL

## Prerequisites

- Node.js (version 14+)
- PHP 8.0+
- Composer
- MySQL 5.7+

## Installation

### Backend Setup

1. Clone the repository:

```
git clone https://github.com/your-username/swanest.git
cd swanest/backend
```

2. Install dependencies:

```
composer install
```

3. Configure the `.env` file with database credentials:

```
DATABASE_URL=mysql://username:password@127.0.0.1:3306/swanest
```

4. Create database and run migrations:

```
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

5. Start the server:

```
symfony server:start
```

### Frontend Setup

1. Navigate to the frontend directory:

```
cd ../app
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
ng serve
```

4. Access the application at `http://localhost:4200`

## Key Features

- **User Authentication**: Secure registration and login
- **Customizable Profiles**: Users can create and edit their profiles
- **Matching System**: Algorithm to connect compatible users
- **Real-time Chat**: Fluid communication between users
- **Responsive Design**: Works on mobile and desktop devices

## Project Structure

### Frontend (Angular)

```
frontend/
├── src/
│   ├── app/
│   │   ├── app/
│   │   ├── landing-page/
│   │   |  |── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── ...
│   ├── assets/
│   └── environments/
└── ...
```

### Backend (Symfony)

```
backend/
├── config/
├── public/
├── src/
│   ├── Controller/
│   ├── Entity/
│   ├── Repository/
│   ├── Service/
│   └── ...
└── ...
```

## Contributing

1. Fork the repository
2. Create a branch for the new feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a new Pull Request
