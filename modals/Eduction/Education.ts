// src/models/Education.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../dbconfig/dbconfig';
import Candidate from '../Candidate/Candidate';

interface EducationAttributes {
  id: number;
  candidateId: number;
  ugCourse: string;
  pgCourse: string;
}

class Education extends Model<EducationAttributes> implements EducationAttributes {
  public id!: number;
  public candidateId!: number;
  public ugCourse!: string;
  public pgCourse!: string;
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
        key: 'id',
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
    tableName: 'educations',
    sequelize,
  }
);

export default Education;
