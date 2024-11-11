// src/models/Designation.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../dbconfig/dbconfig';

interface DesignationAttributes {
  id: number;
  title: string;
}

class Designation extends Model<DesignationAttributes> implements DesignationAttributes {
  public id!: number;
  public title!: string;
}

Designation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'designations',
    sequelize,
  }
);

export default Designation;
