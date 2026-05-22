# IdeaVault Server

IdeaVault is a premium startup idea discovery and community engagement portal. This repository contains the backend Express API for the application, handling data persistence with MongoDB and secure token authentication.

## 🚀 Key Features

- **MongoDB Integration:** Native MongoDB driver integration for high-performance CRUD queries.
- **JOSE Authentication Middleware:** Secure JWT validation and token decoding using public Next.js Better-Auth JWKS keys.
- **Idea Management Endpoints:** Supports full listing, searching, filtering, adding, updating, and deleting of startup ideas.
- **Discussion Thread Endpoints:** Secure POST, GET, PATCH, and DELETE endpoints for user comments on ideas.
- **Creator Dashboards:** Customized user-specific endpoints to list individual ideas and user comments.

## 🛠️ Technology Stack

- **Core Framework:** Node.js & Express.js
- **Database:** MongoDB Native Node.js Driver
- **Security:** `jose-cjs` verifying JWKS tokens
