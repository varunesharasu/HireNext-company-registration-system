import { Company } from "../models/Company.js"
import cloudinary from "../config/cloudinary.js"
import createError from "http-errors"

export const registerCompany = async (req, res, next) => {
  try {
    const companyData = {
      ...req.body,
      owner_id: req.user.id,
    }

    // Check if company already exists for this user
    const existingCompany = await Company.findByOwnerId(req.user.id)
    if (existingCompany) {
      return next(createError(409, "Company profile already exists for this user"))
    }

    const company = await Company.create(companyData)

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      data: company,
    })
  } catch (error) {
    next(error)
  }
}

export const getCompanyProfile = async (req, res, next) => {
  try {
    const company = await Company.findByOwnerId(req.user.id)

    if (!company) {
      return next(createError(404, "Company profile not found"))
    }

    res.json({
      success: true,
      data: company,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCompanyProfile = async (req, res, next) => {
  try {
    const company = await Company.findByOwnerId(req.user.id)

    if (!company) {
      return next(createError(404, "Company profile not found"))
    }

    const updatedCompany = await Company.update(company.id, req.body)

    res.json({
      success: true,
      message: "Company profile updated successfully",
      data: updatedCompany,
    })
  } catch (error) {
    next(error)
  }
}

export const uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, "No file uploaded"))
    }

    const company = await Company.findByOwnerId(req.user.id)
    if (!company) {
      return next(createError(404, "Company profile not found"))
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "company-logos",
      public_id: `logo_${company.id}`,
      overwrite: true,
      transformation: [{ width: 300, height: 300, crop: "limit" }, { quality: "auto" }],
    })

    // Update database with new logo URL
    const updatedCompany = await Company.updateImageUrl(company.id, "logo_url", result.secure_url)

    res.json({
      success: true,
      message: "Logo uploaded successfully",
      data: {
        logo_url: result.secure_url,
        company: updatedCompany,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const uploadBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createError(400, "No file uploaded"))
    }

    const company = await Company.findByOwnerId(req.user.id)
    if (!company) {
      return next(createError(404, "Company profile not found"))
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "company-banners",
      public_id: `banner_${company.id}`,
      overwrite: true,
      transformation: [{ width: 1200, height: 400, crop: "limit" }, { quality: "auto" }],
    })

    // Update database with new banner URL
    const updatedCompany = await Company.updateImageUrl(company.id, "banner_url", result.secure_url)

    res.json({
      success: true,
      message: "Banner uploaded successfully",
      data: {
        banner_url: result.secure_url,
        company: updatedCompany,
      },
    })
  } catch (error) {
    next(error)
  }
}
