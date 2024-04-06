module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.JSONB,
    },
    additional_info: {
      type: DataTypes.JSONB,
    },
  });

  return user;
};
