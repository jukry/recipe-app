import { redirect } from "react-router-dom"

export async function getUserData({ request }) {
    const pathname = new URL(request.url).pathname
    try {
        const data = await fetch(
            process.env.NODE_ENV === "production"
                ? import.meta.env.VITE_USERDATA_ENDPOINT
                : import.meta.env.VITE_USERDATA_ENDPOINT_DEV,
            {
                method: "get",
                credentials: "include",
                referrerPolicy: "origin",
            }
        )
        const body = await data.json()
        if (pathname.includes("recipe/edit/")) {
            const recipeId = pathname.split("edit/")[1]
            if (body?.recipes?.includes(recipeId)) {
                return body
            } else {
                return {}
            }
        } else if (!body.id) {
            return redirect(
                `/login?message=Kirjaudu ensin sisään&redirectTo=${pathname}`
            )
        }
        return body
    } catch (error) {
        throw new Error(error)
    }
}

export async function handleFavorite(data) {
    const event = data[0]
    const id = data[1]
    const dispatch = data[2]
    const user = data[3]
    const isfav = event.target.className
    if (isfav === "isfav") {
        async function deleteFav() {
            return await fetch(
                process.env.NODE_ENV === "production"
                    ? import.meta.env.VITE_USERFAVRECIPES_ENDPOINT
                    : import.meta.env.VITE_USERFAVRECIPES_ENDPOINT_DEV,
                {
                    method: "DELETE",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ id: id }),
                }
            )
        }

        const body = await deleteFav()
        const message = await body.json()
        const newFavRecipes = message.Message
        dispatch({
            type: "UPDATEFAV",
            payload: [{ ...user, favrecipes: newFavRecipes }],
        })
    } else {
        async function addFav() {
            return await fetch(
                process.env.NODE_ENV === "production"
                    ? import.meta.env.VITE_USERFAVRECIPES_ENDPOINT
                    : import.meta.env.VITE_USERFAVRECIPES_ENDPOINT_DEV,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ id: id }),
                }
            )
        }

        const body = await addFav()
        const message = await body.json()
        const newFavRecipes = message.Message
        dispatch({
            type: "UPDATEFAV",
            payload: [{ ...user, favrecipes: newFavRecipes }],
        })
    }
}
export async function changePassword(formData) {
    return await fetch(
        process.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_USERDATA_ENDPOINT}/newpassword`
            : `${import.meta.env.VITE_USERDATA_ENDPOINT_DEV}/newpassword`,
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                formData,
            }),
        }
    )
}

export async function deleteUser() {
    await fetch(
        process.env.NODE_ENV === "production"
            ? import.meta.env.VITE_USERDATA_ENDPOINT
            : import.meta.env.VITE_USERDATA_ENDPOINT_DEV,
        {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    )
    await fetch(
        process.env.NODE_ENV === "production"
            ? import.meta.env.VITE_LOGOUT_ENDPOINT
            : import.meta.env.VITE_LOGOUT_ENDPOINT_DEV,
        {
            method: "POST",
            credentials: "include",
        }
    )
    return location.replace("/")
}

export function commentTime(timeDelta) {
    return timeDelta * 60 < 60 // < 1 minute ago
        ? "Juuri nyt"
        : timeDelta >= 1 && timeDelta < 2 // 1 minute ago
        ? "1 minuutti sitten"
        : timeDelta < 60 //x minutes ago
        ? `${Math.round(timeDelta)} minuuttia sitten`
        : timeDelta / 60 < 24 //x hours ago
        ? `${Math.round(timeDelta / 60)} tuntia sitten`
        : timeDelta / 60 >= 24 && //1 day ago
          timeDelta / 60 <= 48
        ? `${Math.round(timeDelta / 60 / 24)} päivä sitten`
        : timeDelta / 60 >= 48 && //2-30 days ago
          timeDelta / 60 / 24 < 30
        ? `${Math.round(timeDelta / 60 / 24)} päivää sitten`
        : timeDelta / 60 / 24 >= 30 && // 1 month ago
          timeDelta / 60 / 24 < 60
        ? `${Math.round(timeDelta / 60 / 24 / 30)} kuukausi sitten`
        : timeDelta / 60 / 24 >= 60 && //x months ago
          timeDelta / 60 / 24 < 365
        ? `${Math.round(timeDelta / 60 / 24 / 30)} kuukautta sitten`
        : timeDelta / 60 / 24 >= 365 && //1 year ago
          timeDelta / 60 / 24 < 730
        ? "1 vuosi sitten"
        : `${Math.floor(
              timeDelta / 60 / 24 / 30 / 12 //x years ago
          )} vuotta sitten`
}
export async function postComment(commentData, id, userId, email) {
    return await fetch(
        process.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_COMMENTS_ENDPOINT}`
            : `${import.meta.env.VITE_COMMENTS_ENDPOINT_DEV}`,
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                commentData,
                id,
                userId,
                email,
            }),
        }
    )
}
export async function changeEmail(formData) {
    return await fetch(
        process.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_USERDATA_ENDPOINT}/changeemail`
            : `${import.meta.env.VITE_USERDATA_ENDPOINT_DEV}/changeemail`,
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                formData,
            }),
        }
    )
}
export const handleDeleteFromAdmin = async (id, role, adminAmount) => {
    return await fetch(
        process.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_USERDATA_ENDPOINT}/${id}`
            : `${import.meta.env.VITE_USERDATA_ENDPOINT_DEV}/${id}`,
        {
            method: "DELETE",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                role: role,
                adminAmount: adminAmount,
            }),
        }
    )
}
export const handleRoleChangeFromAdmin = async (
    newRole,
    id,
    role,
    adminAmount
) => {
    return await fetch(
        process.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_USERDATA_ENDPOINT}/${id}`
            : `${import.meta.env.VITE_USERDATA_ENDPOINT_DEV}/${id}`,
        {
            method: "PATCH",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                role: role,
                newRole: newRole,
                adminAmount: adminAmount,
            }),
        }
    )
}

export const handleRecipeDeleteFromAdmin = async (id, userId) => {
    return await fetch(
        process.env.NODE_ENV === "production"
            ? `${import.meta.env.VITE_RECIPE_ENDPOINT}/admin/${id}`
            : `${import.meta.env.VITE_RECIPE_ENDPOINT_DEV}/admin/${id}`,
        {
            method: "DELETE",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                userId,
            }),
        }
    )
}

export const sortRecipes = (sortFilter, a, b) => {
    switch (sortFilter) {
        case "dateDesc": {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            if (dateA < dateB) {
                return 1
            }
            if (dateA > dateB) {
                return -1
            }
            return 0
        }
        case "dateAsc": {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            if (dateA < dateB) {
                return -1
            }
            if (dateA > dateB) {
                return 1
            }
            return 0
        }
        case "commentsAsc": {
            const commentsA = a.comments.length
            const commentsB = b.comments.length
            if (commentsA < commentsB) {
                return -1
            }
            if (commentsA > commentsB) {
                return 1
            }
            return 0
        }
        case "commentsDesc": {
            const commentsA = a.comments.length
            const commentsB = b.comments.length
            if (commentsA < commentsB) {
                return 1
            }
            if (commentsA > commentsB) {
                return -1
            }
            return 0
        }
        default:
            break
    }
}
export const sortUser = (sortFilter, a, b) => {
    switch (sortFilter) {
        case "emailDesc": {
            const emailA = a.email.toLowerCase()
            const emailB = b.email.toLowerCase()
            if (emailA < emailB) {
                return 1
            }
            if (emailA > emailB) {
                return -1
            }
            return 0
        }
        case "recipesAsc": {
            const recipesA = a.recipes.length
            const recipesB = b.recipes.length
            if (recipesA < recipesB) {
                return -1
            }
            if (recipesA > recipesB) {
                return 1
            }
            return 0
        }
        case "recipesDesc": {
            const recipesA = a.recipes.length
            const recipesB = b.recipes.length
            if (recipesA < recipesB) {
                return 1
            }
            if (recipesA > recipesB) {
                return -1
            }
            return 0
        }
        case "commentsAsc": {
            const commentsA = a.comments.length
            const commentsB = b.comments.length
            if (commentsA < commentsB) {
                return -1
            }
            if (commentsA > commentsB) {
                return 1
            }
            return 0
        }
        case "commentsDesc": {
            const commentsA = a.comments.length
            const commentsB = b.comments.length
            if (commentsA < commentsB) {
                return 1
            }
            if (commentsA > commentsB) {
                return -1
            }
            return 0
        }
        case "createdAsc": {
            const createdA = a.createdAt
            const createdB = b.createdAt
            if (createdA < createdB) {
                return -1
            }
            if (createdA > createdB) {
                return 1
            }
            return 0
        }
        case "createdDesc": {
            const createdA = a.createdAt
            const createdB = b.createdAt
            if (createdA < createdB) {
                return 1
            }
            if (createdA > createdB) {
                return -1
            }
            return 0
        }
        default:
            break
    }
}

export function handleCapsLockDetection(event) {
    if (!event.getModifierState) return
    if (event?.getModifierState("CapsLock")) {
        return true
    } else {
        return false
    }
}

export function validatePassword(event) {
    const passwordInput = event.target.value
    const passwordLength = passwordInput.length
    const specials = /[!@#$%^&*]/
    const hasSpecial = specials.test(passwordInput)
    const lowerCase = /[a-z]/
    const hasLowerCase = lowerCase.test(passwordInput)
    const upperCase = /[A-Z]/
    const hasUpperCase = upperCase.test(passwordInput)
    const numbers = /[0-9]/
    const hasNumbers = numbers.test(passwordInput)
    if (
        passwordLength >= 8 &&
        hasSpecial &&
        hasLowerCase &&
        hasUpperCase &&
        hasNumbers
    ) {
        return true
    } else {
        return false
    }
}
