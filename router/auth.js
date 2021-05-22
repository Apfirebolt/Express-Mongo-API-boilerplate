const express = require('express');
const { validateUser } = require('../middleware/userValidator');
const { protect } = require('../middleware/checkAuth')

const {
    register,
    login,
    logout,
    getProfile
} = require('../controllers/auth');

const router = express.Router();

router.post(
  '/register',
  validateUser,
  register);
router.post('/login', login);
router.get('/logout', logout);
/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     description: Get profile data of the logged in user
 *     security:
 *       bearerAuth: []
 *     responses: 
 *       200:
 *         description: Success     
 */
router.get('/profile', protect, getProfile);

module.exports = router;
