import axios from "axios";

export const loginRoute = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    console.error("ERROR: GITHUB_CLIENT_ID is not set in environment variables");
    return res.status(500).send("Server configuration error: Missing GitHub Client ID");
  }
  
  console.log("Redirecting to GitHub OAuth with client_id:", clientId);
  const redirect = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user,public_repo`;
  res.redirect(redirect);
};

export const callbackRoute = async (req, res) => {
  try {
    const code = req.query.code;
    
    console.log("OAuth callback received with code:", code ? "YES" : "NO");
    
    if (!code) {
      console.error("ERROR: No authorization code received from GitHub");
      return res.redirect(`http://localhost:3000?error=no_code`);
    }
    
    console.log("Exchanging code for access token...");
    const response = await axios.post(`https://github.com/login/oauth/access_token`, {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, { headers: { Accept: "application/json" } });

    console.log("GitHub response:", response.data);
    const token = response.data.access_token;
    
    if (!token) {
      console.error("ERROR: No access token in GitHub response:", response.data);
      return res.redirect(`http://localhost:3000?error=auth_failed&details=${encodeURIComponent(JSON.stringify(response.data))}`);
    }
    
    console.log("Authentication successful, redirecting with token");
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  } catch (error) {
    console.error("OAuth callback error:", error.message);
    console.error("Error details:", error.response?.data || error);
    res.redirect(`http://localhost:3000?error=server_error&details=${encodeURIComponent(error.message)}`);
  }
};
