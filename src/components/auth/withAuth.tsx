'use client';

import { ComponentType } from 'react';
import ProtectedRoute from './ProtectedRoute';

type WithAuthOptions = {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * 高阶组件，用于保护需要认证的路由
 */
export function withAuth<T extends object>(
  Component: ComponentType<T>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', requireAuth = true } = options;

  const AuthenticatedComponent = (props: T) => {
    return (
      <ProtectedRoute redirectTo={redirectTo} requireAuth={requireAuth}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
}

/**
 * 保护需要认证的组件
 */
export function withAuthRequired<T extends object>(
  Component: ComponentType<T>,
  redirectTo?: string
) {
  return withAuth(Component, { redirectTo, requireAuth: true });
}

/**
 * 保护不需要认证的组件（如登录页）
 */
export function withAuthNotRequired<T extends object>(
  Component: ComponentType<T>,
  redirectTo?: string
) {
  return withAuth(Component, { redirectTo: redirectTo || '/playground', requireAuth: false });
}

export default withAuth;
