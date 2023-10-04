import { rateLimit } from "express-rate-limit"
const newUserLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "You cannot create that new users in a row",

    handler: (req, res, next, options) => {
        res.status(options.statusCode).send(options.message)
        next()
    },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
})

export default newUserLimiter
