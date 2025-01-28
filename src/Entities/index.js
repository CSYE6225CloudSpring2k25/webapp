const sequelize = require('../DB_Config/Database');
const { DataTypes } = require('sequelize');

const HealthCheck = sequelize.define('HealthCheck', {
  checkId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  }
},{
    timestamps: false,
  
});

module.exports = { sequelize, HealthCheck };
