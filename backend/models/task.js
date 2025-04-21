const JoiBase = require('joi');
const JoiDate = require('@joi/date');

// models : data validation and storage
// Extend Joi with date formatting support
const Joi = JoiBase.extend(JoiDate);

const tasks = [];

// Generate user ID function (optional, replace with actual logic)
const generateUserId = () => Math.random().toString(10).slice(2);

const taskSchema = Joi.object({
  id: Joi.string().default(() => Math.random().toString(10).slice(2)),
  title: Joi.string().required(),
  //description: Joi.string().optional(),
  isCompleted: Joi.boolean().default(false),
  //isActive: Joi.boolean().default(false),
  //dueDate: Joi.date().format(['YYYY/MM/DD', 'DD-MM-YYYY']).optional(),
  dateTimeCreated: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().default(() => new Date().toISOString()),
  dateTimeUpdated: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().default(() => new Date().toISOString()),
  userId: Joi.string().default(generateUserId), // User ID generation logic
  createdBy: Joi.string().default(generateUserId), // Assuming createdBy uses userId
  updatedBy: Joi.string().default(generateUserId), // Assuming updatedBy uses userId
});

module.exports = { 
  taskSchema,
  tasks,
};
