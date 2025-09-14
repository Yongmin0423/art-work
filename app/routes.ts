import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  ...prefix("commissions", [
    index("features/commissions/pages/commissions.tsx"),
    route("artist/:id", "features/commissions/pages/commission-detail-page.tsx"),
    route(":commissionId/like", "features/commissions/pages/commission-like-page.tsx"),
    route(":commissionId/delete", "features/commissions/pages/commission-delete-page.tsx"),
    route("edit/:id", "features/commissions/pages/submit-commission.tsx", { id: "edit-commission" }),
    layout("features/commissions/layouts/commissions-layout.tsx", [
      route(":category", "features/commissions/pages/category.tsx"),
    ]),
    route("create", "features/commissions/pages/submit-commission.tsx", { id: "create-commission" }),
    route("create/success", "features/commissions/pages/commission-success-page.tsx"),
  ]),
  ...prefix("/auth", [
    layout("features/auth/layouts/auth-layout.tsx", [
      route("/login", "features/auth/pages/login-page.tsx"),
      route("/join", "features/auth/pages/join-page.tsx"),
      ...prefix("/otp", [
        route("/start", "features/auth/pages/otp-start-page.tsx"),
        route("/complete", "features/auth/pages/otp-complete-page.tsx"),
      ]),
      ...prefix("/social/:provider", [
        route("/start", "features/auth/pages/social-start-page.tsx"),
        route("/complete", "features/auth/pages/social-complete-page.tsx"),
      ]),
    ]),
    route("/logout", "features/auth/pages/logout-page.tsx"),
  ]),
  ...prefix(`/my`, [
    layout("features/users/layouts/dashboard-layout.tsx", [
      ...prefix("/dashboard", [
        index("features/users/pages/dashboard-page.tsx"),
        route(
          "/commissions/requested",
          "features/users/pages/dashboard-recieved-commissions.tsx"
        ),
        route(
          "/products/:productId",
          "features/users/pages/dashboard-product-page.tsx"
        ),
      ]),
      ...prefix("/commissions", [
        route(
          "/received",
          "features/users/pages/received-commissions-page.tsx"
        ),
        route(
          "/requested",
          "features/users/pages/requested-commissions-page.tsx"
        ),
        route(
          "/my-commissions",
          "features/users/pages/my-commissions-page.tsx"
        ),
        route(
          "/my-commissions/:id",
          "features/users/pages/my-commission-detail-page.tsx"
        ),
        route(
          "/my-commissions/:id/delete",
          "features/users/pages/commission-delete-page.tsx"
        ),
        route("/liked", "features/users/pages/liked-commissions-page.tsx"),
      ]),
      ...prefix("/admin", [
        route(
          "commissions",
          "features/users/pages/admin/admin-commissions-page.tsx"
        ),
        route(
          "commissions/:id",
          "features/users/pages/admin/admin-commission-detail-page.tsx"
        ),
        route("orders", "features/users/pages/admin/admin-orders-page.tsx"),
        route(
          "orders/:orderId",
          "features/users/pages/admin/admin-order-detail-page.tsx"
        ),
      ]),
    ]),

    route("settings", "features/users/pages/settings-page.tsx"),
    route("/portfolio/new", "features/users/pages/portfolio-create-page.tsx"),
    route(
      "/portfolio/:portfolioId/edit",
      "features/users/pages/portfolio-edit-page.tsx"
    ),
    route("/notifications", "features/users/pages/notifications-page.tsx"),
    layout("features/users/layouts/messages-layout.tsx", [
      ...prefix("/messages", [
        index("features/users/pages/messages-page.tsx"),
        route("/:messageId", "features/users/pages/message-page.tsx"),
      ]),
    ]),
  ]),
  layout("features/users/layouts/profile-layout.tsx", [
    ...prefix("/users/:username", [
      index("features/users/pages/profile-page.tsx"),
      route(
        "/commissions",
        "features/users/pages/profile-commissions-page.tsx"
      ),
      route("/portfolio", "features/users/pages/profile-portfolio-page.tsx"),
      route("/reviews", "features/users/pages/profile-reviews-page.tsx"),
      route("/posts", "features/users/pages/profile-posts-page.tsx"),
      route("/welcome", "features/users/pages/welcome-page.tsx"),
    ]),
  ]),
  ...prefix("/community", [
    index("features/community/pages/community-page.tsx"),
    route("/:postId", "features/community/pages/post-page.tsx"),
    route("/:postId/upvote", "features/community/pages/post-upvote-page.tsx"),
    route("/create", "features/community/pages/submit-post-page.tsx"),
  ]),
  ...prefix("/reviews", [
    index("features/reviews/pages/reviews.tsx"),
    route("/:reviewId", "features/reviews/pages/review-page.tsx"),
    route("/submit", "features/reviews/pages/submit-review-page.tsx"),
  ]),
] satisfies RouteConfig;
