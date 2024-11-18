import {Sequelize, DataTypes, Model, Optional} from "sequelize";
import Joi from "joi";
import sequelize from "../../dbconfig/dbconfig";

// Define attributes for User
interface UserAttributes {
  id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Phone: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public FirstName!: string;
  public LastName!: string;
  public Email!: string;
  public Password!: string;
  public Phone!: string;

  static validateUser(user: UserAttributes) {
    const schema = Joi.object({
      FirstName: Joi.string().min(2).max(50).required(),
      LastName: Joi.string().min(2).max(50).required(),
      Email: Joi.string().email().required(),
      Password: Joi.string().min(8).required(),
      Phone: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(15)
        .optional(),
    });
    return schema.validate(user);
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User"

  }
);

export default User;
