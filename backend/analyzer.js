import axios from "axios";

export async function analyzeRepo(url, token) {
  try {
    // Validate URL and clean it
    const cleanUrl = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
    const urlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+$/;
    if (!urlPattern.test(cleanUrl)) {
      throw new Error("Invalid GitHub repository URL");
    }

    const parts = cleanUrl.split("/");
    const owner = parts[3];
    const repo = parts[4];

    if (!owner || !repo) {
      throw new Error("Could not extract owner and repository from URL");
    }

    const headers = { Authorization: `token ${token}` };

    // Fetch all data in parallel
    const [repoInfo, contributors, languages, commits] = await Promise.all([
      axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers }).then(res => res.data),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`, { headers }).then(res => res.data),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }).then(res => res.data),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers })
    ]);

    // Extract commit count from Link header
    const linkHeader = commits.headers.link;
    let commitCount = 0;
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      commitCount = match ? parseInt(match[1]) : commits.data.length;
    } else {
      commitCount = commits.data.length;
    }

    // Format contributors
    const contributorsList = contributors.map(c => ({
      login: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
      profile: c.html_url
    }));

    // Calculate total language bytes for percentages
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const languageBreakdown = Object.entries(languages).map(([lang, bytes]) => ({
      name: lang,
      bytes,
      percentage: ((bytes / totalBytes) * 100).toFixed(1)
    })).sort((a, b) => b.bytes - a.bytes);

    const roast = roastRepo(repoInfo, commitCount, contributors.length);

    return {
      name: repoInfo.name,
      description: repoInfo.description || "No description provided",
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      openIssues: repoInfo.open_issues_count,
      watchers: repoInfo.watchers_count,
      commits: commitCount,
      contributors: contributorsList,
      languages: languageBreakdown,
      createdAt: repoInfo.created_at,
      updatedAt: repoInfo.updated_at,
      roast
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Repository not found or is private");
    } else if (error.response?.status === 401) {
      throw new Error("Invalid or expired GitHub token");
    } else if (error.response?.status === 403) {
      throw new Error("GitHub API rate limit exceeded");
    }
    throw error;
  }
}

function roastRepo(repo, commits, contributorsCount) {
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  const issues = repo.open_issues_count;

  // Multiple roast conditions for variety
  if (stars === 0 && forks === 0) {
    return "Zero stars, zero forks. This repo is lonelier than a developer on Valentine's Day.";
  }
  
  if (forks < 1) {
    return "Nobody wanted to fork this. Even your friends don't trust your code.";
  }
  
  if (stars < 5) {
    return "This repo has fewer stars than a cloudy night sky. Maybe add a README?";
  }
  
  if (issues > stars * 2) {
    return "More issues than stars. This isn't a repository, it's a bug sanctuary.";
  }
  
  if (commits < 10) {
    return "Less than 10 commits? Did you get distracted by another 'revolutionary' side project?";
  }
  
  if (contributorsCount === 1 && stars < 10) {
    return "Solo project with single-digit stars. At least you're committed to your loneliness.";
  }
  
  if (stars > 100 && forks < 10) {
    return "People star it but won't fork it. Like a museum piece: nice to look at, too scary to touch.";
  }
  
  if (stars > 1000) {
    return "Look at you with over 1k stars! Still not making any money from it though, are you?";
  }
  
  if (stars > 100) {
    return "Pretty decent repo! You must have tweeted about it at least once.";
  }

  return "Decent work. Not bad. Not great. Just… there. Like most side projects.";
}
