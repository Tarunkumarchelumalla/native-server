import { Request, Response } from 'express';
import { Company, LinkUserRole, Role, User } from '../modals';
import mongoose from 'mongoose';

export class MasterController {
  // Create a new company
  static async createCompany(req: Request, res: Response): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { CompanyName,Username, Address, Phone, GSTIN, Email,Password } = req.body;
  
      // Check if a company with the same GSTIN already exists
      const existingCompany = await Company.findOne({ GSTIN }).session(session);
      if (existingCompany) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: 'Company with this GSTIN already exists' });
        return;
      }
  
      // Create new company record
      const company = new Company({ CompanyName, Address, Phone, GSTIN });
      await company.save({ session });
  
      // Create a user for the company
      const user = new User({
        Name: Username,
        Email,
        Password: Password,
        CID: company.CID,
      });
  
      await user.save({ session });
  
      // Assign Role (RID 1, which could be an admin role)
      const role = await Role.findOne({ RID: 1 }).session(session);
      if (!role) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: 'Role with RID 1 does not exist' });
        return;
      }
  
      // Link the user role to the newly created user
      const userRole = new LinkUserRole({
        UID: user.UID,
        RID: role.RID,
      });
  
      await userRole.save({ session });
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      // Respond with company and user data
      res.status(201).json({
        message: 'Company and User created successfully',
        company,
        user,
      });
    } catch (error) {
      // Abort the transaction in case of error
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Error creating company and user', error });
    }
  }

  // Get all active companies
  static async getAllCompanies(_: Request, res: Response): Promise<void> {
    try {
      const companies = await Company.find({ IsActive: true });

      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching companies', error });
    }
  }

  // Get a company by CID
  static async getCompanyById(req: Request, res: Response): Promise<void> {
    try {
      const { CID } = req.params;

      const company = await Company.findOne({ CID, IsActive: true });
      if (!company) {
        res.status(404).json({ message: 'Company not found or inactive' });
        return;
      }

      res.status(200).json({ company });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching company', error });
    }
  }

  // Update a company by CID
  static async updateCompany(req: Request, res: Response): Promise<void> {
    try {
      const { CID } = req.params;
      const updateData = req.body;

      const company = await Company.findOneAndUpdate({ CID }, updateData, { new: true });
      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }

      res.status(200).json({ message: 'Company updated successfully', company });
    } catch (error) {
      res.status(500).json({ message: 'Error updating company', error });
    }
  }

  // Disable a company (set IsActive to false)
  static async disableCompany(req: Request, res: Response): Promise<void> {
    try {
      const { CID } = req.params;

      const company = await Company.findOneAndUpdate({ CID }, { IsActive: false }, { new: true });
      if (!company) {
        res.status(404).json({ message: 'Company not found' });
        return;
      }

      res.status(200).json({ message: 'Company disabled successfully', company });
    } catch (error) {
      res.status(500).json({ message: 'Error disabling company', error });
    }
  }
}
