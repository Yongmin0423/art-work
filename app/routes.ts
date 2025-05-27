import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('common/pages/home-page.tsx'),
  ...prefix('commissions', [
    index('features/commissions/pages/commissions.tsx'),
    route('artist/:id', 'features/commissions/pages/artist.tsx'),
    layout('features/commissions/layouts/commissions-layout.tsx', [
      route('character', 'features/commissions/pages/character.tsx'),
      route('illustration', 'features/commissions/pages/illustration.tsx'),
      route('virtual-3d', 'features/commissions/pages/virtual-3d.tsx'),
      route('live2d', 'features/commissions/pages/live2d.tsx'),
      route('design', 'features/commissions/pages/design.tsx'),
      route('video', 'features/commissions/pages/video.tsx'),
      route('recommended', 'features/commissions/pages/recommended.tsx'),
      route('join/artist', 'features/commissions/pages/join-artist.tsx'),
    ]),
  ]),
  ...prefix('/auth', [
    layout('features/auth/layouts/auth-layout.tsx', [
      route('/login', 'features/auth/pages/login-page.tsx'),
      route('/join', 'features/auth/pages/join-page.tsx'),
      ...prefix('/otp', [
        route('/start', 'features/auth/pages/otp-start-page.tsx'),
        route('/complete', 'features/auth/pages/otp-complete-page.tsx'),
      ]),
      ...prefix('/social/:provider', [
        route('/start', 'features/auth/pages/social-start-page.tsx'),
        route('/complete', 'features/auth/pages/social-complete-page.tsx'),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
