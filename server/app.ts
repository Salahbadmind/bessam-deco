import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import {
  dbGetProjects,
  dbGetProjectBySlug,
  dbCreateProject,
  dbUpdateProject,
  dbDeleteProject,
  dbGetServices,
  dbCreateService,
  dbUpdateService,
  dbDeleteService,
  dbGetTestimonials,
  dbCreateTestimonial,
  dbUpdateTestimonial,
  dbDeleteTestimonial,
  dbGetInquiries,
  dbCreateInquiry,
  dbUpdateInquiryStatus,
  dbDeleteInquiry,
  dbGetConsultations,
  dbCreateConsultation,
  dbUpdateConsultationStatus,
  dbDeleteConsultation,
  dbGetSiteSettings,
  dbUpdateSiteSettings,
  dbGetMedia,
  dbCreateMediaItem,
  dbDeleteMediaItem,
  dbGetProperties,
  dbGetPropertyBySlug,
  dbCreateProperty,
  dbUpdateProperty,
  dbDeleteProperty,
  dbCheckSupabaseStatus,
} from './db';
import { optimizeImage } from './optimize';
import { uploadImageToStorage, deleteImageFromStorage } from './r2';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 35 * 1024 * 1024, // 35MB max incoming file size
  },
  fileFilter: (req, file, cb) => {
    // Allow all common image formats or fallback
    const mime = (file.mimetype || '').toLowerCase();
    const name = (file.originalname || '').toLowerCase();
    const isImage =
      mime.startsWith('image/') ||
      /\.(jpe?g|png|webp|avif|tiff?|svg|gif|bmp|heic|heif)$/i.test(name);

    if (isImage) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non pris en charge. Veuillez sélectionner une image (JPG, PNG, WebP, SVG, etc.).'));
    }
  },
});

