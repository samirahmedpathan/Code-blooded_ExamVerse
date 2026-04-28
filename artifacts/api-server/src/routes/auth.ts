import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { eq, and, gt, isNull } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { db, usersTable, passwordResetsTable } from "@workspace/db";
import {
  hashPassword,
  verifyPassword,
  signToken,
  generateResetToken,
  hashResetToken,
  requireAuth,
  type AuthedRequest,
} from "../lib/auth";

const googleClientId = process.env["GOOGLE_CLIENT_ID"];
const googleClient = googleClientId
  ? new OAuth2Client(googleClientId)
  : null;

const router: IRouter = Router();

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  password: z.string().min(8).max(128),
  targetExam: z.string().min(1).max(20).optional(),
  language: z.string().min(1).max(10).optional(),
});

const loginSchema = z.object({
  emailOrName: z.string().min(1).max(160),
  password: z.string().min(1).max(128),
});

const forgotSchema = z.object({
  email: z.string().email().max(160),
});

const resetSchema = z.object({
  token: z.string().min(20).max(200),
  password: z.string().min(8).max(128),
});

const googleSchema = z.object({
  idToken: z.string().min(20).max(4096),
  targetExam: z.string().min(1).max(20).optional(),
  language: z.string().min(1).max(10).optional(),
});

function publicUser(u: typeof usersTable.$inferSelect) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    targetExam: u.targetExam,
    language: u.language,
  };
}

router.post("/auth/signup", async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  const { name, email, password, targetExam, language } = parsed.data;
  const emailLower = email.trim().toLowerCase();

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.emailLower, emailLower))
    .limit(1);
  if (existing) {
    res
      .status(409)
      .json({ error: "An account with this email already exists. Please log in instead." });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      emailLower,
      passwordHash,
      targetExam: targetExam ?? "JEE",
      language: language ?? "EN",
    })
    .returning();

  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: publicUser(user) });
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid username or password." });
    return;
  }
  const { emailOrName, password } = parsed.data;
  const lookup = emailOrName.trim().toLowerCase();

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.emailLower, lookup))
    .limit(1);

  if (!user) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }

  if (!user.passwordHash) {
    res.status(401).json({
      error: "This account uses Google sign-in. Please continue with Google.",
    });
    return;
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }

  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: publicUser(user) });
});

router.get("/auth/google/config", async (_req: Request, res: Response) => {
  res.json({
    enabled: Boolean(googleClientId),
    clientId: googleClientId ?? null,
  });
});

router.post("/auth/google", async (req: Request, res: Response) => {
  if (!googleClient || !googleClientId) {
    res.status(503).json({
      error:
        "Google sign-in is not configured on the server. Please add GOOGLE_CLIENT_ID and try again.",
    });
    return;
  }

  const parsed = googleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid Google credential." });
    return;
  }

  let payload: Awaited<ReturnType<OAuth2Client["verifyIdToken"]>>["payload"];
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: parsed.data.idToken,
      audience: googleClientId,
    });
    payload = ticket.getPayload();
  } catch {
    res.status(401).json({ error: "Could not verify Google credential. Please try again." });
    return;
  }

  if (!payload || !payload.email || !payload.sub || payload.email_verified === false) {
    res.status(401).json({ error: "Google account email is not verified." });
    return;
  }

  const email = payload.email;
  const emailLower = email.trim().toLowerCase();
  const googleId = payload.sub;
  const name =
    payload.name?.trim() || (payload.given_name ?? email.split("@")[0] ?? "Student");
  const avatarUrl = payload.picture ?? null;

  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.googleId, googleId))
    .limit(1);

  if (!user) {
    [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.emailLower, emailLower))
      .limit(1);
    if (user) {
      [user] = await db
        .update(usersTable)
        .set({
          googleId,
          avatarUrl: avatarUrl ?? user.avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, user.id))
        .returning();
    }
  }

  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        emailLower,
        googleId,
        avatarUrl,
        passwordHash: null,
        targetExam: parsed.data.targetExam ?? "JEE",
        language: parsed.data.language ?? "EN",
      })
      .returning();
  }

  const token = signToken({ sub: user.id, email: user.email });
  res.json({ token, user: publicUser(user) });
});

router.get("/auth/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ user: publicUser(user) });
});

router.post("/auth/forgot-password", async (req: Request, res: Response) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    res.json({ ok: true });
    return;
  }
  const emailLower = parsed.data.email.trim().toLowerCase();
  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.emailLower, emailLower))
    .limit(1);

  if (!user) {
    res.json({ ok: true });
    return;
  }

  const { raw, hash } = generateResetToken();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await db.insert(passwordResetsTable).values({
    userId: user.id,
    tokenHash: hash,
    expiresAt,
  });

  const payload: { ok: true; resetToken?: string } = { ok: true };
  if (process.env["NODE_ENV"] !== "production") {
    payload.resetToken = raw;
  }
  res.json(payload);
});

router.post("/auth/reset-password", async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { token, password } = parsed.data;
  const tokenHash = hashResetToken(token);

  const [reset] = await db
    .select()
    .from(passwordResetsTable)
    .where(
      and(
        eq(passwordResetsTable.tokenHash, tokenHash),
        gt(passwordResetsTable.expiresAt, new Date()),
        isNull(passwordResetsTable.usedAt),
      ),
    )
    .limit(1);

  if (!reset) {
    res
      .status(400)
      .json({ error: "This reset link is invalid or has expired. Please request a new one." });
    return;
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(usersTable)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(usersTable.id, reset.userId));
  await db
    .update(passwordResetsTable)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetsTable.id, reset.id));

  res.json({ ok: true });
});

export default router;
