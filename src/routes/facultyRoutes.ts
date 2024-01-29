import { Router } from "express";
import {
  createFacultyHandler,
  deleteFacultyHandler,
  getFacultiesHandler,
  getFacultyByIdHandler,
  updateFacultyHandler,
} from "../controller/facultyController";
import validateResource from "../middleware/validateResource";
import {
  createFacultySchema,
  deleteFacultySchema,
  getFacultySchema,
  updateFacultySchema,
} from "../shema/faculty.schema";
const router = Router();

/**
 * @openapi
 * '/api/v1/faculties':
 *  post:
 *     tags:
 *     - Faculty
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateFacultyInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
router.post("/", validateResource(createFacultySchema), createFacultyHandler);
router.get("/", getFacultiesHandler);
router.put("/:id", validateResource(updateFacultySchema), updateFacultyHandler);
router.delete(
  "/:id",
  validateResource(deleteFacultySchema),
  deleteFacultyHandler
);
router.get("/:id", validateResource(getFacultySchema), getFacultyByIdHandler);

export default router;
