// src/models/Region/Region.ts
import {Model, DataTypes, Optional} from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface RegionAttributes {
  id: number;
  Reason_Name: string;
}

interface RegionCreationAttributes extends Optional<RegionAttributes, "id"> {}

class Region
  extends Model<RegionAttributes, RegionCreationAttributes>
  implements RegionAttributes
{
  public id!: number;
  public Reason_Name!: string;
}

Region.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Reason_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Regions",
    sequelize,
  }
);

export default Region;
