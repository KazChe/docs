import {
  HostStyle,
  LinkActiveStyle,
  LinkInactiveStyle,
  SecondaryNavStyle,
  SearchBarContainer
} from './styles';
import {
  IOS_REFERENCE,
  ANDROID_REFERENCE,
  JS_REFERENCE,
  HOSTING_REFERENCE
} from '../../constants/links';
import ExternalLink from '../ExternalLink';
import InternalLink from '../InternalLink';
import { useRouter } from 'next/router';
import { Container } from '../Container';
import { parseLocalStorage } from '../../utils/parseLocalStorage';

import SearchBar from '../SearchBar';
import React from 'react';

export default function SecondaryNav() {
  const router = useRouter();
  const path = router.asPath;
  const filterKeys = parseLocalStorage('filterKeys', {});

  return (
    <HostStyle>
      <Container>
        <SecondaryNavStyle id="secondary-nav">
          <div className="secondary-nav-links">
            {[
              {
                label: 'Getting Started',
                url: '/start'
              },
              {
                label: 'Libraries',
                url: '/lib',
                additionalActiveChildRoots: ['/lib', '/sdk']
              },
              {
                label: 'CLI',
                url: '/cli'
              },
              {
                label: 'Studio',
                url: '/console'
              },
              {
                label: 'Hosting',
                url: HOSTING_REFERENCE,
                external: true
              },
              {
                label: 'Guides',
                url: '/guides'
              },
              ...('platform' in filterKeys &&
              (filterKeys as { platform: string }).platform
                ? [
                    {
                      label: 'API Reference',
                      url: (() => {
                        switch ((filterKeys as { platform: string }).platform) {
                          case 'ios': {
                            return IOS_REFERENCE;
                          }
                          case 'android': {
                            return ANDROID_REFERENCE;
                          }
                          default: {
                            return JS_REFERENCE;
                          }
                        }
                      })(),
                      external: true
                    }
                  ]
                : [])
            ].map(({ url, label, external, additionalActiveChildRoots }) => {
              const matchingRoots =
                additionalActiveChildRoots === undefined
                  ? [url]
                  : [url, ...additionalActiveChildRoots];
              const active = matchingRoots.some((root) => {
                return path.startsWith(root);
              });
              const LinkStyle = active ? LinkActiveStyle : LinkInactiveStyle;
              if (external) {
                return (
                  <ExternalLink href={url} key={label} graphic="black">
                    <span>{label}</span>
                  </ExternalLink>
                );
              } else {
                return (
                  <InternalLink href={url} key={label}>
                    <LinkStyle href={url}>{label}</LinkStyle>
                  </InternalLink>
                );
              }
            })}
          </div>
          <SearchBarContainer>
            <SearchBar />
          </SearchBarContainer>
        </SecondaryNavStyle>
      </Container>
    </HostStyle>
  );
}
