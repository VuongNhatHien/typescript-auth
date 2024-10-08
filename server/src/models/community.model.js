module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define(
    "community",
    {
      community_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      privacy: {
        type: DataTypes.ENUM("public", "private"),
        defaultValue: "public",
      },
      cover_image: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      member_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      contact_email: {
        type: DataTypes.STRING,
      },
      contact_phone: {
        type: DataTypes.STRING,
      },
      owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "community",
    },
    {
      timestamps: true,
      createdAt: "created_at", // Alias createdAt as created_at
      updatedAt: "updated_at", // Alias updatedAt as updated_at
    }
  );

  return Community;
};
