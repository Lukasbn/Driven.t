import { Router} from "express";
import { authenticateToken } from "@/middlewares";

const hotelsRouters = Router()

hotelsRouters.use(authenticateToken)
hotelsRouters.get("/", (req,res)=>{res.send("ta runfando pai")})
hotelsRouters.get('/:id', (req,res)=>{
    const {id} = req.params
    res.send(`o id informado é ${id}`)
})

export {hotelsRouters}