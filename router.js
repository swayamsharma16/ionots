const express = require("express");
const Project = require("./models/Project");
const Candidate = require("./models/Candidate");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

router.post("/assign", async (req, res) => {
  const { title, description, candidateId } = req.body;

  try {
    const project = await Project.create({
      title,
      description,
      assignedTo: candidateId,
    });
    await Candidate.findByIdAndUpdate(candidateId, {
      $push: { projects: project._id },
    });
    res.status(201).json({ message: "Project assigned successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/assigned/:candidateId", async (req, res) => {
  const { candidateId } = req.params;

  try {
    const projects = await Project.find({ assignedTo: candidateId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/status/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { status } = req.body;

  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true }
    );
    res.status(200).json({ message: "Status updated successfully", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
