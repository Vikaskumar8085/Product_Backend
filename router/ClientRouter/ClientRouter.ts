import express from "express";
import ClientCtr from "../../controller/ClientController/ClientCtr";
let ClientRouter = express.Router();

ClientRouter.post("/create-client", ClientCtr.createclientctr);
ClientRouter.get("/fetch-client", ClientCtr.fetchclientctr);
ClientRouter.delete("/reomve-client", ClientCtr.removeclientctr);
ClientRouter.put("/reomve-client", ClientCtr.editclientctr);

export default ClientRouter;
