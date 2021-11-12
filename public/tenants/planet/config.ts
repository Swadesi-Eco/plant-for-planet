const config = {
  // name of tenant
  tenantName: 'planet',
  // url of tenant home page
  tenantURL: 'www.plant-for-the-planet.org',
  tenantGoal: null,
  showUNEPLogo: true,
  showUNDecadeLogo: true,
  showRedeemHint: true,
  enableGuestSepa: false,
  darkModeEnabled: false,
  // font family and it's property particular to tenant
  font: {
    primaryFontFamily: '"Raleway",Helvetica,Arial,sans-serif',
    primaryFontURL: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&display=swap",
    secondaryFontFamily: '"Open Sans",Helvetica,Arial,sans-serif',
    secondaryFontURL: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap",
  },
  languages: ['en', 'de', 'es', 'fr', 'it', 'pt-BR'],
  header: {
    isSecondaryTenant: false,
    tenantLogoURL: `${process.env.CDN_URL}/logo/svg/planet.svg`,
    tenantLogoLink: '/',
    items: {
      home: {
        title: 'home',
        onclick: '/home',
        visible: false,
      },
      donate: {
        title: 'home',
        onclick: '/',
        visible: true,
      },
      about: {
        title: 'aboutUs',
        onclick: 'https://a.plant-for-the-planet.org/',
        visible: true,
        subMenu: [
          {
            title: 'overview',
            onclickEN: 'https://a.plant-for-the-planet.org/',
            onclickDE: 'https://a.plant-for-the-planet.org/de/',
            onclickES: 'https://a.plant-for-the-planet.org/es-es/',
            visible: true
          },
          {
            title: 'childrenAndYouth',
            onclickEN: 'https://a.plant-for-the-planet.org/children-youth/',
            onclickDE: 'https://a.plant-for-the-planet.org/de/kinder-jugendliche',
            onclickES: 'https://a.plant-for-the-planet.org/es-es/children-youth',
            visible: true
          },
          {
            title: 'trillionTrees',
            onclickEN: 'https://a.plant-for-the-planet.org/trillion-trees/',
            onclickDE: 'https://a.plant-for-the-planet.org/de/trillion-trees/',
            onclickES: 'https://a.plant-for-the-planet.org/es-es/trillion-trees/',
            visible: true
          },
          {
            title: 'yucatan',
            onclickEN: 'https://a.plant-for-the-planet.org/yucatan/',
            onclickDE: 'https://a.plant-for-the-planet.org/de/yucatan',
            onclickES: 'https://a.plant-for-the-planet.org/es-es/yucatan/',
            visible: true
          },
          {
            title: 'partners',
            onclickEN: 'https://a.plant-for-the-planet.org/partners/',
            onclickDE: 'https://a.plant-for-the-planet.org/de/partners/',
            onclickES: 'https://a.plant-for-the-planet.org/es-es/partners/',
            visible: true
          },
          {
            title: 'changeChocolate',
            onclickEN: 'https://a.plant-for-the-planet.org/change-chocolate/',
            onclickDE: 'https://a.plant-for-the-planet.org/de/change-chocolate',
            onclickES: 'https://a.plant-for-the-planet.org/es-es/change-chocolate/',
            visible: true
          },
          {
            title: 'stopTalkingStartPlanting',
            onclickEN: 'https://a.plant-for-the-planet.org/stop-talking-start-planting/',
            onclickDE: 'https://a.plant-for-the-planet.org/de/stop-talking-start-planting/',
            onclickES: 'https://a.plant-for-the-planet.org/es-es/stop-talking-start-planting/',
            visible: true
          }
        ]
      },
      leaderboard: {
        title: 'leaders',
        onclick: '/all',
        visible: true,
      },
      me: {
        title: 'signIn',
        loggedInTitle: 'me',
        onclick: '/me',
        visible: true,
      }
    }
  },
  meta: {
    title: 'Plant trees around the world - Plant-for-the-Planet',
    appTitle: 'Plant for the Planet',
    description:
      "We are children and youth on a mission: bring back a trillion trees! No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis.",
    image: `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`,
    twitterHandle: '@trilliontrees',
    locale: 'en_US',
  },
  footerLinks:["shop","privacy","terms","imprint","contact","downloads","annualReports","team","jobs","supportUs","blogs", "faqs"],
  manifest: '/tenants/planet/manifest.json',
};
export default config;