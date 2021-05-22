const express = require('express');
const {
  getUsers,
  getUser,
} = require('../controllers/user');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    /**
     * @swagger
     * /api/v1/users:
     *   get:
     *     description: Get all users
     *     responses: 
     *       200:
     *         description: Success     
     */
    .get(getUsers)

router
    .route('/:id')
    /**
     * @swagger
     * /api/v1/users/{id}:
     *   get:
     *     description: Get Single User
     *     parameters: 
     *       - in: path
     *         name: id
     *         required: true
     *         scheme:
     *           type: String
     *     responses: 
     *       200:
     *         description: Success     
     */
    .get(getUser)

module.exports = router;
