# MediTrust MVC (Merged Features 16–20)

## Setup
1. Copy folder `meditrust` into your XAMPP `htdocs/`
2. Create DB:
   - Open phpMyAdmin -> import `database/schema.sql`
3. Update DB creds in `app/config/database.php`
4. Open:
   - http://localhost/meditrust/public/

## Routes
- /emr
- /notifications
- /reports
- /telemedicine
- /feedback

## API (optional)
- GET/POST /api/emr
- GET/POST /api/notifications
- GET/POST /api/visits
- GET/POST /api/telemedicine
- GET/POST /api/feedback

> Your existing JS is kept as-is in `public/assets/js/`. If you want DB integration, we can update each JS file to use the API routes above.
