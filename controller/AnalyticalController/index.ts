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
import ClientTags from "../../modals/ClientTags";
import User from "../../modals/User/User";
import { QueryTypes } from "sequelize";
import ReasonSaveAnswer from "../../modals/ReasonSaveAnswer/ReasonSaveAnswer";
import ReasonAnswer from "../../modals/ReasonAnswer/ReasonAnswer";
interface ExperienceDistribution {
  designationId: number;
  count: number;
}

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
    }) as unknown as ExperienceDistribution[];

    res.status(200).json({
      success: true,
      data: distribution,
    });
  }),


  // Work Experience Analysis
  workExperienceAnalysis: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          return res.status(404).json({ success: false, message: 'User  not found' });

      }


      interface ExperienceDistribution {
        '0-1 years': number;
        '1-3 years': number;
        '3-5 years': number;
        '5-10 years': number;
        '10+ years': number;
      }

      let experienceDistribution: any[];


      if (user.Type === 'superadmin') {

          experienceDistribution = await Candidate.findAll({

              attributes: [

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 0 AND 1 THEN 1 ELSE 0 END")), '0-1 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 1 AND 3 THEN 1 ELSE 0 END")), '1-3 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 3 AND 5 THEN 1 ELSE 0 END")), '3-5 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp > 5 AND workExp <= 10 THEN 1 ELSE 0 END")), '5-10 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp > 10 THEN 1 ELSE 0 END")), '10+ years'],

              ],

              raw: true // This will return the result as a plain object

          });

      } else {

          const client = await Client.findOne({ where: { userId: req.user.id } });


          if (!client) {

              return res.status(404).json({ success: false, message: "Client not found" });

          }


          const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

          const tagIds = clientTags.map((tag) => tag.tagId);


          experienceDistribution = await Candidate.findAll({

              attributes: [

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 0 AND 1 THEN 1 ELSE 0 END")), '0-1 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 1 AND 3 THEN 1 ELSE 0 END")), '1-3 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp BETWEEN 3 AND 5 THEN 1 ELSE 0 END")), '3-5 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp > 5 AND workExp <= 10 THEN 1 ELSE 0 END")), '5-10 years'],

                  [sequelize.fn('SUM', sequelize.literal("CASE WHEN workExp > 10 THEN 1 ELSE 0 END")), '10+ years'],

              ],

              where: {

                  [Op.or]: {

                      '$tags.id$': tagIds, // Ensure candidates are filtered by the client's tags

                  },

              },

              include: [{

                  model: Tag,

                  as: "tags",

                  required: true, // Ensure that only candidates with tags are included

              }],

              raw: true // This will return the result as a plain object

          });

      }


      // Transform the result into the desired format

      const formattedResponse = [

          { experience_range: "0-1 years", count: experienceDistribution[0]['0-1 years'] || 0 },

          { experience_range: "1-3 years", count: experienceDistribution[0]['1-3 years'] || 0 },

          { experience_range: "3-5 years", count: experienceDistribution[0]['3-5 years'] || 0 },

          { experience_range: "5-10 years", count: experienceDistribution[0]['5-10 years'] || 0 },

          { experience_range: "10+ years", count: experienceDistribution[0]['10+ years'] || 0 }

      ];


      return res.json({ success: true, data: formattedResponse });

  } catch (error: any) {

      return res.status(500).json({ success: false, message: error.message });

  }
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
            'ROUND',
            sequelize.fn(
              'AVG',
              sequelize.cast(sequelize.fn('REPLACE', sequelize.col('currentCTC'), 'LPA', ''), 'UNSIGNED')
            ),
            2
          ),
          'avgCTC',
        ],
      ],
      where: {
        currentCTC: {
          [Op.not]: '',
          [Op.ne]: '',
          [Op.notLike]: '%null%'
        }
      }
    });
  
    res.status(200).json({
      success: true,
      data: ctcDistribution,
    });
  }),

 
  geographicalDistribution: asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    try {

      const user = await User.findOne({

          where: { id: req.user.id },

          attributes: ['id', 'Type'],

      });


      if (!user) {

          return res.status(404).json({ success: false, message: 'User  not found' });

      }


      let geoDistribution;


      if (user.Type === 'superadmin') {

          geoDistribution = await Candidate.findAll({

              attributes: ['state', [sequelize.fn('COUNT', sequelize.col('Candidate.id')), 'count']], // Specify the table name

              group: ['state'],

          });

      } else {

          const client = await Client.findOne({ where: { userId: req.user.id } });


          if (!client) {

              return res.status(404).json({ success: false, message: "Client not found" });

          }


          const clientTags = await ClientTags.findAll({ where: { ClientId: client.id } });

          const tagIds = clientTags.map((tag) => tag.tagId);


          geoDistribution = await Candidate.findAll({

              attributes: ['state', [sequelize.fn('COUNT', sequelize.col('Candidate.id')), 'count']], // Specify the table name

              group: ['state'],

              include: [{

                  model: Tag,

                  as: "tags",
                  attributes: [],
                  where: {

                      [Op.or]: {

                          id: tagIds,

                          Created_By: req.user.id,

                      },

                  },

              }],

          });

      }


      res.status(200).json({ success: true, data: geoDistribution });

  } catch (error: any) {

      res.status(500).json({ success: false, message: error.message });

  }
  }
  ),

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
  
  reasonsForLeavingBarChart: asyncHandler(async (req: any, res: Response) => {
    const reasons = await ReasonsForLeaving.findAll({
      attributes: ['id', 'reason'],  // Get reason and its id
    });
  
    // Aggregate the frequency of each reason
    const reasonsCounts = await Promise.all(
      reasons.map(async (reason) => {
        const count = await ReasonSaveAnswer.count({
          where: {
            questionId: reason.id,  // The questionId is the reason's ID
          },
          include: [
            {
              model: ReasonAnswer,
              as: 'ReasonAnswer',  // Use the correct alias here
              required: true,  // This ensures we only count records that have an associated ReasonAnswer
            }
          ]
        });
  
        return { reason: reason.reason, count };
      })
    );
  
    // Prepare data for the bar chart
    const chartData = {
      labels: reasonsCounts.map((item) => item.reason),
      series: [{
        name: 'Frequency',
        data: reasonsCounts.map((item) => item.count),
      }],
    };
  
    res.json(chartData);
  }),
  
  


  answerDistributionPieChart: asyncHandler(async (req, res: Response) => {
    const { questionId } = req.params;  // Get the questionId (reasonId)
  
    // Find all possible answers from ReasonAnswer table
    const answers = await ReasonAnswer.findAll({
      attributes: ['id', 'Reason_answer'],  // Correct column name: 'Reason_answer'
    });
  
    // Count the number of times each answer was selected for the given questionId
    const answerCounts = await Promise.all(
      answers.map(async (answer) => {
        const count = await ReasonSaveAnswer.count({
          where: {
            answer: answer.id,  // Referring to the answer id
            questionId: questionId,  // Referring to the questionId
          },
        });
  
        return { answer: answer.Reason_answer, count };  // Use 'Reason_answer' to match the column name
      })
    );
  
    // Prepare data for the pie chart
    const chartData = {
      labels: answerCounts.map((item) => item.answer),
      series: answerCounts.map((item) => item.count),
    };
  
    res.json(chartData);
  }),
  
