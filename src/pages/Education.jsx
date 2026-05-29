const cards = [
  {
    title: "Environment",
    desc: "Plant-based diets reduce greenhouse gas emissions, water waste, and deforestation."
  },
  {
    title: "Health",
    desc: "Vegan meals can be rich in protein, vitamins, and nutrients while remaining affordable."
  },
  {
    title: "Compassion",
    desc: "Ethical food choices help reduce animal suffering and promote conscious living."
  }
]

export default function Education() {
  return (
    <section className="section">
      <div className="title-block">
        <h2>Why Veganism?</h2>

        <p>
          Veganism supports a healthier planet, healthier lifestyle,
          and a more sustainable future.
        </p>
      </div>

      <div className="card-grid">
        {cards.map((card, index) => (
          <div className="info-card" key={index}>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}