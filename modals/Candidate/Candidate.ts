// src/models/Candidate.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../dbconfig/dbconfig';
import User from '../User/User';

interface CandidateAttributes {
  id: number;
  name: string;
  resumeTitle: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
    workExp: string;
    currentCTC: string;
  currentLocation: string;
  state: string;
  preferredLocation: string;
  dob: Date;
  designationId: number; 
  UserId : number; // Foreign key to User
}

interface CandidateCreationAttributes extends Optional<CandidateAttributes, 'id'> {}

class Candidate extends Model<CandidateAttributes, CandidateCreationAttributes> implements CandidateAttributes {
  public id!: number;
  public name!: string;
  public resumeTitle!: string;
    public contactNumber!: string;
    public whatsappNumber!: string;
  public email!: string;
    public workExp!: string;
    public currentCTC!: string;
  public currentLocation!: string;
  public state!: string;
  public preferredLocation!: string;
  public dob!: Date;
  public designationId!: number;
  public UserId!: number;

  
}

Candidate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resumeTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: false,
        unique: true,
    },
   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    workExp :{
        type: DataTypes.STRING,
        allowNull: true
    },
    currentCTC: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preferredLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE ,
      allowNull: true,
    },
    designationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    UserId: {
      type: DataTypes.BIGINT,
      references: {
        // This is a reference to another model
        model: User,
        // This is the column name of the referenced model
        key: 'id',
        
      },
      allowNull: false,
    },     

  },
  {
    tableName: 'candidates',
    sequelize,
  }
);

export default Candidate;
