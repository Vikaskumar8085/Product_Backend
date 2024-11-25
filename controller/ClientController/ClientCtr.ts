import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import User from "../../modals/User/User";
import Client from "../../modals/Client/Client";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcryptjs";
const ClientCtr = {
  // create client
  createclientctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {
          FirstName,
          LastName,
          Email,
          Phone,
          Address,
          PostCode,
          GstNumber,
          Status,
        } = req.body;

        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        const password = Phone;
        const hashpassword = await bcrypt.hash(password, 10);

        const clientUser = await User.create({
          FirstName,
          LastName,
          Email,
          Phone,
          Password: hashpassword,
        });
        
        
        const response: any = await Client.create({
          userId: clientUser.id,
          Address,
          PostCode,
          GstNumber,
          Status,
        });

        if (!response) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Not Found");
        }
        //merge user and client data for response exclude password field from user
        response.dataValues = {...response.dataValues, user: 
          {
            ...clientUser.dataValues,
            Password: undefined,
          }
        };

        return res
          .status(StatusCodes.CREATED)
          .json({message: "client created successfully", success: true, result: response});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   fetch client ctr
  fetchclientctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }

        const response = await Client.findAll();

        if (!response) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Not Found");
        }
        return res.status(StatusCodes.OK).json({
          message: "fetch Client data successfully",
          success: true,
          result: response,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  // remove client ctr
  removeclientctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(StatusCodes.UNAUTHORIZED);
        //   throw new Error("User Not Found Please Login !");
        // }

        const removeItems = await Client.findByPk(req.params.id);
        if (!removeItems) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        } else {
          await removeItems.destroy();
        }

        return res
          .status(StatusCodes.OK)
          .json({message: "remove client successfully", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   edit client ctr
  editclientctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {
          FirstName,
          LastName,
          Email,
          Phone,
          Address,
          PostCode,
          GstNumber,
          Status,
        } = req.body;

        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(StatusCodes.UNAUTHORIZED);
        //   throw new Error("User Not Found Please Login !");
        // }
        const checkClient = await User.findByPk(req.params.id);
        if (!checkClient) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Not Found");
        }
        checkClient.update({
          FirstName,
          LastName,
          Email,
          Phone,
        });
        
        
        
        const checkClientData = await Client.findOne({where: {userId: req.params.id}});
        if (!checkClientData) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Not Found");
        }
        checkClientData.update({
          Address,
          PostCode,
          GstNumber,
          Status,
        });


        
        //merge user and client data for response exclude password field from user
        const response = {
          ...checkClientData.dataValues,
          user: {
            ...checkClient.dataValues,
            Password: undefined,
          },
        };
        
        
        return res
          .status(StatusCodes.OK)
          .json({message: "update client Successfully", success: true,result: response});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default ClientCtr;
