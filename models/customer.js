// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Customer extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Customer.init({
//     Name: DataTypes.STRING,
//     Email: DataTypes.STRING,
//     Password: DataTypes.STRING,
//     PhoneNumber: DataTypes.INTEGER,
//     Gender: DataTypes.ENUM,
//     Address: DataTypes.STRING,
//     ProfileImage: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Customer',
//   });
//   return Customer;
// };

module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        PhoneNumber: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        Gender: {
            type: DataTypes.ENUM('M','F','O'),
            allowNull: false,
        },
        Address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ProfileImage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, 
    // {
    //     tableName: 'Customer'
    // }
    );
    return Customer;
};