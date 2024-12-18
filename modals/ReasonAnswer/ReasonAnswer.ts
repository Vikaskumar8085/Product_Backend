import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface ReasonAnswerAttributes {
  id: number;
  Reason_answer: string;
  reason_id: number;
}

interface ReasonAnswerCreateAttributes
  extends Optional<ReasonAnswerAttributes, "id"> {}

class ReasonAnswer
  extends Model<ReasonAnswerAttributes, ReasonAnswerCreateAttributes>
  implements ReasonAnswerAttributes
{
  public id!: number;
  public Reason_answer!: string;
  public reason_id!: number;
}

ReasonAnswer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    reason_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Reason_answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "ReasonAnswer",
    sequelize,
    timestamps: true,
  }
);

export default ReasonAnswer;
