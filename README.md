# Portfolio Website with Admin Dashboard

A complete personal showcase website with an admin dashboard built with HTML, CSS, JavaScript, and Firebase integration.

## Features

### User-Facing Features
- **Home Page**: Introduction, featured projects, skills section, responsive design
- **Projects Page**: Grid layout with filtering, project details on click
- **Project Detail View**: Title, description, images/videos, 5-star rating, comment section
- **About Page**: Bio, skills with progress bars, experience timeline, education
- **Contact Page**: Contact form, social media links, FAQ section

### Admin Dashboard
- **Overview**: Total projects, reviews, average rating statistics
- **Project Management**: Add, edit, delete projects, feature toggle
- **Reviews Management**: View, add, edit, delete, search, filter reviews
- **Contact Messages**: View and manage contact form submissions
- **Settings**: Portfolio information and contact details management

## Technical Features

- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **Modern UI**: Clean, professional design with smooth animations
- **Firebase Integration**: Real-time data storage and authentication
- **Demo Mode**: Works without Firebase configuration for testing
- **Interactive Elements**: Rating system, comment system, image modals
- **Form Validation**: Client-side validation for all forms
- **Loading States**: Visual feedback during form submissions

## Setup Instructions

### 1. Firebase Setup (Optional - Demo Mode Available)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password)
5. Get your Firebase configuration
6. Replace the configuration in `script.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 2. Admin Access

#### With Firebase Setup:
- Create an admin user in Firebase Authentication
- Use the email/password to login to admin dashboard

#### Demo Mode (No Firebase Setup Required):
- Email: `admin@demo.com`
- Password: `admin123`

### 3. File Structure

```
webport/
├── index.html              # Home page
├── projects.html           # Projects listing page
├── project-detail.html    # Individual project page
├── about.html             # About page
├── contact.html           # Contact page
├── admin.html             # Admin dashboard
├── styles.css             # Main stylesheet
├── projects.css           # Projects page styles
├── project-detail.css     # Project detail styles
├── about.css              # About page styles
├── contact.css            # Contact page styles
├── admin.css              # Admin dashboard styles
├── script.js              # Main JavaScript file
├── projects.js            # Projects page JavaScript
├── project-detail.js      # Project detail JavaScript
├── about.js               # About page JavaScript
├── contact.js             # Contact page JavaScript
├── admin.js               # Admin dashboard JavaScript
└── README.md               # This file
```

### 4. Running the Website

1. **Local Development**: Open `index.html` in a web browser
2. **Web Server**: Upload files to any web hosting service
3. **GitHub Pages**: Push to GitHub and enable Pages

## Usage

### Adding Projects (Admin Dashboard)
1. Login to admin dashboard
2. Go to Projects section
3. Click "Add New Project"
4. Fill in project details:
   - Title
   - Category (Web, Mobile, Design, Full Stack)
   - Description
   - Image URL
   - Additional images (comma-separated URLs)
   - Featured toggle

### Managing Reviews
- View all project reviews in the Reviews section
- Filter by rating
- Delete inappropriate reviews

### Contact Management
- View contact form submissions
- Mark messages as read/unread
- Delete old messages

## Customization

### Personal Information
Update the following in `admin.html` settings:
- Portfolio name
- Title/role
- Description
- Contact information

### Styling
- Modify `styles.css` for global styles
- Update individual page CSS files for specific styling
- Change colors, fonts, and layouts as needed

### Content
- Replace placeholder images with your own
- Update project descriptions and details
- Modify the about page content
- Customize the FAQ section

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript**: ES6+ features, async/await
- **Firebase**: Firestore database, Authentication
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please check the code comments or create an issue in the repository.

---

**Note**: This portfolio website is designed to be professional and showcase your work effectively. Customize the content, images, and styling to match your personal brand and preferences.