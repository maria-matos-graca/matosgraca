import express from 'express';
import crypto from 'crypto';
import authenticateJWT from '../middleware/auth.js';
import * as blogPosts from "../controllers/blog.controller.js";
import e from 'express';

const router = express.Router();
 
    router.post("/", blogPosts.create);
    router.get("/", blogPosts.findAll);
    router.get("/:id", blogPosts.findOne);
    router.put("/:id", blogPosts.update);
    router.delete("/:id", blogPosts.deleteOne);
    router.delete("/", blogPosts.deleteAll);
    router.get("/published", blogPosts.findAllPublished);

    export default router;