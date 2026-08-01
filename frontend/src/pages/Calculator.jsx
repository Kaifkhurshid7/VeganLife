import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaLeaf, FaFire, FaWeight } from 'react-icons/fa';
import BackButton from '../components/ui/BackButton';
import styles from './Calculator.module.css';

const VEGAN_MEAL_SUGGESTIONS = {
  deficit: [
    'High-protein lentil soup (320 kcal, 22g protein)',
    'Tofu stir-fry with vegetables (280 kcal, 18g protein)',
    'Chickpea salad bowl (350 kcal, 15g protein)',
  ],
  maintain: [
    'Buddha bowl with quinoa & tahini (510 kcal, 19g protein)',
    'Sweet potato & black bean tacos (490 kcal, 14g protein)',
    'Creamy lentil curry with brown rice (580 kcal, 22g protein)',
  ],
  surplus: [
    'Hemp seed smoothie with banana & PB (650 kcal, 28g protein)',
    'Loaded tempeh burrito bowl (720 kcal, 32g protein)',
    'Pasta with walnut pesto & nutritional yeast (680 kcal, 24g protein)',
  ],
};

function calculateBMI(weight, height) {
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'var(--color-orange)' };
  if (bmi < 25) return { label: 'Normal', color: 'var(--color-sage)' };
  if (bmi < 30) return { label: 'Overweight', color: 'var(--color-orange)' };
  return { label: 'Obese', color: 'var(--color-purple)' };
}

function calculateCalories(weight, height, age, gender, activity) {
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  return Math.round(bmr * (multipliers[activity] || 1.55));
}

export default function Calculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!weight || !height || !age) return;

    const bmi = calculateBMI(Number(weight), Number(height));
    const tdee = calculateCalories(Number(weight), Number(height), Number(age), gender, activity);

    let targetCalories = tdee;
    if (goal === 'lose') targetCalories = tdee - 400;
    if (goal === 'gain') targetCalories = tdee + 400;

    const protein = Math.round(Number(weight) * 1.6);
    const fats = Math.round((targetCalories * 0.25) / 9);
    const carbs = Math.round((targetCalories - protein * 4 - fats * 9) / 4);

    const mealType = goal === 'lose' ? 'deficit' : goal === 'gain' ? 'surplus' : 'maintain';

    setResults({ bmi, bmiCategory: getBMICategory(bmi), tdee, targetCalories, protein, fats, carbs, meals: VEGAN_MEAL_SUGGESTIONS[mealType] });
  };

  return (
    <section className={styles.section}>
      <BackButton />
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.label}>Vegan Wellness</span>
          <h1 className={styles.title}>BMI & Calorie Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your body metrics and get personalized vegan meal recommendations.
          </p>
        </motion.div>

        <div className={styles.grid}>
          <motion.form
            className={`glass-card ${styles.form}`}
            onSubmit={handleCalculate}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className={styles.formTitle}><FaCalculator /> Your Details</h3>

            <div className={styles.inputGroup}>
              <label>Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="65" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Height (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="22" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Gender</label>
              <div className={styles.toggleGroup}>
                <motion.button type="button" className={gender === 'male' ? styles.active : ''} onClick={() => setGender('male')} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>Male</motion.button>
                <motion.button type="button" className={gender === 'female' ? styles.active : ''} onClick={() => setGender('female')} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>Female</motion.button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Activity Level</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="sedentary">Sedentary (desk job)</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="very_active">Very Active (athlete)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Goal</label>
              <div className={styles.toggleGroup}>
                <motion.button type="button" className={goal === 'lose' ? styles.active : ''} onClick={() => setGoal('lose')} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>Lose</motion.button>
                <motion.button type="button" className={goal === 'maintain' ? styles.active : ''} onClick={() => setGoal('maintain')} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>Maintain</motion.button>
                <motion.button type="button" className={goal === 'gain' ? styles.active : ''} onClick={() => setGoal('gain')} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>Gain</motion.button>
              </div>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
              Calculate
            </button>
          </motion.form>

          {results && (
            <div className={styles.results}>
              <motion.div
                className={`glass-card ${styles.resultCard}`}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
              >
                <FaWeight className={styles.resultIcon} />
                <h4>BMI</h4>
                <p className={styles.resultValue}>{results.bmi}</p>
                <span className={styles.resultBadge} style={{ color: results.bmiCategory.color }}>
                  {results.bmiCategory.label}
                </span>
              </motion.div>

              <motion.div
                className={`glass-card ${styles.resultCard}`}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
              >
                <FaFire className={styles.resultIcon} />
                <h4>Daily Calories</h4>
                <p className={styles.resultValue}>{results.targetCalories}</p>
                <span className={styles.resultBadge}>kcal/day</span>
              </motion.div>

              <motion.div
                className={`glass-card ${styles.macroCard}`}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.5, delay: 0.26 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
              >
                <h4>Macro Split (Vegan Optimized)</h4>
                <div className={styles.macros}>
                  {[
                    { value: `${results.protein}g`, label: 'Protein' },
                    { value: `${results.carbs}g`, label: 'Carbs' },
                    { value: `${results.fats}g`, label: 'Fats' },
                  ].map((m) => (
                    <motion.div
                      key={m.label}
                      className={styles.macro}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <span className={styles.macroValue}>{m.value}</span>
                      <span className={styles.macroLabel}>{m.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className={`glass-card ${styles.mealsCard}`}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.5, delay: 0.34 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
              >
                <h4><FaLeaf /> Suggested Vegan Meals</h4>
                <ul className={styles.mealList}>
                  {results.meals.map((meal) => (
                    <motion.li
                      key={meal}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {meal}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
