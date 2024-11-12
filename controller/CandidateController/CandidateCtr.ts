import asyncHandler from "express-async-handler";
import {Request, Response} from "express";
import User from "../../modals/User/User";
import stripBom from "strip-bom-stream";
import Designation from "../../modals/Designation/Designation";
import {CustomRequest} from "../../typeReq/customReq";
import Candidate from "../../modals/Candidate/Candidate";
import {StatusCodes} from "http-status-codes";
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import { format } from 'fast-csv';
 


const CandidateCtr = {
  // create Candidate ctr
  createCandidatectr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {

        const { name , resumeTitle, contactNumber, whatsappNumber, email, workExp, currentCTC, currentLocation, state, preferredLocation, dob, designation, UserId} = req.body;
        //check designation existance if it is not exist then find or create
        const checkDesignation = await Designation.findOrCreate({where: {title: designation}});
        
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        //check Candidate existance
        const checkCandidate = await Candidate.findOne({where: {email}});
        if (checkCandidate) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Candidate Already Exist");
        }
        const itemresp = await Candidate.create(
            {
                name,
                resumeTitle,
                contactNumber,
                whatsappNumber,
                email,
                workExp,
                currentCTC,
                currentLocation,
                state,
                preferredLocation,
                dob,
                designationId: checkDesignation[0].id,
                UserId
            }
        ) ;

        if (!itemresp) {
          res.status(400);
          throw new Error("Bad Request");
        }

        return res
          .status(StatusCodes.OK)
          .json({success: true, message: "Candidate created Successfully"});
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
  //   fetch Candidate ctr
  fetchCandidateCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // const userExists: string | any = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        const fetchitems = await Candidate.findAll();
        if (!fetchitems) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        }
        return res.status(StatusCodes.OK).json({
          message: "Fetch Candidate Successfully",
          success: true,
          result: fetchitems,
        });
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),

  //   remove Candidate ctr
  reomveCandidateCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // const userExists: string | any = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }

        const removeitem = await Candidate.findByPk(req.params.id);
        if (!removeitem) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Item not Found");
        } else {
          removeitem.destroy();
        }
        return res.status(StatusCodes.OK).json({
          message: "Candidate items remove successfully",
          success: true,
        });
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
  //   edit desingation ctr
  editCandidateCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<void | any> => {
      try {
        // const userExists: string | any = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }

        const checkDesigation = await Candidate.findByPk(req.params.id);
        if (!checkDesigation) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Bad Request");
        }
        //check if Candidate exist
        
        await checkDesigation.update(
            req.body
        )
        return res
          .status(StatusCodes.OK)
          .json({message: "Update Candidate succesfully", success: true});
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
  importCandidates: asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../../uploads/', req.file.filename);
    const candidatesData: any[] = [];
    console.log(`Processing file: ${filePath}`);

    // Read the CSV file
    fs.createReadStream(filePath).pipe(stripBom())
      .pipe(csv())
      .on('data', (row: any) => {
        candidatesData.push(row);
      })
      .on('end', async () => {
        let importedCount = 0;
        const errors: string[] = [];

        // Process the candidates data
        for (const data of candidatesData) {
          try {
            // Basic validations
            if (
              !data['Candidate Name'] ||
              !data.Email ||
              !data['Contact No'] ||
              !data['Whatsapp No'] ||
              !data.Designation
            ) {
              errors.push(`Missing required fields for candidate: ${data['Candidate Name'] || 'Unknown'}`);
              continue;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.Email)) {
              errors.push(`Invalid email format for candidate: ${data['Candidate Name']} (${data.Email})`);
              continue;
            }

            // Validate phone numbers (basic check)
            const phoneRegex = /^\d{10}$/;
            if (
              !phoneRegex.test(data['Contact No']) ||
              !phoneRegex.test(data['Whatsapp No'])
            ) {
              errors.push(`Invalid contact number(s) for candidate: ${data['Candidate Name']}`);
              continue;
            }

            // Check if Designation exists or create a new one
            const [designation] = await Designation.findOrCreate({
              where: { title: data.Designation },
            });

            // Check if Candidate already exists (by email or contact number)
            const existingCandidate = await Candidate.findOne({
              where: {
                [Op.or]: [
                  { email: data.Email },
                  { contactNumber: data['Contact No'] },
                ],
              },
            });
            if (existingCandidate) {
              errors.push(`Candidate already exists: ${data['Candidate Name']} (${data.Email})`);
              continue;
            }

            // Create new Candidate
            await Candidate.create({
              name: data['Candidate Name'],
              resumeTitle: data['Resume Title'] || '',
              contactNumber: data['Contact No'],
              whatsappNumber: data['Whatsapp No'],
              email: data.Email,
              workExp: data['Work Exp'] || '',
              currentCTC: data['Current Annual Salary / CTC'],
              currentLocation: data['Current Location'] || '',
              state: data.State || '',
              preferredLocation: data['Preferred Location'] || '',
              dob:  new Date(data['Age/Date of Birth']),
              designationId: designation.id,
              UserId: req.body.UserId || 1, // Assuming UserId is passed in the request body
            });

            importedCount++;
          } catch (err: any) {
            errors.push(`Failed to import candidate: ${data['Candidate Name']}. Error: ${err.message}`);
          }
        }

        // Delete the file after processing
        fs.unlinkSync(filePath);

        // Return the response with success and error details
        return res.status(StatusCodes.OK).json({
          message: `${importedCount} candidates imported successfully`,
          errors,
        });
      });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
  }),
  returnCandidateCsvFile: asyncHandler(async (req: Request, res: Response): Promise<any> => {
   try {
    const candidateFields = [
  'Candidate Name',
  'Resume Title',
  'Contact No',
  'Whatsapp No',
  'Email',
  'Work Exp',
  'Current Annual Salary / CTC',
  'Current Location',
  'State',
  'Preferred Location',
  'Age/Date of Birth',
  'Designation',
];
    // Generate a CSV file dynamically
    const filePath = path.join(__dirname, '../../uploads/template.csv');

    // Create a write stream to save the CSV
    const writeStream = fs.createWriteStream(filePath);

    // Write data using fast-csv
    const csvStream = format({ headers: true });
    csvStream.pipe(writeStream);

    // Write header columns to CSV
    csvStream.write(candidateFields);

    // Optionally include a few rows as sample data
    

    csvStream.end();

    writeStream.on('finish', () => {
      // Send the CSV file as a response
      res.download(filePath, 'candidate-template.csv', (err) => {
        if (err) {
          console.error(err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to download template CSV' });
        }
      });
    });
  } catch (error: any) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
  }
  )

};

export default CandidateCtr;
