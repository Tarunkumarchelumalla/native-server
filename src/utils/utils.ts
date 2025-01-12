import { Request, Response } from "express";
import { User } from "../modals/common/user.modal";
import httpStatus from "http-status";
import { ResponseType } from "../schemas";

const GetUID = (req: Request, res: Response) => {
    return req.user.UID
}

const CheckUserExists = async (res: Response, UID: string) => {
    if(!UID){
        const response: ResponseType<any> = {
            isSuccess: false,
            data: null,
            message: 'User is not valid'
        }
        return res.status(httpStatus.NOT_FOUND).send(
            response)
    }
    const checkUserExist = await User.findOne({ _id: UID })
    if (checkUserExist) return true;

    const response: ResponseType<any> = {
        isSuccess: false,
        data: null,
        message: 'User not found'
    }
    return res.status(httpStatus.NOT_FOUND).send(
        response

    )
    return false
}


export {
    GetUID,
    CheckUserExists
}