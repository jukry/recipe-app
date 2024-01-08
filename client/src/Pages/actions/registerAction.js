import { redirect } from "react-router-dom"

export async function action({ request }) {
    const formData = await request.formData()
    async function registerUser() {
        return await fetch(
            process.env.NODE_ENV === "production"
                ? import.meta.env.VITE_REGISTER_ENDPOINT
                : import.meta.env.VITE_REGISTER_ENDPOINT_DEV,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: await formData.get("email"),
                    password: await formData.get("password"),
                }),
            }
        )
    }
    const res = await registerUser()

    if (!res.ok) {
        return res.status
    } else {
        async function loginUser() {
            return await fetch(
                process.env.NODE_ENV === "production"
                    ? import.meta.env.VITE_AUTH_ENDPOINT
                    : import.meta.env.VITE_AUTH_ENDPOINT_DEV,
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: await formData.get("email"),
                        password: await formData.get("password"),
                    }),
                }
            )
        }
        const res = await loginUser()
        if (!res.ok) {
            return res.status
        } else {
            location.replace("/account")
            return redirect("/account")
        }
    }
}
