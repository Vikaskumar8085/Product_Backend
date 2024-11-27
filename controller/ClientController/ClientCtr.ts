import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import User from "../../modals/User/User";
import Client from "../../modals/Client/Client";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcryptjs";
import ClientTags from "../../modals/ClientTags";
import Tag from "../../modals/Tag/Tag";
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
          tags,
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
        if (tags) {
          for (const tag of tags) {
            await ClientTags.create({
              ClientId: response.id,
              tagId: tag,
            });
          }
        }
        if (!response) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Not Found");
        }
        //merge user and client data for response exclude password field from user
        const tagNAme = async (tags: number[]) => {
          const tagNames: string[] = [];
          for (const tagId of tags) {
            const tag: any = await Tag.findByPk(tagId);
            tagNames.push(tag);
          }
          return tagNames;
        };
        const tagsName = await tagNAme(tags);
        const {Password, id, ...userData} = clientUser.dataValues; // Exclude password

        const flattenedResponse = Object.assign(
          {},
          response.dataValues,
          userData,
          {tags: tagsName}
        );
        //also include tags in response

        console.log(flattenedResponse);

        return res.status(StatusCodes.CREATED).json({
          message: "client created successfully",
          success: true,
          result: flattenedResponse,
        });
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

        const response = await Client.findAll({
          include: [
            {
              model: User,
              as: "user",
              attributes: [
                "FirstName",
                "LastName",
                "Email",
                "Phone",
                "ProfileImage",
                "Type",
              ],
            },
            {
              model: Tag, // Include Tag model instead of CandidateTags

              as: "tags",
            },
          ],
        });

        if (!response) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client Not Found");
        }
        const results = response.map((client) => ({
          id: client.id,
          userId: client.userId,
          Address: client.Address,
          PostCode: client.PostCode,
          GstNumber: client.GstNumber,
          Status: client.Status,
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
          FirstName: client.user?.FirstName || null,
          LastName: client.user?.LastName || null,
          Email: client.user?.Email || null,
          Phone: client.user?.Phone || null,
          ProfileImage: client.user?.ProfileImage || null,
          Type: client.user?.Type || null,
          tags:
            client.tags?.map((tag: {id: any; Tag_Name: any}) => ({
              id: tag.id,
              Tag_Name: tag.Tag_Name,
            })) || [], // Ensure tags is always an array
        }));

        return res.status(StatusCodes.OK).json({
          message: "fetch Client data successfully",
          success: true,
          result: results,
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

        const client = await Client.findByPk(req.params.id);
        if (!client) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Client not found");
        }

        // Find the associated user by userId
        const user = await User.findByPk(client.userId);
        if (!user) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Associated user not found");
        }
        const tags = await ClientTags.findAll({
          where: {
            ClientId: req.params.id,
          },
        });
        // Delete the client and user
        await client.destroy(); // Delete the client record
        await user.destroy(); // Delete the associated user record
        for (const tag of tags) {
          await tag.destroy();
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
          tags,
        } = req.body;

        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(StatusCodes.UNAUTHORIZED);
        //   throw new Error("User Not Found Please Login !");
        // }
        const checkClientData = await Client.findByPk(req.params.id);
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
        const checkClient = await User.findByPk(checkClientData.userId);
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
        if (tags) {
          const clientTags = await ClientTags.findAll({
            where: {
              ClientId: checkClientData.id,
            },
          });
          for (const tag of clientTags) {
            await tag.destroy();
          }
          for (const tag of tags) {
            await ClientTags.create({
              ClientId: checkClientData.id,
              tagId: tag,
            });
          }
        }

        const tagNAme = async (tags: number[]) => {
          const tagNames: string[] = [];
          for (const tagId of tags) {
            const tag: any = await Tag.findByPk(tagId);
            tagNames.push(tag);
          }
          return tagNames;
        };
        const tagsName = await tagNAme(tags);
        //merge user and client data for response exclude password field from user
        const {Password, id, ...userData} = checkClient.dataValues; // Exclude Password
        const flattenedResponse = Object.assign(
          {},
          checkClientData.dataValues,
          userData,
          {tags: tagsName}
        );

        return res
          .status(StatusCodes.OK)
          .json({
            message: "Client updated successfully",
            success: true,
            result: flattenedResponse,
          });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default ClientCtr;
