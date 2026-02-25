# Sports Facility Booking Platform
This is a basic ecommerce website backend project created with Node.js, Express.js, MongoDB, and Mongoose.


## Running command

To run project locally, run the following command

```bash
  npm install
```

```bash
  npm run dev
```

To build project locally, run the following command

```bash
  npm run build
```

To build build version, run the following command

```bash
  npm run start
```





## Features

- user can signup and register.
- user can book facility.
- user cancel booking.
- admin can add facility.
- admin can delete facility

## admin login:
```
  {
  "email": "web@programming-hero-a.com",
  "password": "programming-hero"
  }
```
## Live link: 
https://sports-facility-booking-platform-server.onrender.com/

## API
- /api/auth/signup (POST)
  - Data:
   ```
    {
  "name": "Programming Hero",
  "email": "web@programming-hero.com",
  "password": "programming-hero",
  "phone": "01322901105",
  "role": "admin", // or 'user'
  "address": "Level-4, 34, Awal Centre, Banani, Dhaka"
  }
- /api/auth/login (POST)
  - Data
  ```
  {
  "email": "web@programming-hero.com",
  "password": "programming-hero"
  }
- /api/facility (POST) (Admin only)

  - Headers
     ```
     Authorization: Bearer JWT_TOKEN
  - Data
  ```
  {
  "name": "Tennis Court",
  "description": "Outdoor tennis court with synthetic surface.",
  "pricePerHour": 30,
  "location": "456 Sports Ave, Springfield"
  }

- /api/facility/:id (PUT) (Admin only)
  - Headers
    ```
     Authorization: Bearer JWT_TOKEN
  - Data
  ```
  {
  "name": "Updated Tennis Court",
  "description": "Updated outdoor tennis court with synthetic surface.",
  "pricePerHour": 35,
  "location": "789 Sports Ave, Springfield"
  }
- /api/facility/:id (DELETE) (Admin only)
  - Headers
    ```
     Authorization: Bearer JWT_TOKEN
- /api/facility (GET)
- /api/check-availability?date=2024-06-15 (GET)
- /api/bookings (POST) (User only)
  - Headers
  ```
     Authorization: Bearer JWT_TOKEN
  ```
  - Data
  ```
    {
    "facility": "60d9c4e4f3b4b544b8b8d1c5",
    "date": "2024-06-15",
    "startTime": "10:00",
    "endTime": "13:00"
    }
  ```
- /api/bookings (GET) (Admin only)
  - Headers
  ```
     Authorization: Bearer JWT_TOKEN
  ```
- /api/bookings/user (GET) (User only)

  - Headers
  ```
     Authorization: Bearer JWT_TOKEN
  ```
- /api/bookings/:id (DELETE) (User only)

  - Headers
  ```
     Authorization: Bearer JWT_TOKEN
  ```
    



