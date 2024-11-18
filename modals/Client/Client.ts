import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface ClientAttributes {
  id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: number;
  Address: string;
  PostCode: string;
  GstNumber: string;
  Status: "Active" | "InActive";
}

interface ClientCreationAttributes extends Optional<ClientAttributes, "id"> {}

class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
  public id!: number;
  public FirstName!: string;
  public LastName!: string;
  public Email!: string;
  public Phone!: number;
  public Address!: string;
  public PostCode!: string;
  public GstNumber!: string;
  public Status!: "Active" | "InActive";

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
      validate: {
        isEmail: true, // Validates email format
      },
    },
    Phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true, // Ensures only numeric values
      },
    },
    Address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PostCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    GstNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [15, 15], // GST number length validation
      },
    },
    Status: {
      type: DataTypes.ENUM,
      values: ["Active", "InActive"],
      allowNull: false,
    },
  },
  {
    tableName: "Client", // Pluralized table name
    sequelize,
    timestamps: true, // Includes createdAt and updatedAt fields
  }
);

export default Client;
