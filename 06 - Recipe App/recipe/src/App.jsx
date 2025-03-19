import React, { useState } from "react";

const App = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);

  // Fetch Recipes from API
  const showRecipe = async () => {
    if (!search.trim()) {
      alert("Please enter a search term!");
      return;
    }

    try {
      const data = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
      );
      const response = await data.json();

      if (response.meals) {
        setRecipes(response.meals);
      } else {
        setRecipes([]);
        alert("No recipes found!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Recipe Generator</h1>

      <div className="flex gap-2">
        <input
          type="search"
          placeholder="Search recipe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={showRecipe}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Recipe Display */}
      <div className="mt-6">
        {recipes.length > 0 ? (
          recipes.map((meal) => (
            <div key={meal.idMeal} className="border p-4 mb-4 rounded shadow">
              <h2 className="text-xl font-semibold">{meal.strMeal}</h2>
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full max-w-sm rounded mt-2"
              />
              <p className="mt-2">
                <strong>Category:</strong> {meal.strCategory}
              </p>
              <p>
                <strong>Area:</strong> {meal.strArea}
              </p>

              <p className="mt-2">
                <strong>Instructions:</strong> {meal.strInstructions}
              </p>
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 mt-2 block"
              >
                Watch on YouTube
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No recipes to display.</p>
        )}
      </div>
    </div>
  );
};

export default App;
