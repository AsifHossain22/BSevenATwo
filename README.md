# DevPulse – Internal Tech Issue & Feature Tracker

A collaborative backend platform for software engineering teams to report bugs, suggest features, coordinate resolutions, and track internal development workflows. Built using a modular architectural pattern with Node.js, TypeScript, Express and raw PostgreSQL query pools.

## Demo Link

* **Live API URL:**  *https://dev-pulse-hiasif.vercel.app/*

---

## Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | High-performance asynchronous JavaScript runtime engine |
| **TypeScript** | Strongly-typed environment ensuring strict compile-time safety |
| **Express.js** | Modular framework for clean routing and middleware pipelines |
| **PostgreSQL & `pg`** | High-reliability relational database layer utilizing optimized raw SQL |
| **bcryptjs** | Secure multi-round password hashing configuration (Salt Rounds: 10) |
| **jsonwebtoken (JWT)** | Stateless authorization architecture via secure digital signatures |

---

## Features & Architecture Highlights

* **Secure Authentication Flow:** Direct user onboarding (`/signup`) with default user roles, and session login authentication (`/login`) issuing signed JSON Web Tokens (JWT).
* **Granular Role-Based Access Controls (RBAC):** Distinct route permissions for `contributor` and `maintainer` team roles enforced via an custom authorization middleware layer.
* **Advanced No-JOIN Data Aggregation:** Fetches and bundles relational profile data (associating User profiles into corresponding Issues) programmatically in memory inside the service tier via optimized lookup maps—completely avoiding costly database-level `JOIN` operations.
* **Dynamic Search Filtering & Sorting:** Integrated query parser pipelines supporting data filtering configurations across issue classification `type`, workflow `status` and dual-directional timeline sorting (`newest` or `oldest`).
* **Strict Business Logic Authorization Checks:** Contributors can update fields only if the issue was created by them and only while it remains in an active `'open'` state. Maintainers possess global override write/delete access.

---

## API Endpoints

### Authentication Module (`/api/auth`)

#### 1. User Registration
* **HTTP Method:** `POST`
* **Endpoint:** `/api/auth/signup`
* **Access Requirements:** Public
* **Request Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@devpulse.com",
      "password": "securePassword123",
      "role": "contributor"
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully!",
      "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@devpulse.com",
        "role": "contributor",
        "created_at": "2026-05-24T12:00:00.000Z",
        "updated_at": "2026-05-24T12:00:00.000Z"
      }
    }
    ```

#### 2. User Login
* **HTTP Method:** `POST`
* **Endpoint:** `/api/auth/login`
* **Access Requirements:** Public
* **Request Body:**
    ```json
    {
      "email": "john.doe@devpulse.com",
      "password": "securePassword123"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "User logged in successfully!",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": 1,
          "name": "John Doe",
          "email": "john.doe@devpulse.com",
          "role": "contributor",
          "created_at": "2026-05-24T12:00:00.000Z",
          "updated_at": "2026-05-24T12:00:00.000Z"
        }
      }
    }
    ```
---

### Issues Module (`/api/issues`)

#### 3. Create New Issue
* **HTTP Method:** `POST`
* **Endpoint:** `/api/issues`
* **Access Requirements:** Authenticated (`contributor` or `maintainer`)
* **Required Header:** `Authorization: `<JWT_TOKEN>`
* **Request Body:**
    ```json
    {
      "title": "Database pool exhaustion under load",
      "description": "Pool exhausts after 50+ concurrent queries, causing server 500 errors",
      "type": "bug"
    }
    ```
* **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Issue created successfully!",
      "data": {
        "id": 12,
        "title": "Database pool exhaustion under load",
        "description": "Pool exhausts after 50+ concurrent queries, causing server 500 errors",
        "type": "bug",
        "status": "open",
        "reporter_id": 1,
        "created_at": "2026-05-24T12:05:00.000Z",
        "updated_at": "2026-05-24T12:05:00.000Z"
      }
    }
    ```

#### 4. Get All Issues (with Search, Filter and Sort)
* **HTTP Method:** `GET`
* **Endpoint:** `/api/issues`
* **Access Requirements:** Public
* **Optional Query Parameters:**
    * `sort`: `newest` *(default)*, `oldest`
    * `type`: `bug`, `feature_request`
    * `status`: `open`, `in_progress`, `resolved`
* **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "All Issues found successfully!",
      "data": [
        {
          "id": 12,
          "title": "Database pool exhaustion under load",
          "description": "Pool exhausts after 50+ concurrent queries, causing server 500 errors",
          "type": "bug",
          "status": "open",
          "created_at": "2026-05-24T12:05:00.000Z",
          "updated_at": "2026-05-24T12:05:00.000Z",
          "reporter": {
            "id": 1,
            "name": "John Doe",
            "role": "contributor"
          }
        }
      ]
    }
    ```

#### 5. Get Single Issue Details
* **HTTP Method:** `GET`
* **Endpoint:** `/api/issues/:id`
* **Access Requirements:** Public
* **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Issue found successfully!",
      "data": {
        "id": 12,
        "title": "Database pool exhaustion under load",
        "description": "Pool exhausts after 50+ concurrent queries, causing server 500 errors",
        "type": "bug",
        "status": "open",
        "created_at": "2026-05-24T12:05:00.000Z",
        "updated_at": "2026-05-24T12:05:00.000Z",
        "reporter": {
          "id": 1,
          "name": "John Doe",
          "role": "contributor"
          }
       }
    }
    ```

#### 6. Update Issue Fields
* **HTTP Method:** `PATCH`
* **Endpoint:** `/api/issues/:id`
* **Access Requirements:** Authenticated (`maintainer` can modify all; `contributor` can modify only their own if status is `'open'`)
* **Required Header:** `Authorization: <JWT_TOKEN>`
* **Request Body:**
    ```json
    {
      "status": "in_progress"
    }
    ```
* **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Issue updated successfully!",
      "data": {
        "id": 12,
        "title": "Database pool exhaustion under load",
        "description": "Pool exhausts after 50+ concurrent queries, causing server 500 errors",
        "type": "bug",
        "status": "in_progress",
        "reporter_id": 1,
        "created_at": "2026-05-24T12:05:00.000Z",
        "updated_at": "2026-05-24T12:15:00.000Z"
      }
    }
    ```

#### 7. Delete Issue
* **HTTP Method:** `DELETE`
* **Endpoint:** `/api/issues/:id`
* **Access Requirements:** Authenticated (`maintainer` only)
* **Required Header:** `Authorization: <JWT_TOKEN>`
* **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Issue deleted successfully!"
    }
    ```