// // Line Chart: Answer Trends Over Time
// answerTrendsLineChart : asyncHandler(async (req, res: Response) => {
//   const { questionId } = req.params;  // Get the questionId (reasonId)
//   const { startDate, endDate } = req.query;  // Optional: filter by date range

//   const answers = await ReasonAnswer.findAll({
//       attributes: ['id', 'answer'],  // Assuming 'answer' column contains the answer options
//   });

//   // Query to count answers over time (using createdAt)
//   const answerTrends = await Promise.all(
//       answers.map(async (answer) => {
//           const trends = await ReasonSaveAnswer.findAll({
//               attributes: [
//                   [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
//                   [sequelize.fn('COUNT', sequelize.col('answer')), 'count'],
//               ],
//               where: {
//                   answer: answer.id,
//                   questionId: questionId,
//                   createdAt: {
//                       [sequelize.Op.between]: [new Date(startDate), new Date(endDate)],  // Date filter
//                   },
//               },
//               group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
//               order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
//           });

//           return {
//               name: answer.answer,
//               data: trends.map((trend) => ({
//                   x: trend.date,
//                   y: trend.count,
//               })),
//           };
//       })
//   );

//   // Prepare data for the line chart
//   const chartData = {
//       series: answerTrends,
//       xaxis: {
//           type: 'datetime',
//       },
//   };

//   res.json(chartData);
// }),
// // Heatmap: Answer Distribution for Each Reason
// answerDistributionHeatmap : asyncHandler(async (req, res: Response) => {
//   const reasons = await ReasonsForLeaving.findAll({
//       attributes: ['id', 'reason'],
//   });

//   // For each reason, calculate answer distribution
//   const heatmapData = await Promise.all(
//       reasons.map(async (reason) => {
//           const answers = await ReasonAnswer.findAll({
//               attributes: ['id', 'answer'],
//           });

//           const answerCounts = await Promise.all(
//               answers.map(async (answer) => {
//                   const count = await ReasonSaveAnswer.count({
//                       where: {
//                           answer: answer.id,
//                           questionId: reason.id,
//                       },
//                   });

//                   return { x: reason.reason, y: answer.answer, value: count };
//               })
//           );

//           return answerCounts;
//       })
//   );

//   // Flatten and prepare the heatmap data
//   const chartData = heatmapData.flat().map((item) => ({
//       x: item.x,
//       y: item.y,
//       value: item.value,
//   }));

//   res.json({ series: chartData });
// }),
// // Stacked Area Chart: Answer Distribution Over Time
// answerDistributionStackedAreaChart : asyncHandler(async (req, res: Response) => {
//   const { startDate, endDate } = req.query;  // Optional: filter by date range

//   const reasons = await ReasonsForLeaving.findAll({
//       attributes: ['id', 'reason'],
//   });

//   // Fetch answers and their distribution over time
//   const answerTrends = await Promise.all(
//       reasons.map(async (reason) => {
//           const answers = await ReasonAnswer.findAll({
//               attributes: ['id', 'answer'],
//           });

//           const trends = await Promise.all(
//               answers.map(async (answer) => {
//                   const trendData = await ReasonSaveAnswer.findAll({
//                       attributes: [
//                           [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
//                           [sequelize.fn('COUNT', sequelize.col('answer')), 'count'],
//                       ],
//                       where: {
//                           answer: answer.id,
//                           questionId: reason.id,
//                           createdAt: {
//                               [sequelize.Op.between]: [new Date(startDate), new Date(endDate)],  // Date filter
//                           },
//                       },
//                       group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
//                       order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
//                   });

//                   return {
//                       name: answer.answer,
//                       data: trendData.map((data) => ({
//                           x: data.date,
//                           y: data.count,
//                       })),
//                   };
//               })
//           );

//           return trends;
//       })
//   );

//   // Prepare data for the stacked area chart
//   const chartData = {
//       series: answerTrends.flat(),
//       xaxis: {
//           type: 'datetime',
//       },
//   };

//   res.json(chartData);
// })
  
 
};

export default AnalyticalCtr;