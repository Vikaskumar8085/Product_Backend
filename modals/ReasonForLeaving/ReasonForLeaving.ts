// src/models/ReasonsForLeaving.ts
import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";
import Candidate from "../Candidate/Candidate";

interface ReasonAttributes {
  id: number;
  candidateId: number;
  reason: string;
}

interface ReasonCreateAttributes extends Optional<ReasonAttributes, "id"> {}

class ReasonsForLeaving
  extends Model<ReasonAttributes, ReasonCreateAttributes>
  implements ReasonAttributes
{
  public id!: number;
  public candidateId!: number;
  public reason!: string;
}

ReasonsForLeaving.init(
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
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "reasons_for_leaving",
    sequelize,
  }
);

export default ReasonsForLeaving;
