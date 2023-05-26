import { Router } from "express";
import { body, oneOf, validationResult } from "express-validator";
import { handleInputErrors } from "./modules/middleware";
import { createProject, deleteProject, getOneProject, getProjects, updateProject } from "./handlers/project";
import { createUpdate, deleteUpdate, getOneUpdate, getUpdates, updateUpdate } from "./handlers/update";

const router = Router();


//Project routes
router.get("/project", getProjects);
router.get("/project/:id", getOneProject);
router.put(
  "/project/:id",
  body("name").isString(),
  handleInputErrors,
updateProject
);
router.post(
  "/project",
  body("name").isString(),
  body("description").isString(),
  handleInputErrors,
  createProject
);
router.delete("/project/:id", deleteProject);

//Update routes
router.get("/update", getUpdates);
router.get("/update/:id",getOneUpdate );
router.put(
  "/update/:id",
  body("title").optional(),
  body("content").optional(),
  body("status").isIn(["IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  body("country").optional(),
  updateUpdate
);
router.post(
  "/update",
  body("title").exists().isString(),
  body("content").exists().isString(),
  body("country").exists().isString(),
  body('projectId').exists().isString(),
  createUpdate
);
router.delete("/update/:id", deleteUpdate  );

router.use((err, req, res, next) => {
  res.json({ message: 'Oops, Operation Failed' });
});
export default router;
