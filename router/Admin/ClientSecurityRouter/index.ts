import express from "express";
import clientsecurityctr from "../../../controller/ClientSecurityCtr/ClientSecurityCtr";

const clientsecurityRouter = express.Router();

clientsecurityRouter.post("/create", clientsecurityctr.createclientsecurity);
clientsecurityRouter.get("/fetch");
clientsecurityRouter.put("/edit");
clientsecurityRouter.delete("/remove");

export default clientsecurityRouter;
