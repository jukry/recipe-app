import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Recipe from "../models/Recipe.js"
const saltRounds = 10

const registerUser = async (req, res) => {
    const { email, password, repassword } = req.body

    if (password !== repassword) {
        return res.status(406).json({ Message: "Passwords do not match" })
    }

    if (!email || !password || !repassword) {
        return res.status(401).json({ Message: "Please fill all fields" })
    }
    const found = await User.find({ email: email }).count()
    if (found) {
        return res.status(403).json({ Message: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
        email: email,
        password: hashedPassword,
    })

    user
        ? res.status(201).json({
              _id: user.id,
              email: user.email,
              token: generateToken(user._id),
          })
        : res
              .status(400)
              .json({ Message: "Something went wrong, please try again" })
}
const authenticateUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (user && bcrypt.compareSync(password, user.password)) {
        let generatedToken = generateToken(user._id)
        return res
            .cookie("token", generatedToken, {
                expires: new Date(Date.now() + 600000),
                secure: true,
                httpOnly: true,
            })
            .status(200)
            .json({
                _id: user.id,
                email: user.email,
            })
    } else {
        return res.status(404).json({ Message: "Login not succesful" })
    }
}
const getUserData = async (req, res) => {
    const { _id, email, recipes, favrecipes, lastlogins, role } =
        await User.findById(req.user.id)
    res.status(200).json({
        id: _id,
        email,
        recipes,
        favrecipes,
        lastlogins,
        role,
    })
}

// Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}

const getUserRecipes = async (req, res) => {
    const { _id } = req.user
    const userId = _id.toString()
    const recipes = await Recipe.find({ user: userId }).exec()
    return res.status(200).json({ data: recipes })
}

const changePassword = async (req, res) => {
    const { _id } = req.user
    const { oldPassword, newPassword, newRePassword } = req.body.formData

    if (!_id || !newPassword || !newRePassword) {
        return res.status(400).json({ Message: "Please fill all fields" })
    }
    if (newPassword !== newRePassword) {
        return res.status(401).json({ Message: "Passwords do not match" })
    }
    const user = await User.findById(_id)

    const comparePassword = await bcrypt.compare(oldPassword, user.password)

    if (!comparePassword) {
        return res.status(401).json({ Message: "Check input" })
    } else {
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
        user.updateOne({ password: hashedPassword }).exec()
    }
    return res.sendStatus(200)
}

const deleteUser = async (req, res) => {
    const { _id: userId } = req.user
    const userRecipes = req.user.recipes

    if (!userId) {
        return res.status(401).json({ Message: "Not authorized" })
    }

    try {
        userRecipes.map((id) => {
            //delete recipe from users who have it as favorite
            User.updateMany(
                { favrecipes: id },
                {
                    $pull: {
                        favrecipes: id,
                    },
                }
            ).exec()
            //delete recipe
            Recipe.findByIdAndDelete(id).exec()
        })
        //delete user
        await User.findByIdAndDelete(userId).exec()
    } catch (error) {
        return res.status(400).json(error)
    }
    return res.sendStatus(200)
}
const changeEmail = async (req, res) => {
    const oldEmail = req.user.email
    const { _id: id } = req.user
    const { changeemail: newEmail, confirmemailpassword: password } =
        req.body.formData

    const user = await User.findById(id)
    const comparePassword = await bcrypt.compare(password, user.password)

    const found = await User.find({ email: newEmail }).count()
    if (found) {
        //already exists
        return res.sendStatus(403)
    }

    if (!comparePassword) {
        return res.sendStatus(401)
    } else if (comparePassword) {
        await user.updateOne({ email: newEmail }).exec()
        return res.status(200).json({ Message: newEmail })
    }
}
const getAllUsers = async (req, res) => {
    const users = await User.find().select(
        "email lastlogins recipes favrecipes createdAt role"
    )
    return res.status(200).json({ data: users })
}

export {
    registerUser,
    authenticateUser,
    getUserData,
    getUserRecipes,
    changePassword,
    deleteUser,
    changeEmail,
    getAllUsers,
}
