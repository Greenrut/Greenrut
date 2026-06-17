# Greenrut Server

Express backend scaffold for the Greenrut storefront and admin UI.

## Run

```bash
cd server
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env` and set:

- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_SIGNUP_KEY` if you want to lock down admin registration
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

## Available routes

- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/admin/auth/signup`
- `POST /api/admin/auth/login`
- `GET /api/admin/auth/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `GET /api/admin/products/:id`
- `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/posts`
- `POST /api/admin/posts`
- `GET /api/admin/posts/:id`
- `PUT /api/admin/posts/:id`
- `DELETE /api/admin/posts/:id`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/categories`
- `GET /api/admin/tags`
- `POST /api/admin/uploads/image`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/posts`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `GET /api/users`
- `GET /api/categories`
- `GET /api/tags`
- `GET /api/account`
- `PATCH /api/account/profile`
- `GET /api/account/addresses`
- `POST /api/account/addresses`
- `GET /api/account/addresses/:id`
- `PUT /api/account/addresses/:id`
- `DELETE /api/account/addresses/:id`
- `GET /api/account/wishlist`
- `DELETE /api/account/wishlist/:id`
- `GET /api/account/inbox`
- `GET /api/account/orders`
