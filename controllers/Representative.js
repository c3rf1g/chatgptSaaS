import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {validate} from "email-validator";
import {Users} from "../models/UserModel.js";

export const Register = async(req, res) => {
    try {
        if (!validate(req.body.email)) return res.json(
            {
                "message": false,
                "error": "Email not correct"
            }
        )
        let isExist = await Users.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (isExist)
            return res.json(
            {
                "message": false,
                "error": "Email exist"
            }
        )
        console.log(req.body)
        const { email, password} = req.body;
        console.log(email, password)
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        await Users.create({
            data: {
                email: email,
                pass: hashPassword
            }
        });
        res.json({
            "message": true,
            "data": {}
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
}

export const Login = async(req, res) => {
    try {
        console.log(req.body)
        const user = await Users.findMany({
            where: {
                email: req.body.email
            }
        });
        console.log(user)
        const match = await bcrypt.compare(req.body.password, user[0].pass);

        if(!match) return res.json({
            "message": false,
            "error": "Login or password wrong"
        })

        const userId = user[0].id;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1000d'
        });


        const refreshToken = jwt.sign({userId, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1000d'
        });
        await Users.update({
            where:{
                id: userId
            },
            data: {
                refresh_token: refreshToken
            }
        });

        res.json(
            {
                "message": true,
                "data": {
                    "accessToken": accessToken,
                    "refreshToken": refreshToken
                }
            }
        )
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}