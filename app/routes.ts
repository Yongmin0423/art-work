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
    // Index는 레이아웃 없이 사용
    index('features/commissions/commissions.tsx'),
    // 나머지는 공통 레이아웃 사용
    layout('features/commissions/layouts/commissions-layout.tsx', [
      route('character', 'features/commissions/character.tsx'),
      route('illustration', 'features/commissions/illustration.tsx'),
      route('virtual-3d', 'features/commissions/virtual-3d.tsx'),
      route('live2d', 'features/commissions/live2d.tsx'),
      route('design', 'features/commissions/design.tsx'),
      route('video', 'features/commissions/video.tsx'),
      route('recommended', 'features/commissions/recommended.tsx'),
      route('join/artist', 'features/commissions/join-artist.tsx'),
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
