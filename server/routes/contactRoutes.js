const express = require('express');
const contactRoutes = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const { roleCheck } = require('../middleware/roleCheck');
const { sendContact, getContact, reply, deleteContact } = require('../controllers/contactController');

contactRoutes.post("/sendContact", sendContact)
contactRoutes.get("/getContact", authMiddleware, roleCheck(['superadmin']), getContact)
contactRoutes.post("/reply", authMiddleware, roleCheck(['superadmin']), reply)
contactRoutes.delete("/deleteContact/:id", authMiddleware, roleCheck(['superadmin']), deleteContact)


module.exports = contactRoutes;