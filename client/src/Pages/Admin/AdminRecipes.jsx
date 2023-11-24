import { useQuery } from "@tanstack/react-query"
import fetchAllRecipeData from "../../Hooks/fetchAllRecipeData"
import React, { useState } from "react"
import Paginate from "../../Components/Paginate"
import "./styles/adminRecipes.css"
import { NavLink, useSearchParams } from "react-router-dom"
import { handleRecipeDeleteFromAdmin, sortRecipes } from "../../utils/utils"
import DeleteModal from "../../Components/DeleteModal"
import { createPortal } from "react-dom"

export default function AdminRecipes() {
    const queryResponseRecipes = useQuery(["allrecipes"], fetchAllRecipeData)
    const recipeData = queryResponseRecipes?.data?.message ?? []
    const [currentPage, setCurrentPage] = useState(1)
    const initialRecipes = 20
    const [recipesSearchParams, setRecipesSearchParams] = useSearchParams()
    const [recipeNameFilter, setRecipeNameFilter] = useState(
        recipesSearchParams?.get("name") || ""
    )
    const [recipeEmailFilter, setRecipeEmailFilter] = useState(
        recipesSearchParams?.get("email") || ""
    )
    const [sortFilter, setSortFilter] = useState("dateDesc")
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [recipeToDelete, setRecipeToDelete] = useState({
        name: "",
        _id: "",
        userId: "",
    })

    const recipes = recipeData
        .sort((a, b) => {
            return sortRecipes(sortFilter, a, b)
        })
        .filter((recipe) => {
            return recipe?.name
                ?.toLowerCase()
                .includes(recipeNameFilter.toLowerCase())
        })
        .filter((recipe) => {
            return recipe?.user?.email
                ?.toLowerCase()
                .includes(recipeEmailFilter.toLowerCase())
        })
        .map((recipe) => {
            return (
                <div className="admin-recipe-container" key={recipe._id}>
                    <section className="admin-recipedata-container">
                        <h4 tabIndex={0}>
                            <span className="visuallyhidden">Resepti</span>
                            {recipe?.name}
                        </h4>
                        <p tabIndex={0}>Käyttäjä: {recipe?.user?.email}</p>
                        <p tabIndex={0}>Resepti id: {recipe?._id}</p>
                        <p tabIndex={0}>
                            Resepti luotu:{" "}
                            {new Date(recipe?.createdAt).toLocaleDateString(
                                "fi-FI"
                            )}
                        </p>
                        <p>
                            <NavLink
                                to={`../comments?recipeId=${recipe?._id}`}
                                className="navlink-to"
                            >
                                Kommentit: {recipe?.comments?.length}
                            </NavLink>
                        </p>
                    </section>
                    <button
                        className="admin-delete-recipe"
                        onClick={() => {
                            setRecipeToDelete({
                                name: recipe?.name,
                                _id: recipe?._id,
                                userId: recipe?.user._id,
                            })
                            setShowDeleteModal(true)
                        }}
                    >
                        Poista resepti
                    </button>
                </div>
            )
        })
    const maxPages = Math.ceil(recipes?.length / initialRecipes)

    const slicedRecipes = recipes?.slice(
        (currentPage - 1) * initialRecipes,
        initialRecipes * currentPage
    )

    return (
        <section id="admin-recipes-container">
            <h3 tabIndex={0}>Reseptit</h3>
            <div id="admin-recipes-pagination-container">
                <Paginate
                    currentPage={currentPage}
                    maxPages={maxPages}
                    containerId="admin-recipes-nav-container"
                    backBtnId="admin-recipes-nav-back"
                    forwardBtnId="admin-recipes-nav-forward"
                    setCurrentPage={setCurrentPage}
                />
            </div>
            <div id="admin-recipes-filter-container">
                <div id="admin-recipes-email-filter-container">
                    <label
                        htmlFor="admin-recipe-filter-recipe-name"
                        id="admin-recipe-filter-recipe-name-label"
                    >
                        Suodata reseptin nimellä
                    </label>
                    <input
                        type="search"
                        id="admin-recipe-filter-recipe-name"
                        value={recipeNameFilter}
                        onChange={(e) => {
                            setRecipeNameFilter(e.target.value)
                            setRecipesSearchParams({ name: e.target.value })
                        }}
                    />
                    <label
                        htmlFor="admin-recipe-filter-email"
                        id="admin-recipe-filter-email-label"
                    >
                        Suodata reseptin tekijän sähköpostilla
                    </label>
                    <input
                        type="search"
                        id="admin-recipe-filter-email"
                        value={recipeEmailFilter}
                        onChange={(e) => {
                            setRecipeEmailFilter(e.target.value)
                            setRecipesSearchParams({ email: e.target.value })
                        }}
                    />
                </div>
                <label
                    htmlFor="admin-recipes-sort"
                    id="admin-recipes-sort-label"
                >
                    Lajittele tulokset
                </label>
                <select
                    id="admin-recipes-sort"
                    value={sortFilter}
                    onChange={(e) => {
                        setSortFilter(e.target.value)
                    }}
                >
                    <option value="dateDesc">Luontipäivämäärä: nouseva</option>
                    <option value="dateAsc">Luontipäivämäärä: laskeva</option>
                    <option value="commentsAsc">Kommentit: nouseva</option>
                    <option value="commentsDesc">Kommentit: laskeva</option>
                </select>
                <p tabIndex={0}>Tuloksia: {recipes?.length}</p>
            </div>
            <div id="admin-recipes-wrapper">{slicedRecipes}</div>
            {showDeleteModal &&
                createPortal(
                    <DeleteModal
                        props={{
                            text: "Haluatko varmasti poistaa reseptin ",
                            name: recipeToDelete?.name,
                        }}
                        onDelete={async () => {
                            const res = await handleRecipeDeleteFromAdmin(
                                recipeToDelete?._id,
                                recipeToDelete?.userId
                            )

                            if (res.ok) {
                                queryResponseRecipes?.refetch()
                            } else if (!res.ok) {
                                document
                            }
                        }}
                        onClose={(event) => {
                            if (event.target.className !== "delete-modal") {
                                event.preventDefault()
                                setShowDeleteModal(false)
                            }
                        }}
                    />,
                    document.getElementById("container")
                )}
        </section>
    )
}
