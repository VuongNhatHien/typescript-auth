module.exports = (sequelize, DataTypes) => {
  const DocumentTag = sequelize.define(
    "document_tag",
    {
      document_tag_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      document_id: {
        type: DataTypes.INTEGER,
        // primaryKey: true,
        allowNull: false,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        // primaryKey: true,
        allowNull: false,
      },
    },
    {
      tableName: "document_tag",
    }
  );

  return DocumentTag;
};