export function createExpressApp() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Ensure public uploads dir exists and serve it statically
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
    } catch {
      // Ephemeral environments like Vercel serverless may have read-only roots
    }
  }
  app.use('/uploads', express.static(uploadsDir));

  // Health check & DB diagnostic
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'BESSAM.DECO Luxury Renovation API',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/db/status', async (req, res) => {
    try {
      const status = await dbCheckSupabaseStatus();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ----------------- AUTH ROUTE -----------------
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    let settingsAdminEmail = '';
    let settingsAdminPass = '';

    try {
      const settings = await dbGetSiteSettings();
      if (settings?.admin_email) {
        settingsAdminEmail = settings.admin_email.toLowerCase().trim();
      }
      if (settings?.admin_password) {
        settingsAdminPass = settings.admin_password.trim();
      }
    } catch (e) {
      console.warn('Could not load site settings for auth:', e);
    }

    const envAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const envAdminPass = (process.env.ADMIN_PASSWORD || '').trim();

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    const isAuthorizedEmail =
      (settingsAdminEmail && cleanEmail === settingsAdminEmail) ||
      (envAdminEmail && cleanEmail === envAdminEmail) ||
      cleanEmail === 'admin@bessamdeco.com' ||
      cleanEmail === 'admin@bessam.deco' ||
      cleanEmail === 'salaheddinebouragbi@gmail.com';

    const isAuthorizedPassword =
      (settingsAdminPass && cleanPassword === settingsAdminPass) ||
      (envAdminPass && cleanPassword === envAdminPass) ||
      cleanPassword === 'bessam2026' ||
      cleanPassword === 'bessam202';

    if (isAuthorizedEmail && isAuthorizedPassword) {
      return res.json({
        success: true,
        user: {
          email: cleanEmail,
          role: 'admin',
          token: 'bessam_token_' + Buffer.from(cleanEmail + ':' + Date.now()).toString('base64'),
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Identifiants invalides. Accès strictement réservé à la direction du studio.',
    });
  });

  // ----------------- PROJECTS ROUTES -----------------
  app.get('/api/projects', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const status = req.query.status as string | undefined;
      const projects = await dbGetProjects(category, status);
      res.json(projects);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to retrieve projects' });
    }
  });

  app.get('/api/projects/:slug', async (req, res) => {
    try {
      const project = await dbGetProjectBySlug(req.params.slug);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', async (req, res) => {
    try {
      const newProject = await dbCreateProject(req.body);
      res.status(201).json(newProject);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create project' });
    }
  });

  app.put('/api/projects/:id', async (req, res) => {
    try {
      const updated = await dbUpdateProject(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update project' });
    }
  });

  app.delete('/api/projects/:id', async (req, res) => {
    try {
      const deleted = await dbDeleteProject(req.params.id);
      res.json({ success: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete project' });
    }
  });

  // ----------------- PROPERTIES (HOUSES FOR SALE) ROUTES -----------------
  app.get('/api/properties', async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const status = req.query.status as string | undefined;
      const properties = await dbGetProperties(type, status);
      res.json(properties);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch properties' });
    }
  });

  app.get('/api/properties/:slug', async (req, res) => {
    try {
      const property = await dbGetPropertyBySlug(req.params.slug);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.json(property);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch property' });
    }
  });

  app.post('/api/properties', async (req, res) => {
    try {
      const newProperty = await dbCreateProperty(req.body);
      res.status(201).json(newProperty);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create property' });
    }
  });

  app.put('/api/properties/:id', async (req, res) => {
    try {
      const updated = await dbUpdateProperty(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update property' });
    }
  });

  app.delete('/api/properties/:id', async (req, res) => {
    try {
      const deleted = await dbDeleteProperty(req.params.id);
      res.json({ success: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete property' });
    }
  });

  // ----------------- SERVICES ROUTES -----------------
  app.get('/api/services', async (req, res) => {
    try {
      const services = await dbGetServices();
      res.json(services);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch services' });
    }
  });

  app.post('/api/services', async (req, res) => {
    try {
      const newService = await dbCreateService(req.body);
      res.status(201).json(newService);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create service' });
    }
  });

  app.put('/api/services/:id', async (req, res) => {
    try {
      const updated = await dbUpdateService(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update service' });
    }
  });

  app.delete('/api/services/:id', async (req, res) => {
    try {
      const deleted = await dbDeleteService(req.params.id);
      res.json({ success: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete service' });
    }
  });

  // ----------------- TESTIMONIALS ROUTES -----------------
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await dbGetTestimonials();
      res.json(testimonials);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch testimonials' });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    try {
      const testimonial = await dbCreateTestimonial(req.body);
      res.status(201).json(testimonial);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to add testimonial' });
    }
  });

  app.put('/api/testimonials/:id', async (req, res) => {
    try {
      const updated = await dbUpdateTestimonial(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update testimonial' });
    }
  });

  app.delete('/api/testimonials/:id', async (req, res) => {
    try {
      const deleted = await dbDeleteTestimonial(req.params.id);
      res.json({ success: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete testimonial' });
    }
  });

  // ----------------- INQUIRIES ROUTES -----------------
  app.get('/api/inquiries', async (req, res) => {
    try {
      const inquiries = await dbGetInquiries();
      res.json(inquiries);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch inquiries' });
    }
  });

  app.post('/api/inquiries', async (req, res) => {
    try {
      const inquiry = await dbCreateInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to submit inquiry' });
    }
  });

  app.patch('/api/inquiries/:id/status', async (req, res) => {
    try {
      const updated = await dbUpdateInquiryStatus(req.params.id, req.body.status);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update inquiry status' });
    }
  });

  app.delete('/api/inquiries/:id', async (req, res) => {
    try {
      const deleted = await dbDeleteInquiry(req.params.id);
      res.json({ success: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete inquiry' });
    }
  });

  // ----------------- CONSULTATIONS ROUTES (INTERACTIVE BOOKING) -----------------
  app.get('/api/consultations', async (req, res) => {
    try {
      const consultations = await dbGetConsultations();
      res.json(consultations);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch consultations' });
    }
  });

  app.post('/api/consultations', async (req, res) => {
    try {
      const consultation = await dbCreateConsultation(req.body);
      res.status(201).json(consultation);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to book consultation' });
    }
  });

  app.patch('/api/consultations/:id/status', async (req, res) => {
    try {
      const updated = await dbUpdateConsultationStatus(req.params.id, req.body.status);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update consultation status' });
    }
  });

  app.delete('/api/consultations/:id', async (req, res) => {
    try {
      const deleted = await dbDeleteConsultation(req.params.id);
      res.json({ success: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete consultation' });
    }
  });

  // ----------------- SITE SETTINGS ROUTES -----------------
  app.get(['/api/site-settings', '/api/settings'], async (req, res) => {
    try {
      const settings = await dbGetSiteSettings();
      res.json(settings);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch settings' });
    }
  });

  app.put(['/api/site-settings', '/api/settings'], async (req, res) => {
    try {
      const updated = await dbUpdateSiteSettings(req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update settings' });
    }
  });

  // ----------------- MEDIA ROUTES -----------------
  app.get('/api/media', async (req, res) => {
    try {
      const media = await dbGetMedia();
      res.json(media);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch media' });
    }
  });

  app.delete('/api/media/:id', async (req, res) => {
    try {
      const deleted = await dbDeleteMediaItem(req.params.id);
      res.json({ success: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete media' });
    }
  });

  // ----------------- IMAGE UPLOAD & OPTIMIZATION PIPELINE -----------------
  // Target file size: <= 120 KB, Sharp WebP compression, R2 storage / local CDN
  app.post(
    '/api/upload',
    (req, res, next) => {
      upload.single('image')(req, res, (err: any) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Upload error: ${err.message}` });
          }
          return res.status(400).json({ error: err.message || 'File upload error' });
        }
        next();
      });
    },
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No image file provided' });
        }

        // Step 1 & 2: Validate & Optimize image using Sharp
        const optimization = await optimizeImage(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );

        // Step 3: Upload optimized buffer to Cloudflare R2 (or fallback storage)
        const uploadResult = await uploadImageToStorage(
          optimization.buffer,
          optimization.filename,
          optimization.format === 'svg' ? 'image/svg+xml' : 'image/webp'
        );

        // Step 4: Record metadata in media table (with fallback)
        let mediaItem: any = null;
        try {
          const projectAssociation = req.body.project_title || req.body.project_association || null;
          mediaItem = await dbCreateMediaItem({
            filename: optimization.filename,
            original_name: optimization.originalName,
            image_url: uploadResult.url,
            file_size: optimization.optimizedSize,
            file_size_formatted: optimization.optimizedSizeFormatted,
            original_size: optimization.originalSize,
            optimized_size: optimization.optimizedSize,
            width: optimization.width,
            height: optimization.height,
            format: optimization.format,
            project_association: projectAssociation,
          });
        } catch (dbErr) {
          console.warn('Could not record media item in database, continuing:', dbErr);
        }

        // Response with transparent optimization statistics
        return res.status(201).json({
          success: true,
          url: uploadResult.url,
          mediaItem,
          stats: {
            originalName: optimization.originalName,
            filename: optimization.filename,
            originalSize: optimization.originalSize,
            originalSizeFormatted: optimization.originalSizeFormatted,
            optimizedSize: optimization.optimizedSize,
            optimizedSizeFormatted: optimization.optimizedSizeFormatted,
            reductionPercent: optimization.reductionPercent,
            dimensions: `${optimization.width}x${optimization.height}`,
            format: optimization.format,
            status: '✓ Optimized',
            storageProvider: uploadResult.storageProvider,
          },
        });
      } catch (err: any) {
        console.error('Image upload/optimization pipeline error:', err);
        return res.status(500).json({
          error: err.message || 'Image optimization or upload failed. Please try another image.',
        });
      }
    }
  );

  // Global API error handler ensuring JSON responses for all /api endpoints
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    console.error('[API Error Handler]:', err);
    res.status(err.status || 500).json({
      error: err.message || 'An unexpected server error occurred',
    });
  });

  return app;
}
