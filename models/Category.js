const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: String,
  createdBy: String,

  fields:[{
    fieldID: {type: String, unique: true},
    title: {type: String, required: true},
    inputType: {type: String, enum:['text','boolean','number','file'] , default:'text'},
    description: String,
    defaultAnswer: String,
    options: Array,
    isRequired: {type: Boolean, default: false},
  }]

}, { timestamps: true });


categorySchema.statics.findById = function findById (id, callback) {
  Category.findOne({'_id':id},
      {},
      callback
  );
};
/**
 * Helper method for finding all categories
 */
categorySchema.statics.findAll = function findAll (callback) {
  Category.find({},
      {},
      callback
  );
};
/**
 * Helper method for finding all form fields
 */
/*categorySchema.statics.findAllFields = function findAllFields (callback) {
  Category.find({},
      {},
      function (err, categories) {
          var fields = [];
          callback(null, fields);
      }
  );
};*/

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;