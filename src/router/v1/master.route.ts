import express from 'express';
import { MasterController } from '../../controllers';

const masterRoute = express.Router();

// CRUD routes for Company
masterRoute.post('/company/create', MasterController.createCompany); // Create a new company
masterRoute.get('/company/all', MasterController.getAllCompanies); // Get all active companies
masterRoute.get('/company/:CID', MasterController.getCompanyById); // Get a company by CID
masterRoute.put('/company/:CID', MasterController.updateCompany); // Update a company by CID
masterRoute.delete('/company/:CID', MasterController.disableCompany); // Disable a company (set IsActive to false)

export default masterRoute;
