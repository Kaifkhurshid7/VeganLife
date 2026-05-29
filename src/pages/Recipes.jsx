const meals = [
  {
    title: "Protein Bowl",
    desc: "High protein affordable vegan meal."
  },
  {
    title: "Green Smoothie",
    desc: "Quick healthy breakfast recipe."
  },
  {
    title: "Tofu Wrap",
    desc: "Fast student-friendly dinner."
  }
]

export default function Recipes() {
  return (
    <section className="section">
      <div className="title-block">
        <h2>Student Friendly Meals</h2>
      </div>

      <div className="recipe-grid">
        {meals.map((meal, index) => (
          <div className="recipe-card" key={index}>
            <div className={`recipe-image recipe-${index}`}></div>

            <h3>{meal.title}</h3>
            <p>{meal.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}