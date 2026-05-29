import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './ParallaxLayers.module.css';

export default function ParallaxLayers() {
  const { scrollYProgress } = useScroll();

  const cloudsY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const hillsBackY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const hillsFrontY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const treesY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className={styles.container} aria-hidden="true">
      {/* Distant clouds */}
      <motion.div className={styles.layer} style={{ y: cloudsY }}>
        <svg className={styles.clouds} viewBox="0 0 1200 100" preserveAspectRatio="none">
          <ellipse cx="200" cy="50" rx="80" ry="25" fill="rgba(247,240,230,0.3)" />
          <ellipse cx="600" cy="35" rx="100" ry="30" fill="rgba(247,240,230,0.2)" />
          <ellipse cx="950" cy="55" rx="70" ry="20" fill="rgba(247,240,230,0.25)" />
        </svg>
      </motion.div>

      {/* Back hills */}
      <motion.div className={`${styles.layer} ${styles.hillsBack}`} style={{ y: hillsBackY }}>
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className={styles.hillSvg}>
          <path
            d="M0,200 C200,120 400,160 600,130 C800,100 1000,150 1200,110 L1200,200 Z"
            fill="rgba(166,180,143,0.08)"
          />
        </svg>
      </motion.div>

      {/* Trees silhouette */}
      <motion.div className={`${styles.layer} ${styles.trees}`} style={{ y: treesY }}>
        <svg viewBox="0 0 1200 150" preserveAspectRatio="none" className={styles.treeSvg}>
          <path d="M50,150 L55,80 L45,90 L52,50 L42,65 L50,20 L58,65 L48,50 L55,90 L45,80 L50,150Z" fill="rgba(87,61,33,0.04)" />
          <path d="M150,150 L155,90 L145,100 L152,60 L142,75 L150,30 L158,75 L148,60 L155,100 L145,90 L150,150Z" fill="rgba(87,61,33,0.03)" />
          <path d="M1050,150 L1055,85 L1045,95 L1052,55 L1042,70 L1050,25 L1058,70 L1048,55 L1055,95 L1045,85 L1050,150Z" fill="rgba(87,61,33,0.04)" />
          <path d="M1130,150 L1135,95 L1125,105 L1132,70 L1122,82 L1130,40 L1138,82 L1128,70 L1135,105 L1125,95 L1130,150Z" fill="rgba(87,61,33,0.03)" />
        </svg>
      </motion.div>

      {/* Front hills */}
      <motion.div className={`${styles.layer} ${styles.hillsFront}`} style={{ y: hillsFrontY }}>
        <svg viewBox="0 0 1200 150" preserveAspectRatio="none" className={styles.hillSvg}>
          <path
            d="M0,150 C150,100 350,130 550,90 C750,50 950,110 1200,80 L1200,150 Z"
            fill="rgba(166,180,143,0.05)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
