const express = require('express');
const app = express();

// Test importing user routes
try {
  const userRoutes = require('./src/routes/users');
  console.log('User routes imported successfully');
  app.use('/api/users', userRoutes);
} catch (error) {
  console.error('Error importing user routes:', error.message);
  console.error(error.stack);
}

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});