// Import Joi schema
const { taskSchema, tasks } = require("../models/task.js");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");




const postOne = (req,res) => {
  try{  
    console.log("Incoming request:", req.body); // Log request body

    // Validate request body first
    const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
    if (error) {
      console.error("Validation Error:", error.details);
      return res.status(400).json({ message: "Validation Error", details: error.details });
    }

    // Create new task with proper structure
    const newTask = {
      id: uuidv4(), // Use unique UUID instead of tasks.length
      title: value.title,
      isCompleted: false,
      isArchive: false,
      dateTimeCreated: moment().utc().format("YYYY-MM-DD HH:mm:ss"), // Proper date format
      createdBy: value.createdBy, // Correctly assign createdBy from validated data
      updatedBy: "", // Initially empty; will be set on update
    };

    tasks.push(newTask);
    console.log("Task added:", newTask);
  
    // Return the full task object including createdBy and dateTimeCreated
    return res.status(201).json(newTask);
  } catch (err) {
    console.error("Unexpected Error:", err);
    return res.status(500).json({message: "Internal Server Error", error: err.message })
  }
}



// Create a new task (POST)
// module.exports.postOne = (req, res) => {
//   console.log("Incoming request:", req.body); // Log request body

//   // Validate request body first
//   const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
//   if (error) {
//     console.error("Validation Error:", error.details);
//     return res.status(400).json({ message: "Validation Error", details: error.details });
//   }

//   // Create new task with proper structure
//   const newTask = {
//     id: uuidv4(), // Use unique UUID instead of tasks.length
//     title: value.title,
//     isCompleted: false,
//     isArchive: false,
//     dateTimeCreated: moment().utc().format("YYYY-MM-DD HH:mm:ss"), // Proper date format
//     createdBy: value.createdBy, // Correctly assign createdBy from validated data
//     updatedBy: "", // Initially empty; will be set on update
//   };

//   tasks.push(newTask);
//   console.log("Task added:", newTask);

//   // Return the full task object including createdBy and dateTimeCreated
//   return res.status(201).json(newTask);
// };

// Get all tasks (GET)

const getAll = (req, res) => {

  try{
    let filteredTasks = tasks;
    if (Object.keys(req.query).length > 0 ){
      filteredTasks = tasks.filter((task) =>
        Object.entries(req.query).every(
        ([key, value]) => task[key] && task[key].toString() === value
        )
      )
    }
  return res.status(200).json(filteredTasks);
  } catch(err) {
  console.error("Unexpected Error:", err);
    return res.status(500).json({message: "Internal Server Error", error: err.message })
  }
}

// module.exports.getAll = (req, res) => {
//   let filteredTasks = tasks;
//   if (Object.keys(req.query).length > 0) {
//     filteredTasks = tasks.filter((task) =>
//       Object.entries(req.query).every(
//         ([key, value]) => task[key] && task[key].toString() === value
//       )
//     );

//     //insert getAllActive
//   }
//   return res.status(200).json(filteredTasks);
// };

// Get all active tasks (GET)
// module.exports.getAllActive = (req, res) => {
//   const activeTasks = tasks.filter((task) => !task.isArchive);
//   if (activeTasks.length > 0) {
//     return res.status(200).json(activeTasks);
//   }
//   return res.status(404).json({ message: "No active tasks found" });
// };

// Get one task by ID (GET)




// module.exports.getOneById = (req, res) => {
//   const taskId = req.params.id;
//   const task = tasks.find((task) => task.id === taskId);
//   if (!task) {
//     return res.status(404).json({ message: "Task not found" });
//   }
//   return res.status(200).json(task);
// };









// Update task (PUT)

const putOne = (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedData = req.body;

    console.log("Task ID:", taskId);
    console.log("Request Body:", updatedData);

    if (!updatedData || Object.keys(updatedData).length === 0) {
      console.log("Error: Request body is empty");
      return res.status(400).json({ message: "Request body cannot be empty" });
    }

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      console.log("Task not found");
      return res.status(404).json({ message: "Task not found" });
    }

    // Merge the updated data into the existing task and update updatedBy and dateTimeUpdated
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updatedData,
      // If updatedBy is provided in the request, update it; otherwise, leave it unchanged.
      updatedBy: updatedData.updatedBy || tasks[taskIndex].updatedBy,
      dateTimeUpdated: moment().utc().format("YYYY-MM-DD HH:mm:ss"), // Proper date format for updates
    };

    console.log("Updated task:", tasks[taskIndex]);
    return res.status(200).json(tasks[taskIndex]);
  } catch (err) {
    console.error("Unexpected Error:", err);
    return res.status(500).json({message: "Internal Server Error", error: err.message })
  }
}






// module.exports.putOne = (req, res) => {
//   const taskId = req.params.id;
//   const updatedData = req.body;

//   console.log("Task ID:", taskId);
//   console.log("Request Body:", updatedData);

//   if (!updatedData || Object.keys(updatedData).length === 0) {
//     console.log("Error: Request body is empty");
//     return res.status(400).json({ message: "Request body cannot be empty" });
//   }

//   const taskIndex = tasks.findIndex((task) => task.id === taskId);
//   if (taskIndex === -1) {
//     console.log("Task not found");
//     return res.status(404).json({ message: "Task not found" });
//   }

//   // Merge the updated data into the existing task and update updatedBy and dateTimeUpdated
//   tasks[taskIndex] = {
//     ...tasks[taskIndex],
//     ...updatedData,
//     // If updatedBy is provided in the request, update it; otherwise, leave it unchanged.
//     updatedBy: updatedData.updatedBy || tasks[taskIndex].updatedBy,
//     dateTimeUpdated: moment().utc().format("YYYY-MM-DD HH:mm:ss"), // Proper date format for updates
//   };

//   console.log("Updated task:", tasks[taskIndex]);
//   return res.status(200).json(tasks[taskIndex]);
// };

// Delete task (DELETE)

const deleteOne = (req,res) => {
  try{
    const taskId = req.params.id;
    console.log("Deleting Task ID:", taskId);
  
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }
  
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    console.log("Task deleted:", deletedTask);
    return res.status(200).json(deletedTask);
  } catch (err) {
    console.error("Unexpected Error:", err);
    return res.status(500).json({message: "Internal Server Error", error: err.message })
  }

}

module.exports = {
  postOne,
  getAll,
  putOne,
  deleteOne
};


// module.exports.deleteOne = (req, res) => {
//   const taskId = req.params.id;
//   console.log("Deleting Task ID:", taskId);

//   const taskIndex = tasks.findIndex((task) => task.id === taskId);
//   if (taskIndex === -1) {
//     return res.status(404).json({ message: "Task not found" });
//   }

//   const deletedTask = tasks.splice(taskIndex, 1)[0];
//   console.log("Task deleted:", deletedTask);
//   return res.status(200).json(deletedTask);
// };
