import { setUtahHeaderSettings } from '@utahdts/utah-design-system-header';
import { useEffect } from 'react';

type UtahChromeProps = {
  hasAboutDialog: boolean;
  onAboutClick: () => void;
};

export default function UtahChrome({
  hasAboutDialog,
  onAboutClick,
}: UtahChromeProps) {
  useEffect(() => {
    setUtahHeaderSettings({
      actionItems: [
        {
          actionPopupMenu: {
            menuItems: [
              ...(hasAboutDialog
                ? [
                    {
                      actionFunction: () => {
                        if (
                          document
                            .querySelector('.utds-header-mobile-menu')
                            ?.classList.contains('is-open')
                        ) {
                          const mobileMenuButton = document.getElementById(
                            'utds-main-menu__hamburger',
                          );
                          if (!(mobileMenuButton instanceof HTMLButtonElement)) {
                            throw new Error(
                              'The Utah header mobile menu button is not available.',
                            );
                          }

                          mobileMenuButton.click();
                        }

                        onAboutClick();
                      },
                      title: 'About',
                    },
                  ]
                : []),
              {
                actionUrl: {
                  openInNewTab: true,
                  url: '/ThirdPartyNotices.txt',
                },
                title: 'Third-party Notices',
              },
            ],
            title: 'Utah Bikeways',
          },
          icon: '<span class="utds-icon-before-waffle" aria-hidden="true" />',
          showTitle: false,
          title: 'More',
        },
      ],
      applicationType: 'custom application',
      domLocationTarget: {
        cssSelector: '#utah-header-target',
      },
      footer: {
        domLocationTarget: {
          cssSelector: '#utah-footer-target',
        },
        showHorizontalRule: false,
      },
      logo: {
        imageUrl: '/logo.svg',
      },
      mainMenu: false,
      onSearch: false,
      showTitle: true,
      size: 'MEDIUM',
      skipLinkUrl: '#main-content',
      title: 'Utah Bikeways',
      titleUrl: '/',
      utahId: false,
    });

    const mobileActionButton = document.querySelector<HTMLButtonElement>(
      '.utds-header-mobile-menu__action-bar .utds-header-action-item__icon-button',
    );
    const mobileActionPanel = document
      .querySelector('.utds-header-mobile-menu__content-item .utds-header-action-item-menu')
      ?.closest<HTMLElement>('[role="tabpanel"]');

    if (!mobileActionButton || !mobileActionPanel?.id) {
      throw new Error('The Utah header mobile action menu is not available.');
    }

    // The header only links its hamburger to action content when mainMenu is enabled.
    mobileActionButton.setAttribute('aria-controls', mobileActionPanel.id);
  }, [hasAboutDialog, onAboutClick]);

  return <div id="utah-header-target" className="shrink-0" />;
}
