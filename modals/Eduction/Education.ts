// src/models/Education.ts
import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import Candidate from "../Candidate/Candidate";

interface EducationAttributes {
  id: number;
  candidateId: number;
  ugCourse: string;
  pgCourse: string;
}

interface CreateEducationAttributes
  extends Optional<EducationAttributes, "id"> {}

class Education
  extends Model<EducationAttributes, CreateEducationAttributes>
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
    candidateId: {
      type: DataTypes.INTEGER,
      references: {
        model: Candidate,
        key: "id",
      },
      allowNull: false,
    },
    ugCourse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pgCourse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "educations",
    sequelize,
  }
);

export default Education;
