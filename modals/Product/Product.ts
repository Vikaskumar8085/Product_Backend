import { Model, DataType, Optional, DataTypes } from "sequelize";
import sequelize from "../../dbconfig/dbconfig";

interface ProductAttributes {
  id: number;
}

interface ProductCreateAttributes extends Optional<ProductAttributes, "id"> {}

class Product
  extends Model<ProductAttributes, ProductCreateAttributes>
  implements ProductAttributes
{
  public id!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: "Product",
    sequelize,
  }
);

export default Product;
