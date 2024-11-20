import express from "express";
import ClientCtr from "../../../controller/ClientController/ClientCtr";
let ClientRouter = express.Router();

ClientRouter.post("/create-client", ClientCtr.createclientctr);
ClientRouter.get("/fetch-client", ClientCtr.fetchclientctr);
ClientRouter.delete("/remove-client/:id", ClientCtr.removeclientctr);
ClientRouter.put("/edit-client/:id", ClientCtr.editclientctr);

export default ClientRouter;
