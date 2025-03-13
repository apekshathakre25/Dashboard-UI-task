# React + Vite Dashboard App

A fully responsive dashboard application with Pokemon data visualization and JWT authentication.

## 🔗 Quick Links
- [Live Demo](https://dashboard-ui-task-three.vercel.app/)


## 📋 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Tech Stack

- **Frontend Framework**: React.js
- **Build Tool**: Vite
- **State Management**: React Context API
- **API Client**: Axios
- **Styling**: TailwindCSS
- **Data Visualization**: Chart.js

# Pokemon Dashboard



### Authentication Flow

1. **User Registration & Login**
   - Created intuitive UI forms for user registration and login
   - Implemented API integration with ReqRes for authentication
   - Stored authentication tokens securely in localStorage

2. **Context API for State Management**
   - Developed a UserContext to manage authentication state across the application
   - Stored and retrieved user tokens using React Context API
   - Implemented logout functionality with state cleanup

3. **Route Protection**
   - Created a ProtectedRoute component to prevent unauthorized access
   - Implemented automatic redirection to login for unauthenticated users


### Dashboard Implementation

1. **Data Fetching & Processing**
   - Fetched Pokemon data from PokeAPI with axios
   - Implemented Promise.all for parallel API requests
   - Processed and transformed raw data for visualization purposes

2. **Data Visualization**
   - Utilized Chart.js for creating dynamic and responsive charts
   - Implemented three visualization modes:
     - Pokemon type distribution
     - Average base stats comparison
     - Pokemon height comparison with type-specific coloring
   - Added interactive filters to toggle between different visualizations

3. **Responsive UI Components**
   - Implemented a collapsible sidebar for improved mobile experience
   - Created a responsive card layout for Pokemon information display
   - Used Lucide React icons for consistent visual elements
