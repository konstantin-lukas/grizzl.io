# Changelog

## [1.0.3](https://github.com/konstantin-lukas/grizzl.io/compare/v1.0.2...v1.0.3) (2025-12-23)


### Bug Fixes

* try new client-side middleware ([039e8a2](https://github.com/konstantin-lukas/grizzl.io/commit/039e8a2eafc2fca574735426648437e85803c3a3))

## [1.0.2](https://github.com/konstantin-lukas/grizzl.io/compare/v1.0.1...v1.0.2) (2025-12-23)


### Bug Fixes

* exclude font files from cache ([efd029a](https://github.com/konstantin-lukas/grizzl.io/commit/efd029ac9efe4a0fae03a69fef8114b41bd92c73))
* update service worker ([54fc3d4](https://github.com/konstantin-lukas/grizzl.io/commit/54fc3d4910cbd1f642ec8beee88934a2c7de0de3))

## [1.0.1](https://github.com/konstantin-lukas/grizzl.io/compare/v1.0.0...v1.0.1) (2025-12-23)


### Bug Fixes

* add padding to signin page ([325c57a](https://github.com/konstantin-lukas/grizzl.io/commit/325c57abe7d506d3c85e3df3362a60e9c3f7f0f7))
* allow access to nuxt icons ([c02c47e](https://github.com/konstantin-lukas/grizzl.io/commit/c02c47eebc430fb65c5ee7f9399d562371d93f6b))
* change pwa config ([a5a0d48](https://github.com/konstantin-lukas/grizzl.io/commit/a5a0d48d9148ac2540fcb810495761551adb1610))
* transition to install button ([33c35c9](https://github.com/konstantin-lukas/grizzl.io/commit/33c35c951f656eff375a046a792500442e6e69a9))

## 1.0.0 (2025-12-23)


### Features

* add loading indicator to soft delete ([7b71faf](https://github.com/konstantin-lukas/grizzl.io/commit/7b71faf10411be3ea12d6c92d82a04e0f0636930))
* add offline indicator ([f8e2561](https://github.com/konstantin-lukas/grizzl.io/commit/f8e2561e011fdd6b19bc34aa474feabae0aba33f))
* add soft deletability and undo button ([f728be9](https://github.com/konstantin-lukas/grizzl.io/commit/f728be92d04fd3c52983ac9d13f380cac2a81b26))
* **auth:** add redirect to login page when signing out from landing page ([b15ce42](https://github.com/konstantin-lukas/grizzl.io/commit/b15ce42a7f9995b30a7b71f3496973cd1362dffb))
* **ci:** upload code coverage ([8985437](https://github.com/konstantin-lukas/grizzl.io/commit/8985437d31a80c86d5c959584e99eb958d26ade6))
* **env:** add remaining env variables to env schema ([94de30a](https://github.com/konstantin-lukas/grizzl.io/commit/94de30aecd345d26b22f04cb154828cc8ab55bdc))
* **env:** add remaining env variables to env schema ([7f421bb](https://github.com/konstantin-lukas/grizzl.io/commit/7f421bbbd0605c97bc3c8337e475e424b90cdcd5))
* generalize back button ([99ea15c](https://github.com/konstantin-lukas/grizzl.io/commit/99ea15cdab01531c7b2a5d4e7c1383c5cb6ef352))
* **i18n:** add framework for providing custom zod error messages ([7ca5ca8](https://github.com/konstantin-lukas/grizzl.io/commit/7ca5ca858e1dd946546d98c487e0a5a6d8c3c03c))
* **i18n:** add framework for using interpolations from zod inside translations ([321bf25](https://github.com/konstantin-lukas/grizzl.io/commit/321bf2547de5ebfcc8901c078a21d9357c9ad7bc))
* **nav:** disable unfinished features ([7f8be64](https://github.com/konstantin-lukas/grizzl.io/commit/7f8be643b00239cb82091bd08edcf6785053b41e))
* **timer:** add animations and start button action ([061141a](https://github.com/konstantin-lukas/grizzl.io/commit/061141a1fc5fa0b44928855c64ec0255036b0169))
* **timer:** add basic timer play animation ([4cf5b57](https://github.com/konstantin-lukas/grizzl.io/commit/4cf5b572b63475b331b50bacf839a80fd11464ab))
* **timer:** add control buttons ([e8754f2](https://github.com/konstantin-lukas/grizzl.io/commit/e8754f2e8c954d802e2fc58fee26a22a5b0c3a12))
* **timer:** add createe button ([8b71e26](https://github.com/konstantin-lukas/grizzl.io/commit/8b71e267d4040001d822da263626beb255369099))
* **timer:** add editing of timers (not intervals) ([1c2a7ff](https://github.com/konstantin-lukas/grizzl.io/commit/1c2a7ff7fbb69020fadd641b2e4cdddd9dc5abef))
* **timer:** Add error alert on form error ([e258c49](https://github.com/konstantin-lukas/grizzl.io/commit/e258c492f236ced47efee443542a688ca88c5b18))
* **timer:** add formatted elapsed time during timer playback ([8aeccc9](https://github.com/konstantin-lukas/grizzl.io/commit/8aeccc9212228d56aab89f40f178781f12418ca4))
* **timer:** add framework for undoing delete ([d60812f](https://github.com/konstantin-lukas/grizzl.io/commit/d60812f04250c2490658f2801bb43315aa43b3a1))
* **timer:** add interval beeps and mute button ([0159439](https://github.com/konstantin-lukas/grizzl.io/commit/0159439ec13e6f08c57fafcdcd162eca7f213b4f))
* **timer:** add interval repetition ([0e27598](https://github.com/konstantin-lukas/grizzl.io/commit/0e27598e0c269b0f847e3baf55943602593aede1))
* **timer:** add legend to interval fieldsets ([609a184](https://github.com/konstantin-lukas/grizzl.io/commit/609a1841f0f141475010e44d91647ca85974db8b))
* **timer:** add overall remaining time to timer playback ([508a19d](https://github.com/konstantin-lukas/grizzl.io/commit/508a19d4195620258304ea82eea6548dac10d464))
* **timer:** add play/pause functionality ([dc37063](https://github.com/konstantin-lukas/grizzl.io/commit/dc37063adbc37a10204161413fe9bc75f4dc0d55))
* **timer:** add playback for rhythm timer ([8c21d22](https://github.com/konstantin-lukas/grizzl.io/commit/8c21d22018d8ab978523e9b5f11b8da1794221c5))
* **timer:** add reset button ([840dedb](https://github.com/konstantin-lukas/grizzl.io/commit/840dedb94ca2dd19aeed865266cbe52f744f9676))
* **timer:** add round counter to timer playback ([6b77db2](https://github.com/konstantin-lukas/grizzl.io/commit/6b77db207b29945e1d14183103c899e871d40c05))
* **timer:** add timer interval title transition ([3ce253c](https://github.com/konstantin-lukas/grizzl.io/commit/3ce253c9f3e3a592076efff4764569807fc3c2d2))
* **timer:** add warning if users selected voice doesn't exist on the current device ([8980163](https://github.com/konstantin-lukas/grizzl.io/commit/8980163b165b062dee1d75072a8be7ab10f28cba))
* **timer:** adjust confirm button content when editing timer ([773df05](https://github.com/konstantin-lukas/grizzl.io/commit/773df05ee27418e638b94815452cfe6dc24e9f5b))
* **timer:** count down instead of up and display dashes when playback finished ([78d938c](https://github.com/konstantin-lukas/grizzl.io/commit/78d938ce75cab5af2133e503221071ba4e05ad1f))
* **timer:** include beat sounds in mute feature ([5758857](https://github.com/konstantin-lukas/grizzl.io/commit/5758857fde8f141757de557a7b6afe3177e067ab))
* **timer:** include title utterances in mute feature ([a0ed129](https://github.com/konstantin-lukas/grizzl.io/commit/a0ed12936758015f1eb0195c7fcc5ba33dcb5a7d))
* **timer:** scroll to top of form on form error ([10ce937](https://github.com/konstantin-lukas/grizzl.io/commit/10ce937c4cd0c4290d4786d79d9f350fd3fce914))


### Bug Fixes

* **a11y:** remove incorrect aria-hidden attribute ([925e84d](https://github.com/konstantin-lukas/grizzl.io/commit/925e84d5464b912385a697773e0952e00a38b434))
* **ci:** expose postgres port in test config for fixtures ([d08f371](https://github.com/konstantin-lukas/grizzl.io/commit/d08f371c287fcf7e5e7b9d05a7c4c5ceea762af8))
* **ci:** fix failing build due to changed cwd in new nitro version ([2474d13](https://github.com/konstantin-lukas/grizzl.io/commit/2474d13092299956880897a43aecece1700acaa5))
* **ci:** move env var to correct location ([57fbca3](https://github.com/konstantin-lukas/grizzl.io/commit/57fbca3d25dd0d51393c57386d2ee9524393c1db))
* **ci:** remove leftover dev artifact ([6fd8297](https://github.com/konstantin-lukas/grizzl.io/commit/6fd82971ea52d6f4bb9088386242e15e6e4d1f91))
* **ci:** run prettier ([0bfae58](https://github.com/konstantin-lukas/grizzl.io/commit/0bfae58a26caae692b2967a02d7dc4aa4600016f))
* **ci:** run prettier ([4c1d379](https://github.com/konstantin-lukas/grizzl.io/commit/4c1d379d5b7b653bf7945a128835a8ee691bea31))
* **ci:** update dependencies ([74e90c7](https://github.com/konstantin-lukas/grizzl.io/commit/74e90c7961b0802d725ea91636aded4e28c18b8e))
* **ci:** use correct structure for multiple reporters ([e970577](https://github.com/konstantin-lukas/grizzl.io/commit/e97057752ca125a0205087079cb67d32e2e198cd))
* **e2e:** don't expect href on disabled features ([60e7cd5](https://github.com/konstantin-lukas/grizzl.io/commit/60e7cd51991c0a81d9db6fde1c48202c90410bae))
* **env:** ensure postgres admin credentials are not available in web server container in production ([efc8660](https://github.com/konstantin-lukas/grizzl.io/commit/efc86606265d24b98679412106089e17a04a3c40))
* **env:** use correct zod regex ([0825987](https://github.com/konstantin-lukas/grizzl.io/commit/0825987a78023c3394c035fb4a2759c594dea776))
* **i18n:** solve warning from nuxt config ([ae881e4](https://github.com/konstantin-lukas/grizzl.io/commit/ae881e4ae48c0ef8534517c3895d6274a7806c4e))
* keep sql errors server side and mask with 422 ([daab8e1](https://github.com/konstantin-lukas/grizzl.io/commit/daab8e115daf72df4ce62bfbf4ff88cd66b22ac0))
* **seo:** add title to timer page ([b21f659](https://github.com/konstantin-lukas/grizzl.io/commit/b21f65903f818ef575c0c6b80d059d7604cf3b92))
* **seo:** add titles and descriptions for existing pages ([e1404bf](https://github.com/konstantin-lukas/grizzl.io/commit/e1404bf675e57e1ff215b055b6aab46dbf4d2254))
* **test:** adjust test ids for theme toggle in e2e tests ([ef032c8](https://github.com/konstantin-lukas/grizzl.io/commit/ef032c8b0e313c53cbfc82cd6a23e709584270f5))
* **test:** remove hrefs of unfinished features ([03266cc](https://github.com/konstantin-lukas/grizzl.io/commit/03266cc4c78aa2b81b7368a3ec4a28ce8b8b5e93))
* **test:** replace true with "true" ([9d0503f](https://github.com/konstantin-lukas/grizzl.io/commit/9d0503fb36c712cd955f05f10ea2c679e7e2f607))
* **timer:** add explicit width to timer list items ([2f65512](https://github.com/konstantin-lukas/grizzl.io/commit/2f65512bcfb44a031afdda15bae98d5eeb0e7132))
* **timer:** adjust incorrect timer interval calculation ([c87cadb](https://github.com/konstantin-lukas/grizzl.io/commit/c87cadb58f3a38dbd901e01fea5b942b16b60027))
* **timer:** adjust styles resulting in jumping elements ([8eed5bf](https://github.com/konstantin-lukas/grizzl.io/commit/8eed5bfb0156a95bffcb546387164e9170b4585e))
* **timer:** end loading state on error ([15bae03](https://github.com/konstantin-lukas/grizzl.io/commit/15bae03e7acce9630093ca6b8f77bc02b0ca140d))
* **timer:** fix bar length being incorrectly multiplied by 1000 ([1c5dc34](https://github.com/konstantin-lukas/grizzl.io/commit/1c5dc34c21dd404eda96afca6aefa92abad54051))
* **timer:** fix logic error that prevented creating new intervals when editing timer ([67ce496](https://github.com/konstantin-lukas/grizzl.io/commit/67ce496cf0d3d0dfe64d35b969beb4797ab73b34))
* **timer:** fix overflowing timer title ([07938bb](https://github.com/konstantin-lukas/grizzl.io/commit/07938bb21fca3af1696841edf274bd223291e7dc))
* **timer:** fix timers not being deleted on edit ([0e9705c](https://github.com/konstantin-lukas/grizzl.io/commit/0e9705ce064e232ccfe74b633a9737b828b66e2e))
* **timer:** perform a deep copy of state before deleting interval IDs on timer form submission ([0887e31](https://github.com/konstantin-lukas/grizzl.io/commit/0887e31feb785ac1ae30620a4c8ab59fb7741c95))
* **timer:** prevent first beat in a rhythm timer being played twice when the timer is restarted by clicking the play button instead of the reset button ([418f165](https://github.com/konstantin-lukas/grizzl.io/commit/418f1654a1bd46485f2bfb17393f5b6390a4969b))
* **timer:** read first timer title again after reset ([368ee42](https://github.com/konstantin-lukas/grizzl.io/commit/368ee42e6171e1989646f3bc0bcab9fea62581f8))
* **timer:** read out interval titles correctly ([05c1353](https://github.com/konstantin-lukas/grizzl.io/commit/05c13534ceb3b166f48d70b4522adbc9e5733a98))
* **timer:** remove performance bug and reading interval time bug ([1698300](https://github.com/konstantin-lukas/grizzl.io/commit/1698300ab3a7982e4253cd56db060a4a41529ee6))
* **timer:** reset current beat when interval is reset ([6a0738f](https://github.com/konstantin-lukas/grizzl.io/commit/6a0738f79b6aec9351cabc13db47fb7a26dbba9d))
* **timer:** run prettier ([dcd05b1](https://github.com/konstantin-lukas/grizzl.io/commit/dcd05b143fd42e9d56b53e224d0d13c8b475b47f))
* **type:** replace VueWrapper with DOMWrapper on findByTestId type declaration ([aa18fd4](https://github.com/konstantin-lukas/grizzl.io/commit/aa18fd4bd2f55b9f680cd7bfdca2cb257d13a3b0))
