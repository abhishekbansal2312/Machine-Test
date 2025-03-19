const Agent = require("../models/Agent");

// @desc    Create a new agent
// @route   POST /api/agents
// @access  Private/Admin
exports.createAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Validate input
    if (!name || !email || !mobile || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if agent already exists
    const agentExists = await Agent.findOne({ email });
    if (agentExists) {
      return res
        .status(400)
        .json({ message: "Agent with this email already exists" });
    }

    // Create agent
    const agent = await Agent.create({
      name,
      email,
      mobile,
      password,
    });

    if (agent) {
      res.status(201).json({
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
      });
    } else {
      res.status(400).json({ message: "Invalid agent data" });
    }
  } catch (error) {
    console.error("Create agent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private/Admin
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}).select("-password");
    res.status(200).json(agents);
  } catch (error) {
    console.error("Get agents error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Private/Admin
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password");

    if (agent) {
      res.status(200).json(agent);
    } else {
      res.status(404).json({ message: "Agent not found" });
    }
  } catch (error) {
    console.error("Get agent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
exports.updateAgent = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.mobile = mobile || agent.mobile;

    if (req.body.password) {
      agent.password = req.body.password;
    }

    const updatedAgent = await agent.save();

    res.status(200).json({
      _id: updatedAgent._id,
      name: updatedAgent.name,
      email: updatedAgent.email,
      mobile: updatedAgent.mobile,
    });
  } catch (error) {
    console.error("Update agent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    await agent.deleteOne();
    res.status(200).json({ message: "Agent removed" });
  } catch (error) {
    console.error("Delete agent error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
