import Material from '../models/Material.js';
import Notification from '../models/Notification.js';
import cloudinary from '../services/cloudinaryService.js';
import fs from 'fs';
import crypto from 'crypto';

// Helper: get file URL (local or cloudinary)
const getFileUrl = async (file) => {
  if (!file) return '';

  // If cloudinary is configured
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'studysphere',
      });
      fs.unlinkSync(file.path); // Remove local file
      return { url: result.secure_url, publicId: result.public_id };
    } catch (err) {
      console.error('Cloudinary error, using local path:', err.message);
    }
  }

  // Local fallback - serve from /uploads
  return { url: `/uploads/${file.filename}`, publicId: '' };
};

// GET /api/materials
export const getMaterials = async (req, res) => {
  try {
    const { subject, type, unit, status, sort = 'newest', page = 1, limit = 20 } = req.query;

    let filter = {};

    // Students see only verified materials (and their own pending)
    if (req.user.role === 'student') {
      filter = {
        $or: [
          { status: 'verified' },
          { uploadedBy: req.user._id }
        ]
      };
    }

    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (unit) filter.unit = unit;
    if (status && req.user.role === 'teacher') filter.status = status;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'most-useful': { usefulCount: -1 },
    };

    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name email role')
      .populate('verifiedBy', 'name')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Material.countDocuments(filter);

    res.json({ success: true, materials, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/materials/:id
export const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name email role')
      .populate('verifiedBy', 'name');

    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    // Related materials
    const related = await Material.find({
      subject: material.subject,
      _id: { $ne: material._id },
      status: 'verified'
    }).populate('uploadedBy', 'name').limit(5);

    res.json({ success: true, material, related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/materials
export const createMaterial = async (req, res) => {
  try {
    const { title, description, subject, topic, unit, type, externalUrl, tags } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ success: false, message: 'Title and subject are required' });
    }

    let fileUrl = '';
    let publicId = '';
    let fileSize = 0;
    let fileHash = '';
    let fileName = '';

    if (req.file) {
      const fileData = await getFileUrl(req.file);
      fileUrl = fileData.url;
      publicId = fileData.publicId;
      fileSize = req.file.size;
      fileName = req.file.originalname;

      // Check for duplicates by filename
      const duplicate = await Material.findOne({ fileName, subject });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Similar material already exists',
          existingId: duplicate._id
        });
      }
    }

    const parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (tags || []);

    const materialData = {
      title,
      description: description || '',
      subject,
      topic: topic || '',
      unit: unit || '',
      type: type || 'pdf',
      fileUrl,
      externalUrl: externalUrl || '',
      publicId,
      tags: parsedTags,
      uploadedBy: req.user._id,
      fileName,
      fileSize,
      status: req.user.role === 'teacher' ? 'verified' : 'pending',
      isOfficial: req.user.role === 'teacher',
    };

    const material = await Material.create(materialData);
    await material.populate('uploadedBy', 'name email role');

    res.status(201).json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/materials/:id
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { title, description, subject, topic, unit, type, tags, isImportant, isOfficial } = req.body;

    Object.assign(material, {
      title: title || material.title,
      description: description !== undefined ? description : material.description,
      subject: subject || material.subject,
      topic: topic !== undefined ? topic : material.topic,
      unit: unit !== undefined ? unit : material.unit,
      type: type || material.type,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : material.tags,
      isImportant: isImportant !== undefined ? isImportant : material.isImportant,
      isOfficial: isOfficial !== undefined && req.user.role === 'teacher' ? isOfficial : material.isOfficial,
    });

    await material.save();
    res.json({ success: true, material });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await material.deleteOne();
    res.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/materials/:id/useful
export const markUseful = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    const alreadyMarked = material.usefulBy.includes(req.user._id);

    if (alreadyMarked) {
      material.usefulBy = material.usefulBy.filter(id => id.toString() !== req.user._id.toString());
      material.usefulCount = Math.max(0, material.usefulCount - 1);
    } else {
      material.usefulBy.push(req.user._id);
      material.usefulCount += 1;
    }

    await material.save();
    res.json({ success: true, usefulCount: material.usefulCount, marked: !alreadyMarked });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/search
export const searchMaterials = async (req, res) => {
  try {
    const { q, subject, type, unit, status, sort = 'newest' } = req.query;

    if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

    let filter = { $text: { $search: q } };

    if (req.user.role === 'student') {
      filter = {
        $and: [
          { $text: { $search: q } },
          { $or: [{ status: 'verified' }, { uploadedBy: req.user._id }] }
        ]
      };
    }

    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (unit) filter.unit = unit;

    const materials = await Material.find(filter, { score: { $meta: 'textScore' } })
      .populate('uploadedBy', 'name email role')
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .limit(50);

    res.json({ success: true, materials, query: q });
  } catch (error) {
    // Fallback regex search if text index not ready
    try {
      const { q, subject, type, unit } = req.query;
      const regex = new RegExp(q, 'i');
      let filter = {
        $or: [
          { title: regex },
          { description: regex },
          { subject: regex },
          { topic: regex },
          { tags: regex }
        ]
      };
      if (req.user.role === 'student') {
        filter = { $and: [filter, { $or: [{ status: 'verified' }, { uploadedBy: req.user._id }] }] };
      }
      if (subject) filter.subject = subject;
      if (type) filter.type = type;

      const materials = await Material.find(filter).populate('uploadedBy', 'name email role').limit(50);
      res.json({ success: true, materials, query: q });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};
