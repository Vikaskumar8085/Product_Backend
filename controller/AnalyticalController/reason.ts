import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Op, WhereOptions, Sequelize, QueryTypes } from 'sequelize';
import sequelize from '../../dbconfig/dbconfig';
import ReasonSaveAnswer from '../../modals/ReasonSaveAnswer/ReasonSaveAnswer';
import ReasonsForLeaving from '../../modals/ReasonForLeaving/ReasonForLeaving';
import ReasonAnswer from '../../modals/ReasonAnswer/ReasonAnswer';
import Candidate from '../../modals/Candidate/Candidate';

const answerCandidateController = {
    // Get distribution of answers/reasons across all candidates
    getAnswerDistribution: asyncHandler(async (req: Request, res: Response) => {
        const distribution = await ReasonSaveAnswer.findAll({
            attributes: [
                'answer',
                [sequelize.fn('COUNT', sequelize.col('candidateId')), 'candidateCount']
            ],
            include: [{
                model: ReasonAnswer,
                attributes: ['Reason_answer'],
                required: true
            }],
            group: ['answer', 'ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
            raw: true
        });

        res.json(distribution);
    }),

    // Get most common answer combinations per candidate
    getCommonAnswerCombinations: asyncHandler(async (req: Request, res: Response) => {
        const combinations = await sequelize.query(`
            SELECT 
                GROUP_CONCAT(ra.Reason_answer) as answer_combination,
                COUNT(DISTINCT rsa.candidateId) as candidate_count
            FROM ReasonSaveAnswer rsa
            JOIN ReasonAnswer ra ON rsa.answer = ra.id
            GROUP BY rsa.candidateId
            HAVING candidate_count > 1
            ORDER BY candidate_count DESC
            LIMIT 10
        `, {
            type: QueryTypes.SELECT
        });

        res.json(combinations);
    }),

    // Get answers by candidate demographics (if applicable)
    getAnswersByDemographics: asyncHandler(async (req: Request, res: Response) => {
        const demographics = await sequelize.query(`
            SELECT 
                ra.Reason_answer,
                CASE 
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 25 THEN 'Under 25'
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 35 THEN '25-35'
                    WHEN TIMESTAMPDIFF(YEAR, c.dob, CURDATE()) < 45 THEN '35-45'
                    ELSE 'Over 45'
                END as age_group,
                COUNT(*) as count
            FROM ReasonSaveAnswer rsa
            JOIN ReasonAnswer ra ON rsa.answer = ra.id
            JOIN candidates c ON rsa.candidateId = c.id
            WHERE c.dob IS NOT NULL
            GROUP BY ra.Reason_answer, age_group
            ORDER BY ra.Reason_answer, age_group
        `, {
            type: QueryTypes.SELECT
        });
    
        res.json(demographics);
    }),

    // Get answer trends over time with candidate counts
    getAnswerTrends: asyncHandler(async (req: Request, res: Response) => {
        const { startDate, endDate } = req.query;
        
        const whereClause: WhereOptions<any> = {
            createdAt: {
                [Op.between]: [
                    startDate || '2000-01-01',
                    endDate || new Date()
                ]
            }
        };

        const trends = await ReasonSaveAnswer.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('ReasonSaveAnswer.createdAt'), '%Y-%m'), 'month'],
                'answer',
                [sequelize.fn('COUNT', sequelize.col('candidateId')), 'candidate_count']
            ],
            where: whereClause,
            include: [{
                model: ReasonAnswer,
                attributes: ['Reason_answer'],
                required: true
            }],
            group: [
                sequelize.fn('DATE_FORMAT', sequelize.col('ReasonSaveAnswer.createdAt'), '%Y-%m'),
                'answer',
                'ReasonAnswer.id',
                'ReasonAnswer.Reason_answer'
            ],
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('ReasonSaveAnswer.createdAt'), '%Y-%m'), 'ASC']],
            raw: true
        });

        res.json(trends);
    }),

    // Get candidate statistics per answer
    getCandidateStatsPerAnswer: asyncHandler(async (req: Request, res: Response) => {
        const stats = await ReasonAnswer.findAll({
            attributes: [
                'id',
                'Reason_answer',
                [sequelize.fn('COUNT', sequelize.col('ReasonSaveAnswers.candidateId')), 'total_candidates'],
                [
                    sequelize.fn(
                        'COUNT',
                        sequelize.fn('DISTINCT', sequelize.col('ReasonSaveAnswers.candidateId'))
                    ),
                    'unique_candidates'
                ]
            ],
            include: [{
                model: ReasonSaveAnswer,
                attributes: [],
                required: false
            }],
            group: ['ReasonAnswer.id', 'ReasonAnswer.Reason_answer'],
            raw: true
        });

        res.json(stats);
    }),

    // Get answers by candidate experience level
    getAnswersByExperience: asyncHandler(async (req: Request, res: Response) => {
        const experienceDistribution = await sequelize.query(`
            SELECT 
                ra.Reason_answer,
                CASE 
                    WHEN c.workExp < 2 THEN 'Junior'
                    WHEN c.workExp < 5 THEN 'Mid-level'
                    ELSE 'Senior'
                END as experience_level,
                COUNT(*) as count
            FROM ReasonSaveAnswer rsa
            JOIN ReasonAnswer ra ON rsa.answer = ra.id
            JOIN candidates c ON rsa.candidateId = c.id
            GROUP BY ra.Reason_answer, experience_level
            ORDER BY ra.Reason_answer, experience_level
        `, {
            type: QueryTypes.SELECT
        });

        res.json(experienceDistribution);
    })
};

export default answerCandidateController;