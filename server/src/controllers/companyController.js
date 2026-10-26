import Company from '../models/Company.js';
import Drive from '../models/Drive.js';
import { logAudit } from '../utils/auditLogger.js';

// GET /api/companies - List companies with optional search
export const getCompanies = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await Company.find(query).sort({ name: 1 });
    res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    next(error);
  }
};

// GET /api/companies/:id - Single company with active drives count
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const drivesCount = await Drive.countDocuments({ company: company._id });
    res.json({ success: true, company, drivesCount });
  } catch (error) {
    next(error);
  }
};

// POST /api/companies - Create new company
export const createCompany = async (req, res, next) => {
  try {
    const { name, industry, website, description, logoUrl } = req.body;

    if (!name || !industry) {
      return res.status(400).json({ success: false, message: 'Company name and industry are required' });
    }

    const existing = await Company.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A company with this name already exists' });
    }

    const company = await Company.create({
      name: name.trim(),
      industry: industry.trim(),
      website: (website || '').trim(),
      description: (description || '').trim(),
      logoUrl: (logoUrl || '').trim(),
      isSample: false // Real user-created company
    });

    await logAudit({
      actorId: req.user._id,
      action: 'CREATE_COMPANY',
      targetType: 'Company',
      targetId: company._id,
      details: { name: company.name, industry: company.industry }
    });

    res.status(201).json({ success: true, message: 'Company created successfully', company });
  } catch (error) {
    next(error);
  }
};

// PUT /api/companies/:id - Update company
export const updateCompany = async (req, res, next) => {
  try {
    const { name, industry, website, description, logoUrl } = req.body;

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (name) company.name = name.trim();
    if (industry) company.industry = industry.trim();
    if (website !== undefined) company.website = website.trim();
    if (description !== undefined) company.description = description.trim();
    if (logoUrl !== undefined) company.logoUrl = logoUrl.trim();

    await company.save();

    await logAudit({
      actorId: req.user._id,
      action: 'UPDATE_COMPANY',
      targetType: 'Company',
      targetId: company._id,
      details: { name: company.name }
    });

    res.json({ success: true, message: 'Company updated successfully', company });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/companies/:id - Delete company (BLOCKED if drives exist!)
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Check if any placement drives are tied to this company
    const associatedDrives = await Drive.countDocuments({ company: company._id });
    if (associatedDrives > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete company. There are ${associatedDrives} placement drive(s) linked to it. Close or delete the drives first.`
      });
    }

    await Company.findByIdAndDelete(company._id);

    await logAudit({
      actorId: req.user._id,
      action: 'DELETE_COMPANY',
      targetType: 'Company',
      targetId: company._id,
      details: { name: company.name }
    });

    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    next(error);
  }
};
