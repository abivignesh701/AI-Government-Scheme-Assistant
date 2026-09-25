# Authentication Architecture

## Strategy
ArogyaSathi utilizes **JWT (JSON Web Tokens)** coupled with stateless REST APIs provided by the Backend Express server. 

## Flow
1. **Signup**: The user passes Name, Email, and Password. The password is hashed using `bcrypt` and securely stored in MongoDB.
2. **Login**: The user provides credentials. Upon matching hashes, the backend signs a JWT with `userId` and `role` properties.
3. **Session**: The Next.js frontend retains the JWT within `localStorage` / HTTP-Only cookies, injecting `Authorization: Bearer <token>` into outbound fetches.
4. **Roles**: Standard accounts default to `USER`. Admin panels and Governance queues are guarded via `ADMIN` or `REVIEWER` roles.

## MongoDB Integration
- Collection: `users`
- Security: NoSQL injections mitigated natively through Mongoose strict Schema typing.

## UX State Management
- `AuthContext` within the React tree tracks `user` global state, gating access to protected routes like `/dashboard` and `/applications`.
