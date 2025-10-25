import axios from "axios";

export const loginRoute = (req, res) => {
  const redirect = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
  res.redirect(redirect);
};

export const callbackRoute = async (req, res) => {
  try {
    const code = req.query.code;
    
    if (!code) {
      return res.redirect(`http://localhost:3000?error=no_code`);
    }
    
    const data = await axios.post(`https://github.com/login/oauth/access_token`, {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, { headers: { Accept: "application/json" } });

    const token = data.data.access_token;
    
    if (!token) {
      return res.redirect(`http://localhost:3000?error=auth_failed`);
    }
    
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect(`http://localhost:3000?error=server_error`);
  }
};
