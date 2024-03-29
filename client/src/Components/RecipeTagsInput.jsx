import React, { Fragment } from "react"
import "./Styles/recipeTagsInput.css"
import recipetags from "../utils/recipetags.js"

export default function RecipeTagsInput({ props }) {
    const [recipe, setRecipe] = props

    const renderTags = () => {
        return recipetags.map((tag) => {
            return (
                <Fragment key={tag}>
                    <label
                        htmlFor={tag}
                        className={`recipe-tag ${
                            recipe?.tags?.includes(tag) ? "selected-tag" : ""
                        }`}
                    >
                        {tag}
                        <input
                            type="checkbox"
                            id={tag}
                            className="visuallyhidden"
                            aria-checked={recipe?.tags?.includes(tag)}
                            onChange={(e) => {
                                const tags = recipe?.tags || []
                                if (!recipe?.tags?.includes(tag)) {
                                    tags.push(tag)
                                    setRecipe((prev) => ({
                                        ...prev,
                                        tags: tags,
                                    }))
                                } else {
                                    tags.splice(tags.indexOf(tag), 1)
                                    setRecipe((prev) => ({
                                        ...prev,
                                        tags: tags,
                                    }))
                                }
                            }}
                        ></input>
                    </label>
                </Fragment>
            )
        })
    }
    const renderedTags = renderTags()

    return (
        <section id="recipe-tags">
            <h4 tabIndex={0}>Reseptin tunnisteet:</h4>
            <div id="tag-container">{renderedTags}</div>
        </section>
    )
}
