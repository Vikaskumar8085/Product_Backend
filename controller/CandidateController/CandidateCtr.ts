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
import CandidateTags from '../../modals/CandidateTags/CandidateTags';
import Tag from '../../modals/Tag/Tag';
import User from '../../modals/User/User';
import Client from '../../modals/Client/Client';
import ClientTags from "../../modals/ClientTags";
const CandidateCtr = {
  // create Candidate ctr
  createCandidatectr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      // const transaction: Transaction = await sequelize.transaction();
      try {
        
        const {name,resumeTitle,contactNumber,whatsappNumber,email,workExp,currentCTC,currentLocation,state,currentEmployeer,postalAddress,preferredLocation,dob,remarks,designationId,country,city,reason1,reason2,reason3,tags,education} = req.body;
       if (!name || !email || !contactNumber || !whatsappNumber) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Bad Request");
       }
       const checkDesignation = await Designation.findByPk(designationId);
       if (!checkDesignation) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Designation Not Found");
       }
       //if email or contact number already exist
       const existingCandidate = await Candidate.findOne({
        where: {
          [Op.or]: [{email}, {contactNumber}]
        }
       })
       if (existingCandidate) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Candidate already exists");
       }

       const newCandidate = await Candidate.create({name,resumeTitle,contactNumber,whatsappNumber,email,workExp,currentCTC,currentLocation,state,currentEmployeer,postalAddress,preferredLocation,dob,remarks,designationId,country,city,reason1,reason2,reason3,lastActive:new Date(),UserId:req.user.id});

       //now we need to store candidatetags and education
       if (tags) {
        
        for (const tag of tags) {
          await CandidateTags.create(
            {
              candidateId:newCandidate.id,
              tagId:tag
            }
          )
        }
       }
       // Store education records if present
    if (education) {
      // education: { ugCourse: 'dfg', pgCourse: 'edrtgh', postPgCourse: 'rtgyh' }
      const educationData = {
        candidateId: newCandidate.id,
        ugCourse: education.ugCourse || null,
        pgCourse: education.pgCourse || null,
        postPgCourse: education.postPgCourse || null
      };
      const newEducation = await Education.create(educationData);

    }
    const tagNAme = async (tags: number[]) => {
      const tagNames: string[] = [];
      for (const tagId of tags) {
        const tag:any = await Tag.findByPk(tagId);
        tagNames.push(tag)
      }
      return tagNames;
    }
    const tagsName = await tagNAme(tags);
    // we need to append the tags and education into newCandidate extend the newCandidate object
    const newCandidateExtended = {
      ...newCandidate.toJSON(),
        designation: checkDesignation.toJSON(),
        //find tags name using id
        tags: tagsName || [],
        education: education || {}
    };
    return res.status(StatusCodes.CREATED).json({
      message: "Candidate created successfully",  
      success: true,
      result: newCandidateExtended
    });

      } catch (error: any) {
        throw new Error(error);
      }
    }
  ),
  //   fetch Candidate ctr
  fetchCandidateCtr: asyncHandler(
  async (req: CustomRequest, res: Response): Promise<any> => {
    try {
      const userExists: string | any = await User.findOne({
        where: {id: req.user.id},
        //exclude password field
        attributes: {exclude: ["Password"]},
      });
      if (!userExists) {
        res.status(404);
        throw new Error("User Not Found Please Login !");
      }
      let fetchitems;
      if (userExists.Type === "client") {
        
        const clienId = await Client.findOne({
          where: {userId: req.user.id},
        });
        if (!clienId) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Not Found");
        }
        const clientTags = await ClientTags.findAll({
          where: {ClientId: clienId.id},
          attributes: ["tagId"],
        });
        if (!clientTags) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Tags Not Found");
        }
        
      //now we need to fetch all the candidates based on client tags
      fetchitems = await Candidate.findAll({
        include: [
          { model: Designation, as: "designation" },
          { model: Education, as: "education" },
          { 
            model: Tag,  // Include Tag model instead of CandidateTags
            as: "tags",
            where: {
             [Op.or]:{
              id: clientTags.map((tag: any) => tag.tagId),
              Created_By: req.user.id
             }
            }
          }
        ]
      });
      

      }
    else {
      fetchitems = await Candidate.findAll({
        include: [
          { model: Designation, as: "designation" },
          { model: Education, as: "education" },
          { 
            model: Tag,  // Include Tag model instead of CandidateTags
            
            as: "tags"
          }
        ]
      });
    }
      if (!fetchitems || fetchitems.length === 0) {
        res.status(StatusCodes.NOT_FOUND);
        throw new Error("Candidates Not Found");
      }

      return res.status(StatusCodes.OK).json({
        message: "Fetch Candidate Successfully",
        success: true,
        result: fetchitems,
      });

    } catch (error: any) {
      console.error(error);
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
        const {name,resumeTitle,contactNumber,whatsappNumber,email,workExp,currentCTC,currentLocation,state,currentEmployeer,postalAddress,preferredLocation,dob,remarks,designationId,country,city,reason1,reason2,reason3,tags,education} = req.body;
        const checkDesignation = await Designation.findByPk(designationId);
        if (!checkDesignation) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Designation Not Found");
        }
        const checkCandidate = await Candidate.findByPk(req.params.id);
        if (!checkCandidate) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Candidate Not Found");
        }
        await checkCandidate.update({name,resumeTitle,contactNumber,whatsappNumber,email,workExp,currentCTC,currentLocation,state,currentEmployeer,postalAddress,preferredLocation,dob,remarks,designationId,country,city,reason1,reason2,reason3,lastActive:new Date(),UserId:req.user.id});
        //now we need to store candidatetags and education
        if (tags) {
          // Remove existing tags
          await CandidateTags.destroy({ where: { candidateId: checkCandidate.id } });

          for (const tag of tags) {
            await CandidateTags.create(
              {
                candidateId: checkCandidate.id,
                tagId: tag
              }
            )
          }
        }
        // Store education records if present
        if (education) {
          // Remove existing education
          await Education.destroy({ where: { candidateId: checkCandidate.id } });

          const educationData = {
            candidateId: checkCandidate.id,
            ugCourse: education.ugCourse || null,
            pgCourse: education.pgCourse || null,
            postPgCourse: education.postPgCourse || null
          };
          const newEducation = await Education.create(educationData);
        }
        // we need to append the tags and education into newCandidate extend the newCandidate object
        const tagNAme = async (tags: number[]) => {
          const tagNames: string[] = [];
          for (const tagId of tags) {
            const tag:any = await Tag.findByPk(tagId);
            tagNames.push(tag)
          }
          return tagNames;
        }
        const tagsName = await tagNAme(tags);
        const updatedCandidate = {
          ...checkCandidate.toJSON(),
          designation: checkDesignation.toJSON(),
          tags: tagsName || [],
          education: education || {}
        };
        return res.status(StatusCodes.OK).json({
          message: "Candidate updated successfully",
          success: true,
          result: updatedCandidate
        
        });
      }
      catch (error: any) {
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

        
                const newCandidate = await Candidate.create({
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
                  // regionId: 1,
                  country: data.Country || "",
                  city: data.City || "",
                  reason1: data.reason1 || "",
                  reason2: data.reason2 || "",
                  reason3: data.reason3 || "",
                  UserId: req.user.id,
                  
                });
                if (data.Tags && typeof data.Tags === 'string') {
  // Split the string by commas, then trim whitespace around each tag
  const tags: string[] = data.Tags.split(',').map((tag: string) => tag.trim());

  // Iterate over the array of tags
  for (const tagName of tags) {
    // Ensure the tag is not an empty string
    if (tagName) {
      try {
        // Find or create the tag in the Tag table
        const [tagData] = await Tag.findOrCreate({
          where: { Tag_Name: tagName }
        });

        // Create the association between the candidate and the tag
        await CandidateTags.create({
          candidateId: newCandidate.id,
          tagId: tagData.id
        });

        console.log(`Tag "${tagName}" processed successfully.`);
      } catch (err) {
        console.error(`Error processing tag "${tagName}":`, err);
      }
    } else {
      console.warn('Empty tag encountered, skipping.');
    }
  }
} else {
  console.warn('Invalid Tags format: Expected a comma-separated string.');
}

                if (data.UG || data.PG || data.PostPG) {
  // Only create Education data if at least one course is provided
  const educationData = {
    candidateId: newCandidate.id,
    ugCourse: data.UG || null,  // Use `null` if the course is not provided
    pgCourse: data.PG || null,
    postPgCourse: data['Post PG'] || null
  };

  try {
    // Only create Education entry if at least one course is provided
    await Education.create(educationData);
    console.log('Education data successfully added for candidate', newCandidate.id);
  } catch (error) {
    console.error('Error adding education data:', error);
  }
} else {
  console.log('No valid education data provided for candidate', newCandidate.id);
}


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
           if (errors.length > 0) {
              return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Failed to import candidates",
                success: false,
                errors,
              });
            }
            else {
              return res.status(StatusCodes.CREATED).json({
                message: `${importedCount} Candidate Successfully Imported`,
                success: true,
                
              });
            }
           
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
          "Country",
          "City",
          "Postal Address",
          "Preferred Location",
          "Date of Birth",
          "Designation",
          "UG",
          "PG",
          "Post PG",
          "Tags",
          
          
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
