const mongoose = require('mongoose');
require('dotenv').config();
const { User, Book, Borrowing, Progress } = require('./models');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany();
    await Book.deleteMany();
    await Borrowing.deleteMany();
    await Progress.deleteMany();

    await User.create({
      name: 'Admin User',
      email: 'admin@libraryhub.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin'
    });

    const books = [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        description: 'A story of the wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        rating: 4.5,
        totalCopies: 5,
        availableCopies: 5
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Classic',
        description: 'The story of a young girl and her father, a lawyer who defends a black man falsely accused of a crime.',
        coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
        rating: 4.8,
        totalCopies: 3,
        availableCopies: 3
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Sci-Fi',
        description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.',
        coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
        rating: 4.7,
        totalCopies: 4,
        availableCopies: 4
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        description: 'A novel about a totalitarian regime that uses surveillance and mind control to keep its citizens in check.',
        coverUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=600&auto=format&fit=crop',
        rating: 4.6,
        totalCopies: 6,
        availableCopies: 6
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        description: 'A classic novel of manners focusing on the Bennet sisters.',
        coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
        rating: 4.9,
        totalCopies: 2,
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        description: 'Bilbo Baggins is whisked away from his comfortable, unambitious life in Hobbiton to go on an adventure.',
        coverUrl: 'https://images.unsplash.com/photo-1608181650392-1dcde9ed34be?q=80&w=600&auto=format&fit=crop',
        rating: 4.8,
        totalCopies: 8,
        availableCopies: 8
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Classic',
        description: 'The story of teenage rebellion and angst, focusing on Holden Caulfield.',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        rating: 4.2,
        totalCopies: 4,
        availableCopies: 4
      },
      {
        title: 'Neuromancer',
        author: 'William Gibson',
        genre: 'Sci-Fi',
        description: 'A washed-up computer hacker is hired by a mysterious employer to pull off the ultimate hack.',
        coverUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=600&auto=format&fit=crop',
        rating: 4.4,
        totalCopies: 3,
        availableCopies: 3
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        genre: 'Fiction',
        description: 'A shepherd boy travels from Spain to Egypt in search of a treasure buried in the Pyramids.',
        coverUrl: 'https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=600&auto=format&fit=crop',
        rating: 4.7,
        totalCopies: 7,
        availableCopies: 7
      },
      {
        title: 'Frankenstein',
        author: 'Mary Shelley',
        genre: 'Classic',
        description: 'A young scientist creates a sapient creature in an unorthodox scientific experiment.',
        coverUrl: 'https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=600&auto=format&fit=crop',
        rating: 4.3,
        totalCopies: 2,
        availableCopies: 2
      }
    ];

    await Book.insertMany(books);
    
    console.log('Sample data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
