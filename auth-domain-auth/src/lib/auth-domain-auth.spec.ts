import { authDomainAuth } from './auth-domain-auth';

describe('authDomainAuth', () => {
  it('should work', () => {
    expect(authDomainAuth()).toEqual('auth-domain-auth');
  });
});
