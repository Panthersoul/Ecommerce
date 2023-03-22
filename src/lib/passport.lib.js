import bcrypt from "bcrypt";
import { json } from "express";
import LocalStrategy from "passport-local";
import { User } from "../models/user.model.js";
import logger from "../lib/logger.lib.js"

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

const validatePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword)
}

        const loginStrategy = new LocalStrategy(async (username, password, done) => {
            try {
            const user = await User.findOne({ username });

            logger.info.info("Login strategy: "+user)
            if (!user || !validatePassword(password, user.password)) {
                return done("Invalid credentials", null);
            }

            done(null, user);
            } catch (err) {
            done("Error while login in", null);
            }
        });
        
        const registerStrategy = new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
            try {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                return done("Username already in use", null);
                }
                const newUser = {
                    username,
                    password: hashPassword(password),
                    firstname: req.body.nombreUsr,
                    address: req.body.dirUsr,
                    age: req.body.ageUsr,
                    telephone: req.body.telUsr,   
                    picture: req.file.filename
                };

                const createdUser = await User.create(newUser);
                req.user = createdUser;
                done(null, createdUser);
            } catch (err) {
                done("Error while register", null);
            }
            }
        );


  export const passportStrategies = { loginStrategy, registerStrategy };