# Artistic Creation Management System

## Overview
The Artistic Creation Management System is a web application that allows artists and users to interact in a digital marketplace for art. Artists can showcase and sell their artworks, while users can browse, purchase, and provide feedback on the art. The system includes features for registration, art management, transactions, and feedback. Administrators have the ability to manage users and artworks.

## Features

### For Artists
- **Register:** Artists can sign up to the system.
- **Upload Arts:** Artists can upload their artworks with images, select categories, set prices, indicate in-stock status, and mark featured items.
- **Update Artworks:** Artists can update their artwork details at any time.
- **Profile Management:** Artists can view and edit their profile information.
- **Transaction History:** Artists can view their sales transactions.
- **View Feedback:** Artists can read feedback from users on their artworks.
- **Congratulatory Card:** Artists receive a congratulatory card if they have the highest liked post.

### For Users
- **Register:** Users can sign up to the system.
- **Browse Arts:** Users can view artworks based on categories.
- **Like & Comment:** Users can like and comment on artworks.
- **Purchase Arts:** Users can purchase artworks.
- **Rate & Feedback:** Users can provide ratings and feedback on purchased artworks.

### For Admin
- **Delete Arts:** Admins can delete any artwork.
- **Manage Users:** Admins can delete users.
- **View Transactions:** Admins can view all transactions.
- **Contact Requests:** Admins can view contact requests submitted by users.

## Usage

### Artist Workflow
1. **Register:** Sign up as an artist and complete the registration process.
2. **Upload Art:** Navigate to the 'Upload Art' section.
   - Upload an image of the artwork.
   - Select the category.
   - Set the cost and indicate if it's in stock.
   - Mark featured items if applicable.
   - Save the artwork to the database.
3. **Update Art:** Go to the 'My Arts' section to update details of existing artworks.
4. **View Profile:** Check and edit profile information in the 'Profile' section.
5. **View Transactions:** Access the 'Transactions' section to see a history of sales.
6. **View Feedback:** Read feedback in the 'Feedback' section.
7. **Congratulatory Card:** Receive a card for having the highest liked post.

### User Workflow
1. **Register:** Sign up as a user.
2. **Browse Arts:** Go to the 'Arts' section to view artworks by category.
3. **Like & Comment:** Like and comment on favorite artworks.
4. **Purchase Art:** Select an artwork and proceed with the purchase.
5. **Rate & Feedback:** After purchasing, provide a rating and feedback on the artwork.

### Admin Workflow
1. **Delete Arts:** Navigate to the 'Manage Arts' section to delete artworks.
2. **Manage Users:** Go to the 'Manage Users' section to delete users.
3. **View Transactions:** Access the 'Transactions' section to view all transactions.
4. **Contact Requests:** Check the 'Contact Requests' section to view messages from users.

## Technologies Used
- **Flask:** Backend framework to handle web requests and responses.
- **PostgreSQL:** Database to store user data, artwork details, transactions, and feedback.
- **React:** Frontend library for building the user interface.
- **Material-UI (MUI):** React component library for designing responsive and visually appealing web pages.
