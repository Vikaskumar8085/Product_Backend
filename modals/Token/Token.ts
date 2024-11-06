import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../../dbconfig/dbconfig"
import User from "../User/User"

// Define an interface for the Token attributes
interface TokenAttributes {
  id?: number;
  userId: number;
  token: string;
  createdAt: Date;
  expireAt?: Date;
}

// Define an interface for the creation attributes
interface TokenCreationAttributes extends Optional<TokenAttributes, 'id' | 'expireAt'> {}

// Create the Token model class
class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public createdAt!: Date;
  public expireAt?: Date;
}

// Initialize the Token model
Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,

      references: {
        // This is a reference to another model
        model: User,

        // This is the column name of the referenced model
        key: 'id',

        
      },
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expireAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Token',
    tableName: 'Tokens', // Adjust table name as needed
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default Token;
