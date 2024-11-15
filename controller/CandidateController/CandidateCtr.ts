import asyncHandler from "express-async-handler";
import {Request, Response} from "express";
import Designation from "../../modals/Designation/Designation";
import {CustomRequest} from "../../typeReq/customReq";
import Candidate from "../../modals/Candidate/Candidate";
import {StatusCodes} from "http-status-codes";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import {Op, or} from "sequelize";
import {format} from "fast-csv";
import { Transaction } from 'sequelize';
import  sequelize  from '../../dbconfig/dbconfig';
import CreateCandidateRequest from '../../typeReq/CandidateType';
import Education from '../../modals/Eduction/Education';
import CandidateReasons from '../../modals/CandidateReasons/CandidateReasons';

const CandidateCtr = {
  // create Candidate ctr
  createCandidatectr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      const transaction: Transaction = await sequelize.transaction();
      try {
        const candidateData = req.body;
        if (!candidateData.name || !candidateData.email || !candidateData.contactNumber) {
          return res.status(400).json({
            success: false,
            message: 'Missing required fields'
          });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(candidateData.email)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email format'
          });
        }
              // Phone number validation (assuming 10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(candidateData.contactNumber)) {
        return res.status(400).json({
          success: false,
          message: 'Contact number must be 10 digits'
        });
      }
        //check designation existance if it is not exist then find or create
        const checkDesignation = await Designation.findByPk(candidateData.designationId);
        if (!checkDesignation) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Designation Not Found");
        }
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        //check Candidate existance
        const checkCandidate = await Candidate.findOne({
          where: {
            [Op.or]: [
              { email: candidateData.email },
              { contactNumber: candidateData.contactNumber },
              { whatsappNumber: candidateData.whatsappNumber }
            ]
          }
        });
        if (checkCandidate) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Candidate Already Exist");
        }
        const itemresp = await Candidate.create({
          name: candidateData.name,
          resumeTitle: candidateData.resumeTitle,
          contactNumber: candidateData.contactNumber,
          whatsappNumber: candidateData.whatsappNumber,
          email: candidateData.email,
          workExp: candidateData.workExp || "",
          currentCTC: candidateData.currentCTC,
          currentLocation: candidateData.currentLocation,
          state: candidateData.state,
          currentEmployeer: candidateData.currentEmployeer || "",
          postalAddress: candidateData.postalAddress || "",
          preferredLocation: candidateData.preferredLocation || "",
          dob: candidateData.dob || new Date(),
          lastActive: new Date(),
          remarks: candidateData.remarks || "",
          UserId: req.user.id,
          designationId: checkDesignation.id,
          regionId: candidateData.regionId
        }, { transaction });

        if (candidateData.education) {
          await Education.create({
            candidateId: itemresp.id,
            ugCourse: candidateData.education.ugCourse || "",
            pgCourse: candidateData.education.pgCourse || "",
            id: 1
          }, { transaction });
        }
     // Create candidate reasons if provided
     if (candidateData.reasonIds && candidateData.reasonIds.length > 0) {
      const reasonsData = candidateData.reasonIds.map((reasonId:any, index:any) => ({
        candidateId: itemresp.id,
        reasonId: reasonId,
        
        order: index + 1
      }));

      await CandidateReasons.bulkCreate(reasonsData, { transaction });
    }

    await transaction.commit();
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
          throw new Error("Candidate Not Found");
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

        await checkDesigation.update(req.body);
        return res
          .status(StatusCodes.OK)
          .json({message: "Update Candidate succesfully", success: true});
      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
  importCandidates: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        if (!req.file) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: "No file uploaded"});
        }

        const filePath = path.join(
          __dirname,
          "../../uploads/",
          req.file.filename
        );
        const candidatesData: any[] = [];
        console.log(`Processing file: ${filePath}`);

        // Read the CSV file
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row: any) => {
            candidatesData.push(row);
          })
          .on("end", async () => {
            let importedCount = 0;
            const errors: string[] = [];

            // Process the candidates data
            for (const data of candidatesData) {
              try {
                // Basic validations
                if (
                  !data["Candidate Name"] ||
                  !data.Email ||
                  !data["Contact No"] ||
                  !data["Whatsapp No"] ||
                  !data.Designation
                ) {
                  errors.push(
                    `Missing required fields for candidate: ${
                      data["Candidate Name"] || "Unknown"
                    }`
                  );
                  continue;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.Email)) {
                  errors.push(
                    `Invalid email format for candidate: ${data["Candidate Name"]} (${data.Email})`
                  );
                  continue;
                }

                // Validate phone numbers (basic check)
                const phoneRegex = /^\d{10}$/;
                if (
                  !phoneRegex.test(data["Contact No"]) ||
                  !phoneRegex.test(data["Whatsapp No"])
                ) {
                  errors.push(
                    `Invalid contact number(s) for candidate: ${data["Candidate Name"]}`
                  );
                  continue;
                }

                // Check if Designation exists or create a new one
                const [designation] = await Designation.findOrCreate({
                  where: {title: data.Designation},
                });

                // Check if Candidate already exists (by email or contact number)
                const existingCandidate = await Candidate.findOne({
                  where: {
                    [Op.or]: [
                      {email: data.Email},
                      {contactNumber: data["Contact No"]},
                    ],
                  },
                });
                if (existingCandidate) {
                  errors.push(
                    `Candidate already exists: ${data["Candidate Name"]} (${data.Email})`
                  );
                  continue;
                }

        //         // Create new Candidate
        //         name: candidateData.name,
        // resumeTitle: candidateData.resumeTitle,
        // contactNumber: candidateData.contactNumber,
        // whatsappNumber: candidateData.whatsappNumber,
        // email: candidateData.email,
        // workExp: candidateData.workExp,
        // currentCTC: candidateData.currentCTC,
        // currentLocation: candidateData.currentLocation,
        // state: candidateData.state,
        // currentEmployeer: candidateData.currentEmployeer,
        // postalAddress: candidateData.postalAddress,
        // preferredLocation: candidateData.preferredLocation,
        // dob: candidateData.dob,
        // remarks: candidateData.remarks,
        // UserId: candidateData.UserId,
        // designationId: candidateData.designationId,
        // regionId: candidateData.regionId
                await Candidate.create({
                  name: data["Candidate Name"],
                  resumeTitle: data["Resume Title"] || "",
                  contactNumber: data["Contact No"],
                  whatsappNumber: data["Whatsapp No"],
                  email: data.Email,
                  workExp: data["Work Exp"] || "",
                  currentCTC: data["Current Annual Salary / CTC"],
                  currentLocation: data["Current Location"] || "",
                  state: data.State || "",
                  currentEmployeer:data["currentEmployeer"] || "",
                  postalAddress: data["Postal Address"] || "",
                  preferredLocation: data["Preferred Location"] || "",
                  dob: new Date(data["Date of Birth"]),
                  designationId: designation.id,
                  lastActive: new Date(),
                  remarks: data["Remarks"] || "",
                  regionId: 1,
                  UserId: req.user.id,
                  
                });

                importedCount++;
              } catch (err: any) {
                errors.push(
                  `Failed to import candidate: ${data["Candidate Name"]}. Error: ${err.message}`
                );
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
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({message: error.message});
      }
    }
  ),
  returnCandidateCsvFile: asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      try {
        const candidateFields = [
          "Candidate Name",
          "Resume Title",
          "Contact No",
          "Whatsapp No",
          "Email",
          "Work Exp",
          "Current Annual Salary / CTC",
          "Current Location",
          "currentEmployeer",
          "State",
          "Region",
          "U.G. Course",
          "P.G. Course",
          "Post P. G. Course",
          "Postal Address",
          "Preferred Location",
          "Date of Birth",
          "Designation",
          
        ];
        // Generate a CSV file dynamically
        const filePath = path.join(__dirname, "../../uploads/template.csv");

        // Create a write stream to save the CSV
        const writeStream = fs.createWriteStream(filePath);

        // Write data using fast-csv
        const csvStream = format({headers: true});
        csvStream.pipe(writeStream);

        // Write header columns to CSV
        csvStream.write(candidateFields);

        // Optionally include a few rows as sample data

        csvStream.end();

        writeStream.on("finish", () => {
          // Send the CSV file as a response
          res.download(filePath, "candidate-template.csv", (err) => {
            if (err) {
              console.error(err);
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Failed to download template CSV",
              });
            }
          });
        });
      } catch (error: any) {
        console.error(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({error: error.message});
      }
    }
  ),
};

export default CandidateCtr;
