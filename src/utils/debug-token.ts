import { UserGeneralKey } from '@/models/user.generalkey';

export const debugToken = () => {
  const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
  return token;
};

export const clearInvalidToken = () => {
  const token = localStorage.getItem(UserGeneralKey.USER_TOKEN);
  if (token === 'undefined' || token === 'null' || !token) {
    localStorage.removeItem(UserGeneralKey.USER_TOKEN);
    return true;
  }
  return false;
};
