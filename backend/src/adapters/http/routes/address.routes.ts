import { Router } from "express";
import { container } from "@core/container/Container";

const router = Router();
const addressController = container.getAddressController();

router.post("/", (req, res) => addressController.create(req, res));
router.put("/:id", (req, res) => addressController.update(req, res));
router.delete("/:id", (req, res) => addressController.delete(req, res));
router.get("/customer/:customerId", (req, res) => addressController.listByCustomer(req, res));
router.get("/supplier/:supplierId", (req, res) => addressController.listBySupplier(req, res));
router.patch("/:id/set-main", (req, res) => addressController.setMain(req, res));

export { router as addressRouter };
