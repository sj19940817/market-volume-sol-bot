module.exports = function (sequelize, Sequalize) {
  var Pnl = sequelize.define(
    "Pnl",
    {
      wallet_address: Sequalize.STRING,
      type: Sequalize.STRING,
      sol: Sequalize.NUMBER,
    },
    {
      timestamps: false,
    }
  );
  Pnl.associate = function (models) {
    // associations can be defined here
  };
  return Pnl;
};
