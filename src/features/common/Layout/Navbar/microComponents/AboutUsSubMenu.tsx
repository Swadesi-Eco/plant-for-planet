import { lang_path } from '../../../../../utils/constants/wpLanguages';
import GetSubMenuIcons from '../getSubMenu';
import { useTranslations, useLocale } from 'next-intl';

export interface SubMenu {
  onclick: string;
  title: string;
  visible: boolean;
}
export interface AboutUsSubMenuProp {
  subMenu: SubMenu[] | undefined;
}

const AboutUsSubMenu = ({ subMenu }: AboutUsSubMenuProp) => {
  const subMenuPath = {
    overview: '',
    childrenAndYouth: 'children-youth',
    trillionTrees: 'trillion-trees',
    yucatan: 'yucatan',
    partners: 'partners',
    changeChocolate: 'chocolate',
    stopTalkingStartPlanting: 'stop-talking-start-planting',
  };
  const t = useTranslations('Common');
  const locale = useLocale();

  return (
    <>
      {subMenu &&
        subMenu.map((subMenuItem: SubMenu) => {
          return (
            <a
              key={subMenuItem.title}
              className={'menuRow'}
              href={`https://www.plant-for-the-planet.org/${
                lang_path[locale as keyof typeof lang_path]
                  ? lang_path[locale as keyof typeof lang_path]
                  : 'en'
              }/${subMenuPath[subMenuItem.title as keyof typeof subMenuPath]}`}
            >
              <div className={'subMenuContainer'}>
                <GetSubMenuIcons title={subMenuItem.title} />
                <div className={'menuText'}>
                  {t(subMenuItem.title as keyof typeof subMenuPath)}
                </div>
              </div>
            </a>
          );
        })}
    </>
  );
};

export default AboutUsSubMenu;
