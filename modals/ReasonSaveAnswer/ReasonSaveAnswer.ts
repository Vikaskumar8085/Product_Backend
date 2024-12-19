import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import ReasonsForLeaving from "../ReasonForLeaving/ReasonForLeaving";
import Candidate from "../Candidate/Candidate";

interface ReasonSaveAnswerAttributes {
  id: number;
  candidateId: number;
  questionId: number;
  answer: string;
}

interface ReasonSaveAnswerCreationAttributes
  extends Optional<ReasonSaveAnswerAttributes, "id"> {}

class ReasonSaveAnswer
  extends Model<ReasonSaveAnswerAttributes, ReasonSaveAnswerCreationAttributes>
  implements ReasonSaveAnswerAttributes
{
  public id!: number;
  public candidateId!: number;
  public questionId!: number;
  public answer!: string;
}

ReasonSaveAnswer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER, // Updated to match ReasonsForLeaving.id type
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ReasonSaveAnswer",
    sequelize,
    timestamps: true, // Enable timestamps if needed
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
  }
);

export default ReasonSaveAnswer;
