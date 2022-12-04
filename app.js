const searchBtn = document.getElementById('search-btn')
const mealList = document.getElementById('meal')
const mealDetailsContent = document.querySelector('.meal-details-content')
const recipeCloseBtn = document.getElementById('recipe-close-btn')

searchBtn.addEventListener('click', getMealList)
mealList.addEventListener('click', getMealRecipe)
recipeCloseBtn.addEventListener('click', () => {
	mealDetailsContent.parentElement.classList.remove('showRecipe')
	document.body.classList.remove('no-scroll')
})
window.addEventListener('load', getMealList)

async function getMealList() {
	let searchInput = document.getElementById('search-input')

	try {
		const response = await fetch(
			`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInput.value.trim()}`
		)
		const data = await response.json()
		let html = ''

		localStorage.setItem('data', JSON.stringify(data.meals))

		if (data.meals) {
			const mealData = JSON.parse(localStorage.getItem('data'))
			console.log(mealData)

			mealData.forEach(meal => {
				html += `
				<div class="meal-item" data-id="${meal.idMeal}">
					<div class="meal-img">
						<img
							src="${meal.strMealThumb}"
						/>
					</div>
					<div class="meal-name">
						<h3>${meal.strMeal}</h3>
						<a class="recipe-btn" href="#">Get Recipe</a>
					</div>
				</div>
          `
			})
			mealList.classList.remove('notFound')
			searchInput.value = ''
		} else {
			html = "Sorry, we didn't find any meal"
			searchInput.value = ''
			mealList.classList.add('notFound')
		}

		meal.innerHTML = html
	} catch (error) {
		console.error(error)
	}
}

async function getMealRecipe(e) {
	e.preventDefault()

	if (e.target.classList.contains('recipe-btn')) {
		let mealItem = e.target.parentElement.parentElement

		try {
			const response = await fetch(
				`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
			)
			const data = await response.json()
			mealRecipeModal(data.meals)
		} catch (error) {
			console.error(error)
		}
	}
}

function mealRecipeModal(meal) {
	meal = meal[0]

	let html = `
		<h2 class="recipe-title">${meal.strMeal}</h2>
		<p class="recipe-category">${meal.strCategory}</p>
		<div class="recipe-instruct">
			<h3>Instructions:</h3>
			<p>${meal.strInstructions}</p>
		</div>
		<div class="recipe-meal-img">
			<img
				src="${meal.strMealThumb}"
				alt="meal"
			/>
		</div>
		<div class="recipe-link">
			<a href="${meal.strYoutube}" target="_blank">Watch Video</a>
		</div>
	`

	mealDetailsContent.innerHTML = html
	mealDetailsContent.parentElement.classList.add('showRecipe')
	document.body.classList.add('no-scroll')
}
