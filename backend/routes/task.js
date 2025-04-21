const express = require('express');
const controller = require('../controllers/task.js')
const router = express.Router();


router.post('/', controller.postOne);
router.get('/', controller.getAll);
//router.get('/active', controller.getAllActive);
//router.get('/:id', controller.getOneById); 
router.put('/:id', controller.putOne);
router.delete('/:id', controller.deleteOne);

module.exports = router;




// const addTask = async () => {
//     if (taskName.value.trim() === "") {
//       $q.notify({ type: "warning", message: "Task cannot be empty!" });
//       return;
//     }
//     try {
//       const response = await fetch("http://localhost:3000/task/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }, // Fix: Added headers
//         body: JSON.stringify({ name: taskName.value }),
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to add task");
//       }
  
//       const data = await response.json(); // Fix: Parse response
//       console.log("Task added successfully:", data); // Fix: Log inside try block
  
//       $q.notify({ type: "positive", message: "Task added!" });
  
//     } catch (err) {
//       console.log("Error adding task:", err);
//       $q.notify({ type: "negative", message: "Failed to add task" });
//     }
//   };