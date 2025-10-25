"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if token is missing and redirect to login
  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <strong>Authentication Required:</strong> No token found. Please log in with GitHub.
          <br /><br />
          <a href="http://localhost:3001/auth/login" style={{ color: '#3468eb', textDecoration: 'underline' }}>
            Click here to log in
          </a>
        </div>
      </div>
    );
  }

  async function analyze() {
    if (!repoUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    if (!token) {
      setError("Authentication token missing. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl, token })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      analyze();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Repository Analyzer</h1>
        <p className={styles.subtitle}>Enter any public GitHub repository URL to get detailed insights</p>
      </div>

      <div className={styles.inputSection}>
        <input
          className={styles.input}
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://github.com/username/repository"
          disabled={loading}
          title="Enter a GitHub repository URL (with or without .git)"
        />
        <button 
          className={styles.button} 
          onClick={analyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          Fetching repository data...
        </div>
      )}

      {result && (
        <>
          {/* Roast Box - Most Prominent */}
          <div className={styles.bentoGrid}>
            <div className={styles.roastBox}>
              <div className={styles.roastTitle}>THE VERDICT</div>
              <div className={styles.roastText}>{result.roast}</div>
            </div>

            {/* Main Info */}
            <div className={styles.mainInfoBox}>
              <h2 className={styles.repoName}>{result.name}</h2>
              <p className={styles.repoDescription}>{result.description}</p>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{result.stars.toLocaleString()}</div>
                  <div className={styles.statLabel}>Stars</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{result.forks.toLocaleString()}</div>
                  <div className={styles.statLabel}>Forks</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{result.commits.toLocaleString()}</div>
                  <div className={styles.statLabel}>Commits</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{result.contributors.length}</div>
                  <div className={styles.statLabel}>Contributors</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{result.openIssues.toLocaleString()}</div>
                  <div className={styles.statLabel}>Open Issues</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{result.watchers.toLocaleString()}</div>
                  <div className={styles.statLabel}>Watchers</div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className={styles.languagesBox}>
              <h3 className={styles.boxTitle}>Languages</h3>
              {result.languages.map((lang) => (
                <div key={lang.name} className={styles.languageItem}>
                  <div className={styles.languageHeader}>
                    <span className={styles.languageName}>{lang.name}</span>
                    <span className={styles.languagePercent}>{lang.percentage}%</span>
                  </div>
                  <div className={styles.languageBar}>
                    <div 
                      className={styles.languageFill} 
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Contributors */}
            <div className={styles.contributorsBox}>
              <h3 className={styles.boxTitle}>Top Contributors</h3>
              <div className={styles.contributorsList}>
                {result.contributors.map((contributor) => (
                  <a 
                    key={contributor.login}
                    href={contributor.profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contributor}
                  >
                    <Image 
                      src={contributor.avatar} 
                      alt={contributor.login}
                      className={styles.contributorAvatar}
                      width={48}
                      height={48}
                    />
                    <div className={styles.contributorInfo}>
                      <div className={styles.contributorName}>{contributor.login}</div>
                      <div className={styles.contributorCommits}>
                        {contributor.contributions.toLocaleString()} contributions
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className={styles.datesBox}>
              <div className={styles.dateItem}>
                <div className={styles.dateLabel}>Created</div>
                <div className={styles.dateValue}>{formatDate(result.createdAt)}</div>
              </div>
              <div className={styles.dateItem}>
                <div className={styles.dateLabel}>Last Updated</div>
                <div className={styles.dateValue}>{formatDate(result.updatedAt)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
