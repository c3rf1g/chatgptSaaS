import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    if(token == null) return res.sendStatus(403)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        console.log(err, token)
        if(err) return res.sendStatus(403)
        console.log(token)
        req.email = decoded.email;
        req.ownerId = decoded.userId
        next();
    })
}