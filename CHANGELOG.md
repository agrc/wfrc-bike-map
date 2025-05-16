# Changelog

## [1.1.0-1](https://github.com/agrc/wfrc-bike-map/compare/v1.1.0-0...v1.1.0-1) (2025-05-16)


### Bug Fixes

* prevent identify on bikeshare station features ([34813cc](https://github.com/agrc/wfrc-bike-map/commit/34813cce551ed2d4b31879f0ec6e8e65e315a138))

## [1.1.0-0](https://github.com/agrc/wfrc-bike-map/compare/v1.0.0...v1.1.0-0) (2025-05-16)


### Features

* add "Other Links" checkbox to traffic stress filter ([3af4721](https://github.com/agrc/wfrc-bike-map/commit/3af4721eb41ecb3861ca4c7a496df2c341bb612a)), closes [#112](https://github.com/agrc/wfrc-bike-map/issues/112)
* add toggle checkboxes for bikeshare stations ([c509f6e](https://github.com/agrc/wfrc-bike-map/commit/c509f6e6f664e557368277f5d647065be6363f3e)), closes [#108](https://github.com/agrc/wfrc-bike-map/issues/108)
* add url parameter for controlling the base map ([98e4203](https://github.com/agrc/wfrc-bike-map/commit/98e4203713bc97f663b930c41d27fdf582c9bd75))
* **scripts:** include sidewalks ([#109](https://github.com/agrc/wfrc-bike-map/issues/109)) ([01d92da](https://github.com/agrc/wfrc-bike-map/commit/01d92da896dcdc76b24f987993bc60572b430f5c))


### Bug Fixes

* fix bug causing "Other Links" to default to off when there is no corresponding URL parameter ([f509d76](https://github.com/agrc/wfrc-bike-map/commit/f509d76e307b8a171cdc5f250b9a6a271b7bb796))
* **scripts:** add '[]' for .isin syntax ([ea20871](https://github.com/agrc/wfrc-bike-map/commit/ea20871b1f79e30f626d7def44d4db777cc08183))


### Dependencies

* bump dependencies 🌲 ([3bcc4ad](https://github.com/agrc/wfrc-bike-map/commit/3bcc4ad4f54c410876b46b39db29804272b11534))

## [1.0.0](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-18...v1.0.0) (2025-05-07)


### Features

First production release of the WFRC Bike Map.

## [0.4.0-18](https://github.com/agrc/wfrc-bike-map/compare/v0.3.0...v0.4.0-18) (2025-05-06)


### Features

* add about content to firebase remote configs ([543d989](https://github.com/agrc/wfrc-bike-map/commit/543d989592c06577285e070322a76540db0e11f3)), closes [#76](https://github.com/agrc/wfrc-bike-map/issues/76)
* add about dialog with default location option ([6dae472](https://github.com/agrc/wfrc-bike-map/commit/6dae4722dedfed61717505b908021b8c5d05248c))
* add basemap toggle control ([1b6f673](https://github.com/agrc/wfrc-bike-map/commit/1b6f673935f550624689307043296963c975cc11)), closes [#88](https://github.com/agrc/wfrc-bike-map/issues/88)
* add logo and favicon ([c034935](https://github.com/agrc/wfrc-bike-map/commit/c034935ab02a9225dae3ecc024e4348b77c1d486)), closes [#23](https://github.com/agrc/wfrc-bike-map/issues/23)
* add map drawing busy bar ([47565e8](https://github.com/agrc/wfrc-bike-map/commit/47565e88a0b8f2be36b9383ff8a57703844761b9))
* add symbols to renderer class checkboxes ([9f5f62c](https://github.com/agrc/wfrc-bike-map/commit/9f5f62c129f6dce5f2c068f135ad2dcdb8346ac4)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)
* add the ability to configure the order of checkboxes in the filter ([b74d05f](https://github.com/agrc/wfrc-bike-map/commit/b74d05f4a2848da9ff931ed5ff62ebaea2a21b2f)), closes [#79](https://github.com/agrc/wfrc-bike-map/issues/79)
* add zoom to my location button ([fb01350](https://github.com/agrc/wfrc-bike-map/commit/fb013508e4292aad7ceb765ead075bbff0610544)), closes [#78](https://github.com/agrc/wfrc-bike-map/issues/78)
* basic feature identify based on popup templates ([f628313](https://github.com/agrc/wfrc-bike-map/commit/f628313f383e02ddea2d392a5ba70b57721c4d0c)), closes [#18](https://github.com/agrc/wfrc-bike-map/issues/18)
* **functions:** send confirmation and notification feedback emails ([f3b9065](https://github.com/agrc/wfrc-bike-map/commit/f3b90655281a377fbec38d10ae49d33922b43711))
* implement feature-specific feedback ([84cf75d](https://github.com/agrc/wfrc-bike-map/commit/84cf75db93ba8e56d376aeb7eeba38d60a4a8d34)), closes [#17](https://github.com/agrc/wfrc-bike-map/issues/17)
* implement generic location feedback ([e5c1441](https://github.com/agrc/wfrc-bike-map/commit/e5c14410b0e864fe2b8be7329bf0ec70f5363e44))
* log most user interactions to firebase analytics ([e6c6dbd](https://github.com/agrc/wfrc-bike-map/commit/e6c6dbda1915d3c238179ed86550738a7f666e39))
* migrate configs to firebase remote configs ([281ac51](https://github.com/agrc/wfrc-bike-map/commit/281ac5123a772ad360193b8343961f51b6e08701))
* place filter/legend into collapsible tray ([58a7011](https://github.com/agrc/wfrc-bike-map/commit/58a70114f725921970808326ecec59bf95618a0f)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)
* preserve filter and map extent state as URL parameters ([e49887f](https://github.com/agrc/wfrc-bike-map/commit/e49887f871536dfb47dd5116b16c40679ebe155b)), closes [#15](https://github.com/agrc/wfrc-bike-map/issues/15)
* wire up symbol class checkboxes to filter ([0f6cb6e](https://github.com/agrc/wfrc-bike-map/commit/0f6cb6e8bcb35cc12530e12d197dd81cac339149)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)
* wire up traffic signals layer classes ([e7d495e](https://github.com/agrc/wfrc-bike-map/commit/e7d495eb7f2215a27321d43bbc38ea6dfe3a425a)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)


### Bug Fixes

* adjust map center and zoom level in MapContainer ([aff7914](https://github.com/agrc/wfrc-bike-map/commit/aff7914a86d725cbd7c38ebe14c43078a23a41f9))
* **ci:** use npx to run firebase cli ([2d881fa](https://github.com/agrc/wfrc-bike-map/commit/2d881fa2e55d7efc991a85a69fbbc46f2736e983))
* clear identify if no feature is found on tap ([41c65cb](https://github.com/agrc/wfrc-bike-map/commit/41c65cbea761908a8b781832432053917f796c2a))
* data type error on NOTES field ([860573c](https://github.com/agrc/wfrc-bike-map/commit/860573c47b0390a43c2a9534fe91e0dca6c5528d))
* fix bug causing the state of both filter types to be mixed ([91899ec](https://github.com/agrc/wfrc-bike-map/commit/91899ecfe7023ef99b6ccf9fb0ec7fb75e3946d9))
* fix regression bug causing feedback button not to show the form ([6215b00](https://github.com/agrc/wfrc-bike-map/commit/6215b00a2d07d9ed78868dd550d68c070a26e9b6))
* fix regression bug preventing identify when the drawer is toggled off ([a11abbb](https://github.com/agrc/wfrc-bike-map/commit/a11abbb0aefb1595a3dfe5929c9500a157f23871))
* **function:** include missing explicit dependency ([538402e](https://github.com/agrc/wfrc-bike-map/commit/538402e97558f698243dce8a85f7aa47a888091a))
* **function:** install deps before typescript build ([7aa0572](https://github.com/agrc/wfrc-bike-map/commit/7aa057238f6481b1c4eacb0c42b20caa2d956336))
* **functions:** add environment variables ([d1006a3](https://github.com/agrc/wfrc-bike-map/commit/d1006a33af577c23a36fb69d6830ea8ae30c4e86))
* make identify content look a little nicer ([83f2887](https://github.com/agrc/wfrc-bike-map/commit/83f2887805ab141bc933470b4712ac9a1aeca9bf))
* make title match header color ([6b1fdeb](https://github.com/agrc/wfrc-bike-map/commit/6b1fdeb324f66c8631604360427115a8f340b3c4))
* move basemap toggle to top left ([2a1b7ca](https://github.com/agrc/wfrc-bike-map/commit/2a1b7caa585eac2cd624a04ee9853d3f00af8d5d))
* point at latest map from WFRC ([8fb43fc](https://github.com/agrc/wfrc-bike-map/commit/8fb43fc944ae91d564a4940a81a02bbf7d34177e))
* prevent the URL from being updated too many times during panning and zooming ([f571b4f](https://github.com/agrc/wfrc-bike-map/commit/f571b4ff8a591dae30a2be0ada993d55df6b411d))
* prevent wrapping of identify attribute labels ([045d9c8](https://github.com/agrc/wfrc-bike-map/commit/045d9c8d29846eb0b72fa413034a8f7db14cdd18))
* remove scroll bars from drawer ([994a756](https://github.com/agrc/wfrc-bike-map/commit/994a7561fb11db32c756e20b142a67cf761f863c))
* **scripts:** fix city & county join and other refinements ([489986b](https://github.com/agrc/wfrc-bike-map/commit/489986b46cc1dd6828afaa0f0c492683cda841ef))
* **scripts:** updates in preparation for running as part of the roads update ([462d938](https://github.com/agrc/wfrc-bike-map/commit/462d938038a32fb0c067fd33a19d424617b1de7d))
* switch to latest react/utah-design-system template ([3d6d029](https://github.com/agrc/wfrc-bike-map/commit/3d6d02949c574a93521bdc5036f289d0a8a53021)), closes [#8](https://github.com/agrc/wfrc-bike-map/issues/8)
* switch to UGRC-owed base map with lite vector tiles ([0df5d00](https://github.com/agrc/wfrc-bike-map/commit/0df5d0065050b5b202b3d2d2a6e28a0079eee566))
* switch to using LTS_SCORE field ([e74e51b](https://github.com/agrc/wfrc-bike-map/commit/e74e51bbf2e2e3345348e0629068e72ff58ffa8c))
* update remote configs fetch interval to be 60 seconds ([321d504](https://github.com/agrc/wfrc-bike-map/commit/321d504d7167044fe5e22852002bfaf48998de29))
* zoom in further on load ([c5a2aa9](https://github.com/agrc/wfrc-bike-map/commit/c5a2aa9f821b887d54a2939ce2c96464e9d4d904))


### Dependencies

* bump dependencies 🌲 ([c46e082](https://github.com/agrc/wfrc-bike-map/commit/c46e08212a59dc3ceb847c4930da85b55f8b860a))
* bump dependencies 🌲 ([34a68ed](https://github.com/agrc/wfrc-bike-map/commit/34a68edc0c6937032e4d88aa24353d149030cebb))
* bump dependencies 🌲 ([8c03b15](https://github.com/agrc/wfrc-bike-map/commit/8c03b159a3dcd96341aaf132d645baed2e76cc2c))
* bump dependencies 🌲pnpm ([bba9bfa](https://github.com/agrc/wfrc-bike-map/commit/bba9bfa1f9b4bdb04779135b99895501690a844b))
* bump dependency versions 🌲 ([ce20fd8](https://github.com/agrc/wfrc-bike-map/commit/ce20fd829a5ae7ca6228f0ca9ce8473f5ed1b65a))
* bump deps ([4520095](https://github.com/agrc/wfrc-bike-map/commit/4520095a4c1e419c8ff42c2a7291b0bdb58fb87a))
* bump node dependencies 🌲 ([6bf1581](https://github.com/agrc/wfrc-bike-map/commit/6bf15815941ee21ddb8e98695c97a891c3a20451))
* bump the safe-dependencies group across 1 directory with 14 updates ([6c714f5](https://github.com/agrc/wfrc-bike-map/commit/6c714f540fde7008a04de9b532b4463b5642f95a))
* bump the safe-dependencies group across 1 directory with 8 updates ([1625f72](https://github.com/agrc/wfrc-bike-map/commit/1625f72397a61cea14cb6f2e31aaab98f25c3c6f))
* **dev:** bump the major-dependencies group across 1 directory with 2 updates ([5e4faa8](https://github.com/agrc/wfrc-bike-map/commit/5e4faa8e54d0b807307f731311fad564a9fff93c))
* **dev:** bump vitest in the major-dependencies group ([9d22b23](https://github.com/agrc/wfrc-bike-map/commit/9d22b23ec5304bf131aff75edd611522ddcc739b))


### Documentation

* **scripts:** centralize parameter docs ([7a7e161](https://github.com/agrc/wfrc-bike-map/commit/7a7e161b138d0434e315e32dfa3cc31af82afc5c))
* update set up steps ([602e1bd](https://github.com/agrc/wfrc-bike-map/commit/602e1bdb21bda477afc01ada44a3c2b200b80d73))


### Styles

* add a bit of vertical space between identify table rows ([29dbcfe](https://github.com/agrc/wfrc-bike-map/commit/29dbcfe9660826fe6a56c1e7e9428ea5ecf53d6e))
* center road name in identify ([1a256ac](https://github.com/agrc/wfrc-bike-map/commit/1a256ac5e021afee7c891db35aba2e0cfa733853))
* larger screen layout improvements ([b9fa358](https://github.com/agrc/wfrc-bike-map/commit/b9fa35815fdb4a54fa30438612a82b1a679a4047)), closes [#14](https://github.com/agrc/wfrc-bike-map/issues/14)

## [0.4.0-17](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-16...v0.4.0-17) (2025-05-05)


### Features

* log most user interactions to firebase analytics ([3fd2e98](https://github.com/agrc/wfrc-bike-map/commit/3fd2e98c1bab58fc2ccdc2240ea831a3f48ac833))


### Dependencies

* bump dependencies 🌲 ([ba1ce78](https://github.com/agrc/wfrc-bike-map/commit/ba1ce786debb73c7b24d3983b7eeb3826c1c7e33))
* bump node dependencies 🌲 ([1906d69](https://github.com/agrc/wfrc-bike-map/commit/1906d692038836f3ce1b9646d02e5089677fcdb5))

## [0.4.0-16](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-15...v0.4.0-16) (2025-04-14)


### Dependencies

* bump dependencies 🌲 ([54623fd](https://github.com/agrc/wfrc-bike-map/commit/54623fdb44b9f9fe2fba53dc8a953f0f77153993))

## [0.4.0-15](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-14...v0.4.0-15) (2025-04-12)


### Bug Fixes

* fix regression bug causing feedback button not to show the form ([d1aea14](https://github.com/agrc/wfrc-bike-map/commit/d1aea145a4869c7a914b62e26f5e9e966c214d2c))

## [0.4.0-14](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-13...v0.4.0-14) (2025-04-12)


### Bug Fixes

* fix regression bug preventing identify when the drawer is toggled off ([77e4a0c](https://github.com/agrc/wfrc-bike-map/commit/77e4a0c4e5f6aeb0e91c5569a8e5065243d077e5))
* move basemap toggle to top left ([4f603a8](https://github.com/agrc/wfrc-bike-map/commit/4f603a867bf67bde23c37c5a07cf262d278a3174))
* prevent the URL from being updated too many times during panning and zooming ([e0cc5cb](https://github.com/agrc/wfrc-bike-map/commit/e0cc5cb620a4b659fe1cbaf374496dea26b74202))

## [0.4.0-13](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-12...v0.4.0-13) (2025-04-12)


### Features

* add basemap toggle control ([7e4628c](https://github.com/agrc/wfrc-bike-map/commit/7e4628c9856b9f62f6a1fde720559649add17a0e)), closes [#88](https://github.com/agrc/wfrc-bike-map/issues/88)
* add logo and favicon ([5c7a0ae](https://github.com/agrc/wfrc-bike-map/commit/5c7a0ae728235d626fbf7669811df1baf54283b0)), closes [#23](https://github.com/agrc/wfrc-bike-map/issues/23)
* add zoom to my location button ([1bac0cf](https://github.com/agrc/wfrc-bike-map/commit/1bac0cfba5d3c873eea3897048602a6b2b2677c6)), closes [#78](https://github.com/agrc/wfrc-bike-map/issues/78)


### Bug Fixes

* data type error on NOTES field ([9f0a348](https://github.com/agrc/wfrc-bike-map/commit/9f0a3484d0f090f5ff34056f1ba8e06059a52ad7))
* **scripts:** fix city & county join and other refinements ([21c4397](https://github.com/agrc/wfrc-bike-map/commit/21c4397637f0ac08bddbe9d6d297677c35b72b93))
* **scripts:** updates in preparation for running as part of the roads update ([094b528](https://github.com/agrc/wfrc-bike-map/commit/094b528a7448b0ff9872219ca88a17d96b60c37b))


### Dependencies

* bump dependencies 🌲 ([c4744f1](https://github.com/agrc/wfrc-bike-map/commit/c4744f16ecfb3632d1891bf9be65d385dad12d91))


### Documentation

* **scripts:** centralize parameter docs ([c3193f4](https://github.com/agrc/wfrc-bike-map/commit/c3193f4b0c81e23d53ca37c378c0c9e4887ccb78))


### Styles

* larger screen layout improvements ([6ce9d65](https://github.com/agrc/wfrc-bike-map/commit/6ce9d65fe8c2ed7a3260624ad5dcdd96c47714e1)), closes [#14](https://github.com/agrc/wfrc-bike-map/issues/14)

## [0.4.0-12](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-11...v0.4.0-12) (2025-04-02)


### Features

* **functions:** send confirmation and notification feedback emails ([db149e9](https://github.com/agrc/wfrc-bike-map/commit/db149e96a9e0c53e347a0ffec68f04a4a798f0dc))
* implement generic location feedback ([15e3bff](https://github.com/agrc/wfrc-bike-map/commit/15e3bff7875c7307fc8b4687a99566bd6992fd00))


### Dependencies

* bump dependency versions 🌲 ([db5bbf8](https://github.com/agrc/wfrc-bike-map/commit/db5bbf8a86032a472182a9ab208a162e35107e14))


### Documentation

* update set up steps ([222be0d](https://github.com/agrc/wfrc-bike-map/commit/222be0d6f8c723f49c1b21a0cf60dd84bba3a9d2))

## [0.4.0-11](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-10...v0.4.0-11) (2025-03-18)


### Bug Fixes

* **functions:** add environment variables ([ab8b597](https://github.com/agrc/wfrc-bike-map/commit/ab8b5972b04d3b0a4c31621ce92e84a3fca44eca))

## [0.4.0-10](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-9...v0.4.0-10) (2025-03-17)


### Bug Fixes

* **function:** include missing explicit dependency ([10efc43](https://github.com/agrc/wfrc-bike-map/commit/10efc4365e8b863cb16fc6f14f39504e4bc6a5a0))

## [0.4.0-9](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-8...v0.4.0-9) (2025-03-17)


### Bug Fixes

* **function:** install deps before typescript build ([7808076](https://github.com/agrc/wfrc-bike-map/commit/7808076f6c0715771e54db3eeaab739d269b698a))

## [0.4.0-8](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-7...v0.4.0-8) (2025-03-17)


### Features

* implement feature-specific feedback ([6562758](https://github.com/agrc/wfrc-bike-map/commit/65627581c3d15734708073b5af1d0e019c810310)), closes [#17](https://github.com/agrc/wfrc-bike-map/issues/17)

## [0.4.0-7](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-6...v0.4.0-7) (2025-03-13)


### Features

* preserve filter and map extent state as URL parameters ([340d8b4](https://github.com/agrc/wfrc-bike-map/commit/340d8b491e7f9dfadd7c392a43618f7f696d3fd9)), closes [#15](https://github.com/agrc/wfrc-bike-map/issues/15)


### Styles

* add a bit of vertical space between identify table rows ([6baa57c](https://github.com/agrc/wfrc-bike-map/commit/6baa57ce51e87f99a362675e626cc171832dd357))

## [0.4.0-6](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-5...v0.4.0-6) (2025-03-13)


### Bug Fixes

* fix bug causing the state of both filter types to be mixed ([c1816a2](https://github.com/agrc/wfrc-bike-map/commit/c1816a290d0eda7623d67268ac719df206f3d5c4))

## [0.4.0-5](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-4...v0.4.0-5) (2025-03-11)


### Features

* add the ability to configure the order of checkboxes in the filter ([8c0e9ef](https://github.com/agrc/wfrc-bike-map/commit/8c0e9efa8f9aaf5485403cd557dc0297c43c4fb0)), closes [#79](https://github.com/agrc/wfrc-bike-map/issues/79)

## [0.4.0-4](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-3...v0.4.0-4) (2025-03-11)


### Features

* add about content to firebase remote configs ([b6a6029](https://github.com/agrc/wfrc-bike-map/commit/b6a6029f90d319e594ef3d0b457fdb86c2538bc1)), closes [#76](https://github.com/agrc/wfrc-bike-map/issues/76)


### Bug Fixes

* update remote configs fetch interval to be 60 seconds ([58f1aac](https://github.com/agrc/wfrc-bike-map/commit/58f1aac53b404026ec2d169101e309844e8e6832))

## [0.4.0-3](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-2...v0.4.0-3) (2025-03-05)


### Bug Fixes

* **ci:** use npx to run firebase cli ([68ca6f0](https://github.com/agrc/wfrc-bike-map/commit/68ca6f0f102c37daca118654537c36d599dee12d))

## [0.4.0-2](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-1...v0.4.0-2) (2025-03-04)


### Features

* add about dialog with default location option ([04c9f0a](https://github.com/agrc/wfrc-bike-map/commit/04c9f0a7c6308458d2b8a6753ddc0885349000fc))
* migrate configs to firebase remote configs ([b048e4f](https://github.com/agrc/wfrc-bike-map/commit/b048e4f9428be19fd0964874ab38130ed6927177))


### Bug Fixes

* make identify content look a little nicer ([cf2e668](https://github.com/agrc/wfrc-bike-map/commit/cf2e668752832a296df088e73fb884a8da8f95a0))
* prevent wrapping of identify attribute labels ([af08577](https://github.com/agrc/wfrc-bike-map/commit/af085774161c620c26953ce064a9e09ea7cef9b3))
* remove scroll bars from drawer ([500ef22](https://github.com/agrc/wfrc-bike-map/commit/500ef22173d2ffda39af9c553a5cf04ffddbb633))
* zoom in further on load ([f4cbbb0](https://github.com/agrc/wfrc-bike-map/commit/f4cbbb04ec2e425da6a03e7d28cba38cefc47b6b))


### Styles

* center road name in identify ([2fadda7](https://github.com/agrc/wfrc-bike-map/commit/2fadda759d3e20d3a727d80f791956b4cbf9033a))

## [0.4.0-1](https://github.com/agrc/wfrc-bike-map/compare/v0.4.0-0...v0.4.0-1) (2025-02-28)


### Bug Fixes

* clear identify if no feature is found on tap ([1675f18](https://github.com/agrc/wfrc-bike-map/commit/1675f188a830b6d8eb35bbdec4ed0ee773d1d17e))

## [0.4.0-0](https://github.com/agrc/wfrc-bike-map/compare/v0.3.1-2...v0.4.0-0) (2025-02-27)


### Features

* basic feature identify based on popup templates ([1923058](https://github.com/agrc/wfrc-bike-map/commit/19230580e568d8706d1c33ff2a612ab77f7900d5)), closes [#18](https://github.com/agrc/wfrc-bike-map/issues/18)


### Bug Fixes

* switch to using LTS_SCORE field ([f41fae2](https://github.com/agrc/wfrc-bike-map/commit/f41fae24c54d8f1f1dfa57bce679912188ed2e1d))


### Dependencies

* bump dependencies 🌲pnpm ([d99421b](https://github.com/agrc/wfrc-bike-map/commit/d99421b3432cf9f4574836df29884a300390fa35))

## [0.3.1-2](https://github.com/agrc/wfrc-bike-map/compare/v0.3.1-1...v0.3.1-2) (2025-02-10)


### Features

* add map drawing busy bar ([2ebd416](https://github.com/agrc/wfrc-bike-map/commit/2ebd416df0f77fdcdafd72250031dd935a979ba5))
* add symbols to renderer class checkboxes ([2993032](https://github.com/agrc/wfrc-bike-map/commit/2993032e69af25363c8df1e6ccfc9788c45a2c79)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)
* place filter/legend into collapsible tray ([f3020f5](https://github.com/agrc/wfrc-bike-map/commit/f3020f5738cbd24c8f07d41669f8af728c2cf048)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)
* wire up symbol class checkboxes to filter ([b21871e](https://github.com/agrc/wfrc-bike-map/commit/b21871eccd2a608f90cf942105f6a26dcec0df14)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)
* wire up traffic signals layer classes ([eab0a1a](https://github.com/agrc/wfrc-bike-map/commit/eab0a1ad73a39cbeacce230ae5de6f2d99d29a54)), closes [#11](https://github.com/agrc/wfrc-bike-map/issues/11)


### Bug Fixes

* make title match header color ([7be6315](https://github.com/agrc/wfrc-bike-map/commit/7be631560cf56739c9f457ee480e61dd942ecaa6))

## [0.3.1-1](https://github.com/agrc/wfrc-bike-map/compare/v0.3.1-0...v0.3.1-1) (2025-02-07)


### Bug Fixes

* adjust map center and zoom level in MapContainer ([bca2158](https://github.com/agrc/wfrc-bike-map/commit/bca21589932ce2c6cfaa60b71e5d422fe602cc68))
* switch to UGRC-owed base map with lite vector tiles ([a3b9641](https://github.com/agrc/wfrc-bike-map/commit/a3b9641dd64370efa1b86c9453b3e5e40fd13cff))

## [0.3.1-0](https://github.com/agrc/wfrc-bike-map/compare/v0.3.0-0...v0.3.1-0) (2025-02-06)


### Bug Fixes

* point at latest map from WFRC ([13e6f61](https://github.com/agrc/wfrc-bike-map/commit/13e6f61b1d93551338809b08f17c61785b71e9ec))
* switch to latest react/utah-design-system template ([d5ddc4e](https://github.com/agrc/wfrc-bike-map/commit/d5ddc4e8f43823d8634479dcfea4764594775d47)), closes [#8](https://github.com/agrc/wfrc-bike-map/issues/8)


### Dependencies

* bump deps ([90e3ab5](https://github.com/agrc/wfrc-bike-map/commit/90e3ab52355c0c3c461b43e0d757bc853c49daf4))
* Q4 dependency bumps ([998f6a8](https://github.com/agrc/wfrc-bike-map/commit/998f6a8a4644eabd8531e1a990a82986ac316ade))


### Documentation

* add dev setup steps ([3f70fd6](https://github.com/agrc/wfrc-bike-map/commit/3f70fd60cf243724f491d3f27971b3ce9ecc6dcc))
* add notes about branches, commits, and PRs ([5dd587b](https://github.com/agrc/wfrc-bike-map/commit/5dd587bb448959d42332ecea40c6b5f61a4b7a48))

## [0.3.0-0](https://github.com/agrc/wfrc-bike-map/compare/v0.2.0-0...v0.3.0-0) (2024-02-27)


### 🚀 Features

* add filter toggle ([844ddfa](https://github.com/agrc/wfrc-bike-map/commit/844ddfacd16157da534db16ffe67b40a999c899b))
* switch filter header and contents ([56115f7](https://github.com/agrc/wfrc-bike-map/commit/56115f727ec8a29f5887f016f2d9e909939bff57))


### 🐛 Bug Fixes

* bring a little utah design system into the mix ([cd5ace2](https://github.com/agrc/wfrc-bike-map/commit/cd5ace2ba773fb7ed2cdfbe23cd7c78b1dd228ad))
* finish removing attribution ([e39e905](https://github.com/agrc/wfrc-bike-map/commit/e39e905d34e1d73fbad7af554e6075419357566d))

## [0.2.0-0](https://github.com/agrc/wfrc-bike-map/compare/v0.1.0-0...v0.2.0-0) (2024-02-26)


### 🚀 Features

* about dialog ([53a602b](https://github.com/agrc/wfrc-bike-map/commit/53a602bb7eb1e3a5ae3d50db4ca1ce3af9ac4610))
* add map and beginnings of layout shell ([b0cc050](https://github.com/agrc/wfrc-bike-map/commit/b0cc050a475305c57a134372acdba2d0cd9281dc))
* add route types panel ([480a466](https://github.com/agrc/wfrc-bike-map/commit/480a4663faded27b4cdf90594cf352a2c0f6a81a))
* remove zoom widgets and add home and track ([82aa6ae](https://github.com/agrc/wfrc-bike-map/commit/82aa6aee34a4701cafd79422100d42ea1c9794c9))
* show/hide map zoom controls ([8cfa67b](https://github.com/agrc/wfrc-bike-map/commit/8cfa67bd598c955cafbf39ea2b98edd9ed26d6ea))


### 🐛 Bug Fixes

* switch to navigation component for header ([dda6730](https://github.com/agrc/wfrc-bike-map/commit/dda6730ff70e1bf22f29aaadf3c8661c9d5d61d1))

## [0.1.0-0](https://github.com/agrc/wfrc-bike-map/compare/v0.0.0...v0.1.0-0) (2024-02-23)


### 🚀 Features

* print app version in console ([830b77a](https://github.com/agrc/wfrc-bike-map/commit/830b77a81292f39dde4258ef17492363adca921f))

## Changelog
