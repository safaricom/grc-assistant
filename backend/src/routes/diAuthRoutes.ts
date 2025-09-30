import { Router } from "express";
import pkceChallenge from "pkce-challenge";
import axios from "axios";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = Router();

const {
  DI_CLIENT_ID,
  DI_CLIENT_SECRET,
  SSO_REDIRECT_URL,
  SSO_AUTHORIZATION_URL,
  SSO_TOKEN_URL,
  SSO_USERINFO_URL,
  JWT_SECRET,
  FRONTEND_ORIGIN,
  DI_REALM_ID,
} = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// 1. Login Initiation
router.get("/login", async (req, res) => {
  if (!SSO_AUTHORIZATION_URL || !DI_CLIENT_ID || !SSO_REDIRECT_URL) {
    return res.status(500).json({ error: "DI configuration is missing." });
  }

  const challenge = await pkceChallenge();
  const { code_challenge, code_verifier } = challenge;

  res.cookie("code_verifier", code_verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: "lax",
  });

  const params = new URLSearchParams({
    scope: "openid,email,phone,profile",
    response_type: "code",
    client_id: DI_CLIENT_ID,
    redirect_uri: SSO_REDIRECT_URL,
    state: "1234", // Should be a random string for production
    nonce: "nonce", // Should be a random string for production
    code_challenge: code_challenge,
    code_challenge_method: "S256",
  });

  const authorizationUrl = `${SSO_AUTHORIZATION_URL}?${params.toString()}`;
  res.redirect(authorizationUrl);
});

// 2. Callback Handling
router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const code_verifier = req.cookies.code_verifier;

  if (!code || typeof code !== "string") {
    return res.redirect(`${FRONTEND_ORIGIN}/login?error=missing_code`);
  }

  if (!code_verifier) {
    return res.redirect(`${FRONTEND_ORIGIN}/login?error=missing_verifier`);
  }

  // Clear the cookie now that we've used it
  res.clearCookie("code_verifier");

  try {
    // 3. Token Exchange
    const tokenResponse = await axios.post(
      SSO_TOKEN_URL!,
      {
        client_id: DI_CLIENT_ID,
        client_secret: DI_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: SSO_REDIRECT_URL,
        code: code,
        code_verifier: code_verifier,
        realm_id: DI_REALM_ID || null,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    if (!access_token) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=token_exchange_failed`);
    }

    // 4. User Info Fetch
    const userInfoResponse = await axios.get(SSO_USERINFO_URL!, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userInfoResponse.data;
    const email = userInfo.email;

    if (!email) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=no_email_in_profile`);
    }

    // 5. User Upsert (Find or Create)
    let user = await db.query.users.findFirst({ where: eq(users.email, email) });

    if (user) {
      // User exists, update their DI info if needed
      await db
        .update(users)
        .set({
          // diId: userInfo.sub, // Assuming 'sub' is the unique ID from DI
          name: user.name || userInfo.name,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
      // Refresh user object with updated data
      user = await db.query.users.findFirst({ where: eq(users.id, user.id) });
    } else {
      // User does not exist, create a new one
      const [newUser] = await db
        .insert(users)
        .values({
          // diId: userInfo.sub,
          email: email,
          name: userInfo.name,
          passwordHash: "di-user-no-password", // Mark as non-loginable with local password
        })
        .returning();
      user = newUser;
    }
    
    if (!user) {
        return res.redirect(`${FRONTEND_ORIGIN}/login?error=user_sync_failed`);
    }

    // 6. Generate Application JWT
    const appToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 7. Redirect to Frontend
    const userQuery = encodeURIComponent(JSON.stringify(user));
    res.redirect(
      `${FRONTEND_ORIGIN}/auth/callback?token=${appToken}&user=${userQuery}`
    );
  } catch (error) {
    console.error("DI Callback Error:", error);
    const message = axios.isAxiosError(error) ? error.response?.data?.error_description || error.message : "An unknown error occurred";
    res.redirect(`${FRONTEND_ORIGIN}/login?error=${encodeURIComponent(message)}`);
  }
});

export default router;
