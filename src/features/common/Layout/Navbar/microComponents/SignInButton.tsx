import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useUserProps } from '../../UserPropsContext';
import WebappButton from '../../../WebappButton';

export const SignInButton = () => {
  const { user, loginWithRedirect } = useUserProps();
  const router = useRouter();
  const t = useTranslations('Common');
  // This function controls the path for the user when they click on Me
  async function gotoUserPage() {
    if (user) {
      if (typeof window !== 'undefined') {
        router.push(`/profile`);
      }
    } else {
      loginWithRedirect({
        redirectUri: `${window.location.origin}/login`,
        ui_locales: localStorage.getItem('language') || 'en',
      });
    }
  }
  return (
    <WebappButton
      text={t('signIn')}
      variant="primary"
      elementType="button"
      onClick={() => gotoUserPage()}
    />
  );
};
export default SignInButton;
