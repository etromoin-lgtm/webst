const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize DB connection & tables
require('./src/config/database');

const { uploadsDir } = require('./src/controllers/uploadController');

// Route modules
const contactRoutes = require('./src/routes/contactRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const partnerRoutes = require('./src/routes/partnerRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const productRoutes = require('./src/routes/productRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const caseStudiesRoutes = require('./src/routes/caseStudiesRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const portalRoutes = require('./src/routes/portalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Mount Modular API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/products', productRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gmcadmin', adminRoutes);
app.use('/api/case-studies', caseStudiesRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/portal', portalRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Production: Serve Frontend SPA Build if web-app/dist exists
const distDir = path.resolve(__dirname, '../web-app/dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res) => {
    // Avoid capturing api routes with 404s
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log('Serving production frontend from ' + distDir);
}

if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
