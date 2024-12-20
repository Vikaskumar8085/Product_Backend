import asyncHandler from "express-async-handler";
import { Response } from "express";
import Candidate from "../../modals/Candidate/Candidate";
import Designation from "../../modals/Designation/Designation";
import Education from "../../modals/Eduction/Education";
import ReasonsForLeaving from "../../modals/ReasonForLeaving/ReasonForLeaving";
import sequelize from "../../dbconfig/dbconfig";
import Tag from "../../modals/Tag/Tag";
import Client from "../../modals/Client/Client";
import { Op } from "sequelize";
import { CustomRequest } from "../../typeReq/customReq";
import CandidateTags from "../../modals/CandidateTags/CandidateTags";
import { QueryTypes } from "sequelize";
const AnalyticalCtr = {
  // Candidate Distribution by Designation
  candidateDistribution: asyncHandler(async (req: CustomRequest, res: Response) => {
    const distribution = await Candidate.findAll({
      attributes: [
        'designationId',
        [sequelize.fn('COUNT', sequelize.col('Candidate.id')), 'count'], // Explicitly qualify 'id' with the table/alias
      ],
      group: ['designationId'],
      include: [
        {
          model: Designation,
          as: 'designation',
          attributes: ['title'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: distribution,
    });
  }),


  // Work Experience Analysis
  workExperienceAnalysis: asyncHandler(async (req, res: Response) => {
    const experienceDistribution: any[] = await Candidate.findAll({
        attributes: [
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 0 AND 1 THEN 1 ELSE 0 END")), '0-1 years'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 1 AND 3 THEN 1 ELSE 0 END")), '1-3 years'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 3 AND 5 THEN 1 ELSE 0 END")), '3-5 years'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp > 5 AND workExp <= 10 THEN 1 ELSE 0 END")), '5-10 years'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp > 10 THEN 1 ELSE 0 END")), '10+ years'],
        ],
        raw: true // This will return the result as a plain object
    });

    // Transform the result into the desired format
    const formattedResponse = [
        { experience_range: "0-1 years", count: experienceDistribution[0]['0-1 years'] || 0 },
        { experience_range: "1-3 years", count: experienceDistribution[0]['1-3 years'] || 0 },
        { experience_range: "3-5 years", count: experienceDistribution[0]['3-5 years'] || 0 },
        { experience_range: "5-10 years", count: experienceDistribution[0]['5-10 years'] || 0 },
        { experience_range: "10+ years", count: experienceDistribution[0]['10+ years'] || 0 }
    ];

    res.json(formattedResponse);
}),

  // Current CTC Analysis
  currentCTCAnalysis: asyncHandler(async (req: CustomRequest, res: Response) => {
    const ctcDistribution = await Candidate.findAll({
      attributes: [
        [
          sequelize.fn(
            'MIN',
            sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
          ),
          'minCTC',
        ],
        [
          sequelize.fn(
            'MAX',
            sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
          ),
          'maxCTC',
        ],
        [
          sequelize.fn(
            'AVG',
            sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
          ),
          'avgCTC',
        ],
      ],
    });

    res.status(200).json({
      success: true,
      data: ctcDistribution,
    });
  }),

  // Geographical Distribution of Candidates
  geographicalDistribution: asyncHandler(async (req, res: Response) => {
    const geoDistribution = await Candidate.findAll({
      attributes: ['currentLocation', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['currentLocation'],
    });
    res.json(geoDistribution);
  }),

  // Education Level Analysis
  educationLevelAnalysis: asyncHandler(async (req, res: Response) => {
    const educationDistribution = await Candidate.findAll({
        include: [
            {
            model: Education,
            as: 'education',
            attributes: [],
            },
        ],
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('education.ugCourse')), 'ugCount'],
            [sequelize.fn('COUNT', sequelize.col('education.pgCourse')), 'pgCount'],
            [sequelize.fn('COUNT', sequelize.col('education.postPgCourse')), 'postPgCount'],
        ],
    });
    res.json(educationDistribution);
  }),

  // Reasons for Leaving
  reasonsForLeaving: asyncHandler(async (req, res: Response) => {
    const reasonsDistribution = await ReasonsForLeaving.findAll({
      attributes: ['reason', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['reason'],
    });
    res.json(reasonsDistribution);
  }),

  // Client Status Analysis (Assuming you have a Client model)
  clientStatusAnalysis: asyncHandler(async (req, res: Response) => {
    // This is a placeholder. You need to implement the Client model and its relationships.
    const clientStatus = await Client.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
    });
    res.json(clientStatus);
  }),

  // Tag Analysis for Candidates
  tagAnalysis: asyncHandler(async (req, res: Response) => {
    const tagDistribution = await sequelize.query(`
      SELECT t.Tag_Name as tag, COUNT(ct.tagId) as count
      FROM Tag t
      INNER JOIN candidate_tags ct ON t.id = ct.tagId
      GROUP BY t.id, t.Tag_Name
    `, {
      type: QueryTypes.SELECT,
      raw: true
    });
  
    res.json(tagDistribution);
  }),

  // Candidate Age Distribution
  candidateAgeDistribution: asyncHandler(async (req, res: Response) => {
    const currentYear = new Date().getFullYear();
    const ageDistribution = await Candidate.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 25} AND ${currentYear - 20} THEN 1 ELSE 0 END`)), '20-25'],
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 30} AND ${currentYear - 26} THEN 1 ELSE 0 END`)), '26-30'],
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) BETWEEN ${currentYear - 35} AND ${currentYear - 31} THEN 1 ELSE 0 END`)), '31-35'],
        [sequelize.fn('SUM', sequelize.literal(`CASE WHEN YEAR(dob) < ${currentYear - 35} THEN 1 ELSE 0 END`)), '35+'],
      ],
    });
    res.json(ageDistribution);
  }),

  
 
};

export default AnalyticalCtr;