"use client";

import { useSearchParams } from "next/navigation";
import styles from "./home.module.css";

export default function Home() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const details = searchParams.get("details");

  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Virumandi</h1>
      <p className={styles.subtitle}>
        A smart way to understand GitHub repositories. Analyze any public repo with detailed insights, 
        contributor stats, language breakdowns, and honest commentary.
      </p>

      {error && (
        <div style={{
          background: '#2a1515',
          border: '2px solid #ff4444',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          maxWidth: '600px',
          color: '#ff8888'
        }}>
          <strong>Authentication Error:</strong>{' '}
          {error === 'no_code' && 'No authorization code received from GitHub'}
          {error === 'auth_failed' && 'Failed to get access token from GitHub'}
          {error === 'server_error' && 'Server error during authentication'}
          {details && (
            <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#ffaaaa' }}>
              Details: {decodeURIComponent(details)}
            </div>
          )}
        </div>
      )}

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
