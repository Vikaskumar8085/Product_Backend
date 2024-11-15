// src/models/Education.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import Candidate from "../Candidate/Candidate";

interface EducationAttributes {
  id: number;
  candidateId:number;
  ugCourse: string;
  pgCourse: string;
}


class Education
  extends Model<EducationAttributes>
  implements EducationAttributes
{
  public id!: number;
  public candidateId!: number;
  public ugCourse!: string | any;
  public pgCourse!: string | any;
  public postCourse!: string | any;
}

Education.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ugCourse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pgCourse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    candidateId: {
      type: DataTypes.INTEGER, // Make sure this matches `candidates.id`
      references: {
        model: Candidate, // Reference the Candidate model
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      allowNull: true,
    },
  },
  {
    tableName: "educations",
    sequelize,
  }
);

// Candidate - Education (One-to-One)
Candidate.hasOne(Education, {
  foreignKey: "candidateId",
  as: "education"
});
Education.belongsTo(Candidate, {
  foreignKey: "candidateId",
  as: "candidate"
});
export default Education;
