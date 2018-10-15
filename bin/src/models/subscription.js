"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(sequelize, DataTypes) {
    const Subscription = sequelize.define('Subscription', {
        type: DataTypes.ENUM('Subscription'),
        field: DataTypes.STRING,
        topic: DataTypes.STRING,
        filter: DataTypes.JSON
    });
    Subscription.associate = (models) => {
        models.Subscription.belongsTo(models.GraphQLSchema, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };
    return Subscription;
}
exports.default = default_1;
//# sourceMappingURL=subscription.js.map