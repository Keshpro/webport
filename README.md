# Personal Showcase Website with Admin Dashboard

A complete personal portfolio website with admin dashboard built with HTML, CSS, JavaScript, and Firebase integration.

## Features

### User-Facing Site
- **Home Page**: Introduction, featured projects, skills showcase
- **Projects Page**: Grid layout with filtering and project cards
- **Project Detail View**: Detailed project information with 5-star rating system and comments
- **About Page**: Bio, skills, experience timeline, achievements
- **Contact Page**: Contact form with FAQ section
- **Responsive Design**: Mobile-first approach with modern UI

### Admin Dashboard
- **Dashboard Overview**: Statistics, recent projects, and reviews
- **Project Management**: Add, edit, delete projects with featured toggle
- **Reviews Management**: View and manage user reviews and ratings
- **Contact Messages**: View and manage contact form submissions
- **Settings**: Portfolio information and contact details management

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Firestore Database
4. Enable Authentication (Email/Password)
5. Get your Firebase configuration from Project Settings > General > Your apps
6. Replace the Firebase configuration in `script.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 2. Firestore Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to projects, comments, and ratings
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /comments/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    
    match /ratings/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    
    match /contacts/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Admin User Setup

1. Go to Firebase Console > Authentication > Users
2. Add a new user with email/password for admin access
3. Use these credentials to log into the admin dashboard

### 4. File Structure

```
portfolio-website/
├── index.html              # Home page
├── projects.html           # Projects listing page
├── project-detail.html     # Individual project page
├── about.html              # About page
├── contact.html            # Contact page
├── admin.html              # Admin dashboard
├── styles.css              # Main stylesheet
├── projects.css            # Projects page styles
├── project-detail.css      # Project detail styles
├── about.css               # About page styles
├── contact.css             # Contact page styles
├── admin.css               # Admin dashboard styles
├── script.js               # Main JavaScript file
├── projects.js             # Projects page JavaScript
├── project-detail.js       # Project detail JavaScript
├── about.js                # About page JavaScript
├── contact.js              # Contact page JavaScript
└── admin.js                # Admin dashboard JavaScript
```

### 5. Running the Website

1. **Local Development**: Open `index.html` in a web browser
2. **Web Server**: Upload files to any web hosting service
3. **Firebase Hosting** (Recommended):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

## Usage

### Adding Projects (Admin)

1. Log into the admin dashboard
2. Go to Projects section
3. Click "Add New Project"
4. Fill in project details:
   - Title
   - Category (Web Development, Mobile Apps, UI/UX Design, Full Stack)
   - Description
   - Main image URL
   - Additional images (comma-separated URLs)
   - Featured project toggle

### Managing Reviews

1. Go to Reviews section in admin dashboard
2. View all user reviews and ratings
3. Delete inappropriate reviews if needed

### Contact Messages

1. Go to Contact Messages section
2. View all contact form submissions
3. Mark messages as read/unread
4. Delete messages when no longer needed

## Customization

### Personal Information

Update the following in each HTML file:
- Name: Replace "John Doe" with your name
- Email: Update contact email addresses
- Phone: Update phone number
- Location: Update location information
- Social Media Links: Update social media URLs

### Styling

- Modify `styles.css` for global styles
- Update page-specific CSS files for individual page styling
- Change color scheme by updating CSS variables
- Modify fonts by updating Google Fonts imports

### Content

- Replace placeholder images with your actual project images
- Update project descriptions and details
- Modify skills and technologies in the About page
- Update experience timeline with your actual work history

## Dummy Data

The website includes dummy data that loads when Firebase is not configured. This allows you to see the full functionality without setting up Firebase immediately.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Security Notes

- Admin authentication is required for dashboard access
- Firestore security rules prevent unauthorized data access
- Contact form submissions are stored securely
- User ratings and comments are publicly readable but only admin can delete

## Troubleshooting

### Firebase Connection Issues
- Check Firebase configuration in `script.js`
- Verify Firestore rules are properly set
- Ensure authentication is enabled

### Admin Login Issues
- Verify admin user exists in Firebase Authentication
- Check email/password credentials
- Ensure Firestore rules allow admin access

### Styling Issues
- Check CSS file paths in HTML
- Verify Font Awesome and Google Fonts are loading
- Clear browser cache

## Support

For issues or questions:
1. Check the browser console for JavaScript errors
2. Verify Firebase configuration
3. Test with dummy data first
4. Check network connectivity for external resources

## License

This project is open source and available under the MIT License.
