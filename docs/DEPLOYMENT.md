# Wedding invitation — database & hosting checklist

## 1. MySQL database (attendance)

Attendance confirmations are stored in MySQL when `DATABASE_URL` is set.

### Local (XAMPP)

1. Start **Apache** and **MySQL** in XAMPP.
2. Open **phpMyAdmin** → create database `wedding_invitation` (utf8mb4).
3. Copy `.env.example` to `.env` and set `DATABASE_URL` (see comments in `.env.example`).
4. Apply the schema:

   ```bash
   npx prisma db push
   ```

   For tracked migrations later:

   ```bash
   npx prisma migrate dev --name init_attendance
   ```

5. Generate Prisma Client (also runs on `npm install` via `postinstall`):

   ```bash
   npm run db:generate
   ```

### Production

- Use a managed MySQL host (PlanetScale MySQL mode, Railway, DigitalOcean, AWS RDS, etc.) or MySQL on your VPS.
- Set `DATABASE_URL` in your host’s **environment variables** (never commit `.env`).
- Run migrations or `db push` from a secure machine against the production DB (or use CI).

## 2. Next.js app on the public internet

1. **Build** on the host (or in CI):

   ```bash
   npm ci
   npx prisma generate
   npm run build
   npm start
   ```

2. Set **`DATABASE_URL`** on the server where Node runs.

3. Set **`NEXT_PUBLIC_SITE_URL`** to your live URL (e.g. `https://wedding.example.com`) so guest invitation links default correctly when not opened in a browser.

4. **HTTPS**: use TLS in production (most platforms provide this).

5. **Admin page** (`/admin`): guest list is still in **browser localStorage** on the device where you use Guest Manager. Only **attendance** is centralized in MySQL. Protect `/admin`:

   - Add authentication (NextAuth, middleware + password, or host-level basic auth), or
   - Restrict by IP / VPN.

6. **Guests**: send links like `https://your-domain.com/?guest=Name%20Here`. Attendance `POST` records optional `inviteTag` from that query string for your reports.

## 3. What happens without `DATABASE_URL`

- `POST /api/attendance` returns **503**; the RSVP form **falls back to localStorage** on that device (demo only).
- Admin attendance list uses **localStorage** in that case.

## 4. Optional next steps

- Move **guest list** and **wishes** to MySQL with APIs (same pattern as attendance).
- Rate-limit `POST /api/attendance` to reduce spam.
- Email notifications on new attendance (requires email provider + API).
