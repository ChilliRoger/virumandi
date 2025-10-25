import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Virumandi</h1>
      <p className={styles.subtitle}>
        A smart way to understand GitHub repositories. Analyze any public repo with detailed insights, 
        contributor stats, language breakdowns, and honest commentary.
      </p>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>Deep Analysis</h3>
          <p className={styles.featureDesc}>
            Get comprehensive insights including stars, forks, commits, contributors, and programming languages.
          </p>
        </div>
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>Honest Feedback</h3>
          <p className={styles.featureDesc}>
            Receive humorous and brutally honest commentary about the repository&apos;s popularity and activity.
          </p>
        </div>
        <div className={styles.feature}>
          <h3 className={styles.featureTitle}>Beautiful UI</h3>
          <p className={styles.featureDesc}>
            Modern Bento-style layout with clean design, responsive across all devices.
          </p>
        </div>
      </div>

      <a href="http://localhost:3001/auth/login" className={styles.loginButton}>
        Login with GitHub
      </a>
    </div>
  );
}
