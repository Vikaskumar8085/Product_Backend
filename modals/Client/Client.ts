// src/models/Region/Region.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface ClientAttributes {
  id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: number;
  Address: string;
  PostCode: number;
  GstNumber: any;
  Status: any;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, "id"> {}

class Client
  extends Model<ClientAttributes, ClientCreationAttributes>
  implements ClientAttributes
{
  public id!: number;
  public name!: string;
  public FirstName!: string;
  public LastName!: string;
  public Email!: string;
  public Phone!: number;
  public Address!: string;
  public PostCode!: number;
  public GstNumber!: any;
  public Status!: any;
}

Client.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
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
    },
    Phone: { type: DataTypes.NUMBER, allowNull: false },
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
    },
    Status: {
      type: DataTypes.ENUM,
      values: ["Active", "InActive"],
      allowNull: false,
    },
  },
  {
    tableName: "Client",
    sequelize,
  }
);

export default Client;
