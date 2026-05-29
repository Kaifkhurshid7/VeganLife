const nutrition = [
  { food: "Lentils", protein: "18g", iron: "6mg", calories: "230" },
  { food: "Tofu", protein: "15g", iron: "5mg", calories: "144" },
  { food: "Chickpeas", protein: "14g", iron: "4mg", calories: "269" },
  { food: "Soy Milk", protein: "8g", iron: "1mg", calories: "100" }
]

export default function Nutrition() {
  return (
    <section className="nutrition">
      <div className="title-block">
        <h2>Nutrition Guide</h2>

        <p>
          Learn about essential nutrients and high-protein
          plant-based foods suitable for students.
        </p>
      </div>

      <div className="nutrition-table">
        <div className="table-head">
          <span>Food</span>
          <span>Protein</span>
          <span>Iron</span>
          <span>Calories</span>
        </div>

        {nutrition.map((item, index) => (
          <div className="table-row" key={index}>
            <span>{item.food}</span>
            <span>{item.protein}</span>
            <span>{item.iron}</span>
            <span>{item.calories}</span>
          </div>
        ))}
      </div>
    </section>
  )
}