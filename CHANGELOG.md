# [](https://github.com/francoischalifour/autocomplete.js/compare/v1.0.0-alpha.10...v) (2020-04-24)


### Bug Fixes

* re-export styles from style entry ([ff99bd5](https://github.com/francoischalifour/autocomplete.js/commit/ff99bd5ac1a40ee1b18194fe432c3c9afb9370f6))
* **core:** don't extrat highlighted item from undefined source ([b0601da](https://github.com/francoischalifour/autocomplete.js/commit/b0601da315fc22a84290e3a0db3bd11158067745))
* **core:** skip state change on `onClick` if URL ([53f634d](https://github.com/francoischalifour/autocomplete.js/commit/53f634df1ea9d1249ebb6894aacb05473f202cd0))
* **design:** animation + spacing search button ([7f734d6](https://github.com/francoischalifour/autocomplete.js/commit/7f734d6ee291e7a2aba7c107558799f4d7204c83))
* **design:** contrast + darkmode ([eec8a0b](https://github.com/francoischalifour/autocomplete.js/commit/eec8a0b990f7a650d4c5d55225ba38a905c3227f))
* **design:** error screen, loading indicator, no results links ([522377f](https://github.com/francoischalifour/autocomplete.js/commit/522377f23a7cbe02074658e7d4353605fba1f6a5))
* **design:** footer, hit spacing ([3e6468a](https://github.com/francoischalifour/autocomplete.js/commit/3e6468a36da8e3e418f111f001f98bf16c057a4b))
* **design:** hovers + tree icons ([ba60df8](https://github.com/francoischalifour/autocomplete.js/commit/ba60df8eb0374fb3d873ffaa893f30b2a57be612))
* **design:** icons ([d225ea2](https://github.com/francoischalifour/autocomplete.js/commit/d225ea2044d0a5f3a0a44d87e7ec6c7d2c4ffd01))
* **design:** improvements from feedbacks ([48e4090](https://github.com/francoischalifour/autocomplete.js/commit/48e4090db0b6be7c81dec8d132ac3133584ae898))
* **design:** mobile ([8a02679](https://github.com/francoischalifour/autocomplete.js/commit/8a02679588c405696b301cc78bc5ac750ee341cb))
* **design:** mobile scroll and source zindex ([72fd25b](https://github.com/francoischalifour/autocomplete.js/commit/72fd25b0df097e272242887d5f815644c7d0535e))
* **design:** modal height, no results screen ([0645d9a](https://github.com/francoischalifour/autocomplete.js/commit/0645d9a58ed059dcd2d09b2e94121a1247f85cba))
* **design:** No results cosmetics ([4185ae3](https://github.com/francoischalifour/autocomplete.js/commit/4185ae32b3a1b29344b1d24b8a3aa94de3f46e8b))
* **design:** no results, empty screen + details ([2e50842](https://github.com/francoischalifour/autocomplete.js/commit/2e50842aa55f4d0230ab14535fd7beaf8916fde5))
* **design:** tablet responsive ([d787c95](https://github.com/francoischalifour/autocomplete.js/commit/d787c95ee19e42464ce0c91c446fa8d9818779a1))
* **docsearch:** do not render Screen when loading or stalled ([dfb855e](https://github.com/francoischalifour/autocomplete.js/commit/dfb855e630dde188dd1f9b92be41933d72a57db1))
* **docsearch:** don't add search to recent searches if favorited ([32a09c2](https://github.com/francoischalifour/autocomplete.js/commit/32a09c2b558f759e04a23d0c7d7437e82190c454))
* **docsearch:** don't display items when no suggestions ([7556342](https://github.com/francoischalifour/autocomplete.js/commit/7556342ef48315fe51e5df545a41dc521680f5a2))
* **docsearch:** don't focus input if initial query ([466f325](https://github.com/francoischalifour/autocomplete.js/commit/466f325f374663e272c43d8f0343618c96632e9d))
* **docsearch:** don't request Algolia on start screen ([a5430c9](https://github.com/francoischalifour/autocomplete.js/commit/a5430c91ddc14ecdf5841403bd1ac453ad4fd03b))
* **docsearch:** drop the "..." ([e626c54](https://github.com/francoischalifour/autocomplete.js/commit/e626c5481e6deadb85d81ba80d51be82fdb0c31e))
* **docsearch:** hide search suggestions if none ([574dbc6](https://github.com/francoischalifour/autocomplete.js/commit/574dbc6ab153c29cb9229d9580359e86a6c902d5))
* **docsearch:** limit number of searches retrieved ([9c330f5](https://github.com/francoischalifour/autocomplete.js/commit/9c330f567c33aac31971691e39b91c0a0476ae27))
* **docsearch:** limit query size ([bc34735](https://github.com/francoischalifour/autocomplete.js/commit/bc347354be41c9134b151d98eb13b99c4d0c1260))
* **docsearch:** make sure there are search suggestions before showing them ([00d031c](https://github.com/francoischalifour/autocomplete.js/commit/00d031cad613252b96a946288b69c0c3f51d11d2))
* **docsearch:** provide autocomplete ID for HTML attributes ([7137e86](https://github.com/francoischalifour/autocomplete.js/commit/7137e8618a428bb018d4f334dfacd92bf532a8f4))
* **docsearch:** remove recent search when favorited ([c88cc79](https://github.com/francoischalifour/autocomplete.js/commit/c88cc79157c72ed99b06a74407e3bc08e0cd5388))
* **docsearch:** restore scroll position when closing on mobile ([27d8c5e](https://github.com/francoischalifour/autocomplete.js/commit/27d8c5ef7bc346fa61236fa165cd3380c746a4fc))
* **docsearch:** update local storage key ([1d37f78](https://github.com/francoischalifour/autocomplete.js/commit/1d37f7856f0780cf579485ba5c902253fffd6759))
* **docsearch:** update search suggestions when new lvl0s are encountered ([8c79685](https://github.com/francoischalifour/autocomplete.js/commit/8c79685511e2d6670d8164bc2f19672cfcd8f6be))
* **docusaurus:** add crossorigin to preconnect script ([5dbfa11](https://github.com/francoischalifour/autocomplete.js/commit/5dbfa11fa3ab50c16fc71af1d51e30fb575ffdfc))
* **docusaurus:** default `appId` to leverage `preconnect` ([b4a59fd](https://github.com/francoischalifour/autocomplete.js/commit/b4a59fd71ae7ffdc6b85e8e428d37011bc72ad93))
* **react:** remove `maxLength` option supported in core ([3288e6d](https://github.com/francoischalifour/autocomplete.js/commit/3288e6d07e2bbbfd5a4646d336fba40c3047b31f))


### Features

* create clean exports ([d0f8ff3](https://github.com/francoischalifour/autocomplete.js/commit/d0f8ff3ab4f89c9dce1f2bdc923d94aed7515dc1))
* **design:** icon actions ([056d333](https://github.com/francoischalifour/autocomplete.js/commit/056d333780d6c5f48cf86236b443916b75b073b4))
* **design:** new error icons + update icons + update light shadows / searchbox ([2e77e70](https://github.com/francoischalifour/autocomplete.js/commit/2e77e70e792ccb52d7c6300f149697fad441fd2e))
* **design:** new icons ([5bd3cbc](https://github.com/francoischalifour/autocomplete.js/commit/5bd3cbc10693d3b65f7908e3523fa9bcc187f0ea))
* **docsearch:** add `hitComponent` and `transformItems` options ([daaafe5](https://github.com/francoischalifour/autocomplete.js/commit/daaafe5178cd43e258e389f579bc7517a3935b09))
* **docsearch:** add DocSearch for Docusaurus ([#39](https://github.com/francoischalifour/autocomplete.js/issues/39)) ([ad63053](https://github.com/francoischalifour/autocomplete.js/commit/ad630539c444417f414e0e8bcf74fd20f7cd73c8))
* **docsearch:** add recent searches ([#40](https://github.com/francoischalifour/autocomplete.js/issues/40)) ([36e7fab](https://github.com/francoischalifour/autocomplete.js/commit/36e7fabe43582fe358cb15f92e5afddecd5f1a7d))
* **docsearch:** add search suggestions ([d1fe8b2](https://github.com/francoischalifour/autocomplete.js/commit/d1fe8b2be3d30f067892ac9f04f6f802b6b40826))
* **docsearch:** allow placeholder customization ([3a4f13b](https://github.com/francoischalifour/autocomplete.js/commit/3a4f13b35198a0372f6d4cab7b661e774e424c6f))
* **docsearch:** animate cards on action ([8c7bdc1](https://github.com/francoischalifour/autocomplete.js/commit/8c7bdc117f6a76a53c9245a2089cda5dd02b71e6))
* **docsearch:** append modal to body ([73a7f0e](https://github.com/francoischalifour/autocomplete.js/commit/73a7f0ed491407d9c80ef9d14ddd704c0ac8f7c4))
* **docsearch:** catch retry errors in the search client ([750c4b5](https://github.com/francoischalifour/autocomplete.js/commit/750c4b51e2159a787613aa959ac62238c1f1a65b))
* **docsearch:** display more recent searches when no favorites ([a4c7082](https://github.com/francoischalifour/autocomplete.js/commit/a4c70825cc5d204b0ee44bcb8965a325f7fa5471))
* **docsearch:** forward props to autocomplete-core ([7cbcb12](https://github.com/francoischalifour/autocomplete.js/commit/7cbcb128bd59fe5c550ffb534f399b2b1022e5a3))
* **docsearch:** introduce favorite searches ([61bd0aa](https://github.com/francoischalifour/autocomplete.js/commit/61bd0aa5f768658c70f7cb0b7bb465c9b9579da7))
* **docsearch:** introduce Selection Search ([d5fd4d6](https://github.com/francoischalifour/autocomplete.js/commit/d5fd4d66a08a1b6d7f990757261c5f9e32e95c1c))
* **docsearch:** save content record hit parent in recent searches ([3fe547f](https://github.com/francoischalifour/autocomplete.js/commit/3fe547f2cc17f2c5a2f1c526bca4e98b42093e1f))
* **docsearch:** save content record hit parent in recent searches ([5f8df1f](https://github.com/francoischalifour/autocomplete.js/commit/5f8df1f0400b567e223d8c895f07d36c319605ae))
* **docsearch:** trap focus in modal ([0ca92ca](https://github.com/francoischalifour/autocomplete.js/commit/0ca92ca18b60d3949f4150a7afb5eb1f6984612d))
* **docsearch:** use `preconnect` link in Docusaurus integration ([33e2e8b](https://github.com/francoischalifour/autocomplete.js/commit/33e2e8bd9436222933e7bd949082c3a446cb9f6e))
* **docsearch:** use relative URLs ([f434ca1](https://github.com/francoischalifour/autocomplete.js/commit/f434ca1f92c9638ddfa42f3cd8b7d0093490830f))


### Reverts

* Revert "chore: use Babel to replace DocSearch verison in UA" ([42caf20](https://github.com/francoischalifour/autocomplete.js/commit/42caf20187a7b716767588ba9081bfa181fa9e13))



# [1.0.0-alpha.10](https://github.com/francoischalifour/autocomplete.js/compare/v0.37.0...v1.0.0-alpha.10) (2020-03-31)

### Bug Fixes

- remove unused prop getters ([074c92d](https://github.com/francoischalifour/autocomplete.js/commit/074c92d3601cd0208759a211b2d22ca2430a2340))
- **core:** call `generateAutocompleteId` only if necessary ([ce4d496](https://github.com/francoischalifour/autocomplete.js/commit/ce4d496d1f074d02051c1cbe1f296d2a5d6e1c1c))
- **getters:** compute `aria-autocomplete` based on the props ([9ea5042](https://github.com/francoischalifour/autocomplete.js/commit/9ea5042c3a78126c09b03daff2b682db4535aba1))
- **getters:** don't forward data prop getters ([0deb9a1](https://github.com/francoischalifour/autocomplete.js/commit/0deb9a14a14e7730c2b54c63a5138a4bfcd2d1e7))
- **react:** fix options types ([fdde35f](https://github.com/francoischalifour/autocomplete.js/commit/fdde35ff26da7a097c073816e1da76d6f0e6ed49))
- **react:** remove dropdown from DOM when closed ([c647224](https://github.com/francoischalifour/autocomplete.js/commit/c64722467f7ab77babc6e53b4f46386efd335d95))

### Features

- **core:** allow input pause in keyboard navigation ([0000499](https://github.com/francoischalifour/autocomplete.js/commit/000049971884e958e92cbfd14331ab88ff2b5e1f))
- **core:** introduce `getDropdownProps` ([9b758ee](https://github.com/francoischalifour/autocomplete.js/commit/9b758eee271954eb7228916bf822b09a1a715e61))
- **react:** attach Algolia agents in React renderer ([c6c4da5](https://github.com/francoischalifour/autocomplete.js/commit/c6c4da580afec6dbf69b55c55809b1e1f9b8e9fc))
- **react:** create highlighting components ([fb49161](https://github.com/francoischalifour/autocomplete.js/commit/fb49161ea59f3ff925bcffe3e74435acb6e47c18))
- add openOnFocus and remove minLength ([#31](https://github.com/francoischalifour/autocomplete.js/issues/31)) ([553ea68](https://github.com/francoischalifour/autocomplete.js/commit/553ea68950bfc94eb8588a71dd5580db4682931c))
- swap Preact with React ([#34](https://github.com/francoischalifour/autocomplete.js/issues/34)) ([e0f2568](https://github.com/francoischalifour/autocomplete.js/commit/e0f25689440f7177e663ac6306e49f8f89a0727a))
- **autoFocus:** add support for `autoFocus` option ([4d3f792](https://github.com/francoischalifour/autocomplete.js/commit/4d3f7921307ef9417a8dd1147e71309350de77fe))
- **core:** filter out falsy sources ([f771522](https://github.com/francoischalifour/autocomplete.js/commit/f771522df77f3297644aec5214b459fc960f0b3f))
- **core:** introduce `getEnvironmentProps` for mobile experience ([#27](https://github.com/francoischalifour/autocomplete.js/issues/27)) ([f9d7eed](https://github.com/francoischalifour/autocomplete.js/commit/f9d7eed75514911ee45ed3aaee47c30373fdbd8a))
- **core:** process completion as a state enhancer ([#29](https://github.com/francoischalifour/autocomplete.js/issues/29)) ([53c2ef7](https://github.com/francoischalifour/autocomplete.js/commit/53c2ef7b1b985486199ae2dc54069a7bcfe3b41a))
- **core:** rename `shouldDropdownOpen` to `shouldDropdownShow` ([f2c3eb2](https://github.com/francoischalifour/autocomplete.js/commit/f2c3eb2d5ec6e5338df5b685af8edfb6cc477659)), closes [/github.com/francoischalifour/autocomplete.js/pull/16#pullrequestreview-355978230](https://github.com//github.com/francoischalifour/autocomplete.js/pull/16/issues/pullrequestreview-355978230)
- **core:** support `onHighlight` on sources ([0f4101b](https://github.com/francoischalifour/autocomplete.js/commit/0f4101bbf82e15afcc6f02ae1075a05dee7f261c))
- **core:** support `onSelect` on sources ([0cf0a93](https://github.com/francoischalifour/autocomplete.js/commit/0cf0a93bf3e5c04972e70c716867ce82e220c640))
- **onInput:** support `onInput` prop for controlled mode ([7345eb9](https://github.com/francoischalifour/autocomplete.js/commit/7345eb9c279b28a00bc833912fa9697654becab0))
- **onSubmit:** introduce `onSubmit` option ([#24](https://github.com/francoischalifour/autocomplete.js/issues/24)) ([ca0891c](https://github.com/francoischalifour/autocomplete.js/commit/ca0891c87256f0eb6a04f28fbf92b42826346c67))
- **react:** introduce `inputRef` for focus management ([#32](https://github.com/francoischalifour/autocomplete.js/issues/32)) ([4d804fe](https://github.com/francoischalifour/autocomplete.js/commit/4d804fe62ee7d67fb335866aeeb87f070255319e))
- **react:** place dropdown with Popper ([#25](https://github.com/francoischalifour/autocomplete.js/issues/25)) ([ca38070](https://github.com/francoischalifour/autocomplete.js/commit/ca380704f6506dc6c9c82b564701da3ce5772109))
- **website:** add Docusaurus 2 website ([#33](https://github.com/francoischalifour/autocomplete.js/issues/33)) ([3ee0ab5](https://github.com/francoischalifour/autocomplete.js/commit/3ee0ab53bd3d78ac3943fd35ec54f14d016dbd5a))

<a name="0.37.0"></a>

# [0.37.0](https://github.com/algolia/autocomplete.js/compare/v0.36.0...v0.37.0) (2019-08-30)

### Bug Fixes

- **clear:** Avoid error when clear is called after destroy ([#287](https://github.com/algolia/autocomplete.js/issues/287)) ([244425d](https://github.com/algolia/autocomplete.js/commit/244425d))

<a name="0.36.0"></a>

# [0.36.0](https://github.com/algolia/autocomplete.js/compare/v0.35.0...v0.36.0) (2019-02-21)

### Bug Fixes

- **standalone:** use aria label from input ([#276](https://github.com/algolia/autocomplete.js/issues/276)) ([4b94466](https://github.com/algolia/autocomplete.js/commit/4b94466))

<a name="0.35.0"></a>

# [0.35.0](https://github.com/algolia/autocomplete.js/compare/v0.34.0...v0.35.0) (2018-12-17)

### Bug Fixes

- **chrome-only:** Change autocomplete from 'nope' to 'off' ([#273](https://github.com/algolia/autocomplete.js/issues/273)) ([892a8f0](https://github.com/algolia/autocomplete.js/commit/892a8f0))
- **utils:** correct \_.every method ([#274](https://github.com/algolia/autocomplete.js/issues/274)) ([55af1e3](https://github.com/algolia/autocomplete.js/commit/55af1e3))

<a name="0.34.0"></a>

# [0.34.0](https://github.com/algolia/autocomplete.js/compare/v0.33.0...v0.34.0) (2018-12-04)

### Features

- change autocomplete from 'off' to 'nope' ([#250](https://github.com/algolia/autocomplete.js/issues/250)) ([fbbed04](https://github.com/algolia/autocomplete.js/commit/fbbed04))

<a name="0.33.0"></a>

# [0.33.0](https://github.com/algolia/autocomplete.js/compare/v0.32.0...v0.33.0) (2018-11-19)

### Bug Fixes

- **release:** Update mversion to 1.12 ([#268](https://github.com/algolia/autocomplete.js/issues/268)) ([08b8e30](https://github.com/algolia/autocomplete.js/commit/08b8e30))

### Features

- **selected:** Adding context.selectionMethod to selected event ([#267](https://github.com/algolia/autocomplete.js/issues/267)) ([36028a6](https://github.com/algolia/autocomplete.js/commit/36028a6))

<a name="0.32.0"></a>

# [0.32.0](https://github.com/algolia/autocomplete.js/compare/v0.31.0...v0.32.0) (2018-11-06)

### Bug Fixes

- **zepto:** apply patch to prevent an error ([#263](https://github.com/algolia/autocomplete.js/issues/263)) ([917d5a7](https://github.com/algolia/autocomplete.js/commit/917d5a7))

### Features

- **source:** add cache disabling for datasets ([#254](https://github.com/algolia/autocomplete.js/issues/254)) ([0e65fee](https://github.com/algolia/autocomplete.js/commit/0e65fee))
- add flag for toggling tab autocompletion ([#260](https://github.com/algolia/autocomplete.js/issues/260)) ([4dc7c52](https://github.com/algolia/autocomplete.js/commit/4dc7c52))
- Throw err on update if suggestions are invalid type ([#256](https://github.com/algolia/autocomplete.js/issues/256)) ([179febf](https://github.com/algolia/autocomplete.js/commit/179febf)), closes [#131](https://github.com/algolia/autocomplete.js/issues/131)

<a name="0.31.0"></a>

# [0.31.0](https://github.com/algolia/autocomplete.js/compare/v0.30.0...v0.31.0) (2018-08-08)

### Bug Fixes

- **dataset:** avoid to call the source when upadte is canceled ([a47696d](https://github.com/algolia/autocomplete.js/commit/a47696d))
- **dataset:** avoid usage of callNow for debounce ([1a0ce74](https://github.com/algolia/autocomplete.js/commit/1a0ce74))
- Handle an odd case with the user agent ([#242](https://github.com/algolia/autocomplete.js/issues/242)) ([c194736](https://github.com/algolia/autocomplete.js/commit/c194736))

### Features

- update dist files ([9babf2e](https://github.com/algolia/autocomplete.js/commit/9babf2e))
- **clearOnSelected:** allow users to clear the input instead of filling ([#244](https://github.com/algolia/autocomplete.js/issues/244)) ([aa2edbb](https://github.com/algolia/autocomplete.js/commit/aa2edbb)), closes [#241](https://github.com/algolia/autocomplete.js/issues/241)

<a name="0.30.0"></a>

# [0.30.0](https://github.com/algolia/autocomplete.js/compare/v0.29.0...v0.30.0) (2018-04-30)

<a name="0.29.0"></a>

# [0.29.0](https://github.com/algolia/autocomplete.js/compare/v0.28.3...v0.29.0) (2017-10-12)

### Features

- **a11y:** Add ariaLabel option. ([6db8e1b](https://github.com/algolia/autocomplete.js/commit/6db8e1b))
- **a11y:** Add option to control `aria-labelledby` attribute. ([0491c43](https://github.com/algolia/autocomplete.js/commit/0491c43))

<a name="0.28.3"></a>

## [0.28.3](https://github.com/algolia/autocomplete.js/compare/v0.28.2...v0.28.3) (2017-07-31)

<a name="0.28.2"></a>

## [0.28.2](https://github.com/algolia/autocomplete.js/compare/v0.28.1...v0.28.2) (2017-06-22)

### Bug Fixes

- **empty template:** hide main empty template as long as we have results ([344e225](https://github.com/algolia/autocomplete.js/commit/344e225)), closes [#185](https://github.com/algolia/autocomplete.js/issues/185)

<a name="0.28.1"></a>

## [0.28.1](https://github.com/algolia/autocomplete.js/compare/v0.28.0...v0.28.1) (2017-03-29)

### Bug Fixes

- **iOS:** remove double tap bug on hrefs in suggestions ([e532bd8](https://github.com/algolia/autocomplete.js/commit/e532bd8))

<a name="0.28.0"></a>

# [0.28.0](https://github.com/algolia/autocomplete.js/compare/v0.27.0...v0.28.0) (2017-03-24)

<a name="0.27.0"></a>

# [0.27.0](https://github.com/algolia/autocomplete.js/compare/v0.26.0...v0.27.0) (2017-03-06)

### Bug Fixes

- **UA:** add failsafe if params not provided ([30df97a](https://github.com/algolia/autocomplete.js/commit/30df97a)), closes [#166](https://github.com/algolia/autocomplete.js/issues/166)

<a name="0.26.0"></a>

# [0.26.0](https://github.com/algolia/autocomplete.js/compare/v0.25.0...v0.26.0) (2017-02-28)

### Bug Fixes

- **test:** bad handling of no actual inner mechanics of client ([622aec5](https://github.com/algolia/autocomplete.js/commit/622aec5))

### Features

- **algolia agent:** provide an algolia agent when searching ([6ca7ac2](https://github.com/algolia/autocomplete.js/commit/6ca7ac2))
- **algolia agent:** provide an algolia agent when searching ([ef604e1](https://github.com/algolia/autocomplete.js/commit/ef604e1))

<a name="0.25.0"></a>

# [0.25.0](https://github.com/algolia/autocomplete.js/compare/v0.24.2...v0.25.0) (2017-02-07)

### Bug Fixes

- **zepto:** .is() only accepts selectors, reworked code to use pure DOM ([a47a4d4](https://github.com/algolia/autocomplete.js/commit/a47a4d4)), closes [#144](https://github.com/algolia/autocomplete.js/issues/144)

<a name="0.24.2"></a>

## [0.24.2](https://github.com/algolia/autocomplete.js/compare/v0.24.1...v0.24.2) (2017-01-20)

### Bug Fixes

- **dep:** immediate is a dependency, not a devDependency ([22164ad](https://github.com/algolia/autocomplete.js/commit/22164ad))

<a name="0.24.1"></a>

## [0.24.1](https://github.com/algolia/autocomplete.js/compare/v0.24.0...v0.24.1) (2017-01-20)

### Bug Fixes

- **postMessage:** avoid using postMessage when feasible ([a99f664](https://github.com/algolia/autocomplete.js/commit/a99f664)), closes [#142](https://github.com/algolia/autocomplete.js/issues/142)

<a name="0.24.0"></a>

# [0.24.0](https://github.com/algolia/autocomplete.js/compare/0.23.0...v0.24.0) (2017-01-10)

### Bug Fixes

- **angular:** do not launch the directive if autocomplete has a value ([f96a1ba](https://github.com/algolia/autocomplete.js/commit/f96a1ba)), closes [#136](https://github.com/algolia/autocomplete.js/issues/136)
- **typeahead:** propagate redrawn ([82293e4](https://github.com/algolia/autocomplete.js/commit/82293e4))

### Features

- **appendTo:** new parameter ([e40cbd0](https://github.com/algolia/autocomplete.js/commit/e40cbd0))

### 0.23.0 Dec 14, 2016

- feat(build): add noConflict() for standalone build, fixes #133

### 0.22.1 Nov 07, 2016

- Fixes bad behavior when `autoselectOnBlur` used, fixes #113

### 0.22.0 Oct 25, 2016

- Add `autocomplete:cursorremoved` event, see #105
- Add `autoselectOnBlur` option, fixes #113

### 0.21.8 Oct 3, 2016

- Do not allow Zepto to leak to window. Never.

### 0.21.7 Sep 21, 2016

- Ensure the `empty` templates get displayed before the `footer`.
- Ensure the dataset `empty` templates are displayed when all datasets are empty.

### 0.21.6 Sep 20, 2016

- Make sure we don't leak/override `window.Zepto`.

### 0.21.5 Sep 15, 2016

- While selecting the top suggestion (autoselect=true), do not update the input.

### 0.21.4 Sep 2, 2016

- Ensure the cursor selects the first suggestion when the dropdown is shown + send the `cursorchanged` event.

### 0.21.3 Aug 1, 2016

- Ensure empty template displays from first keystroke (#104)

### 0.21.2 July 26, 2016

- fix(empty): fix the empty even handling, fixes #95

### 0.21.1 July 19, 2016

- fix(getVal): fix getVal on standalone build

### 0.21.0 July 15, 2016

- Upgrade to zepto 1.2.0

### 0.20.1 June 14, 2016

- Ensure the dropdown menu is hidden when there is an `$empty` block and blank query.

### 0.20.0 June 04, 2016

- Ensure we don't update the input value on mouseenter (#76)
- Render an `empty` template if no results (#80)

### 0.19.1 May 04, 2016

- Fixed the angular build (\_.Event was undefined)

### 0.19.0 Apr 25, 2016

- Allow select handler to prevent menu from being closed (#72)
- Do not trigger the cursorchanged event while entering/leaving nested divs (#71)

### 0.18.0 Apr 07, 2016

- Ability to customize the CSS classes used to render the DOM
- Ensure the `autocomplete:cursorchanged` event is called on `mouseover` as well

### 0.17.3 Apr 04, 2016

- Standalone: ensure we actually use the Zepto object and not whatever is in `window.$`

### 0.17.2 Mar 21, 2016

- Ability to setup the autocomplete on a multi-inputs Zepto selector
- Propagate the `shown` event to the top-level

### 0.17.1 Mar 19, 2016

- REVERT [Ability to setup the autocomplete on a multi-inputs Zepto selector] Fix #59

### 0.17.0 Mar 18, 2016

- Ability to setup the autocomplete on a multi-inputs Zepto selector
- Add a new `shown` event triggered when the dropdown menu is opened and non-empty

BREAKING CHANGE: the standalone object returned by the `autocomplete()` method is now a Zepto object.

### 0.16.2 Jan 22, 2016

- stop using weird zepto package. Stop using chained .data calls it seems that chaining them ended up in an `undefined` return value when passing `undefined` as a value

### 0.16.1 Jan 22, 2016

- remove npm-zepto, use zepto original package (now on npm) fixes #48

### 0.16.0 Dec 11, 2015

- Emit a new `autocomplete:updated` event as soon as a dataset is rendered

### 0.15.0 Dec 10, 2015

- Ability to configure the dropdown menu container

### 0.14.1 Dec 2, 2015

- Move Zepto as a dependency (not a peer dep)
- Really use the `query` instead of the `displayKey` (was supposed to be fixed in 0.11.0)

### 0.14.0 Nov 28, 2015

- Move npm-zepto & angular to peerDependencies
- Fixed custom dropdownMenu's footer & header not being displayed properly
- Allow dataset with name=0

### 0.13.1 Nov 25, 2015

- Move the bower release name to `algolia-autocomplete.js` since `autocomplete.js` is already used

### 0.13.0 Nov 25, 2015

- Add Bower release

### 0.12.0 Oct 15, 2015

- Expose the underlying `close`, `open`, ... functions in the standalone build.

### 0.11.1 Oct 13, 2015

- Zepto doesn't work like jQuery regarding the `data` API, it doesn't support serializing objects.

### 0.11.0 Oct 07, 2015

- If the `displayKey` is not specified and the `value` attribute missing, don't update the input value with `undefined`.
- Expose the `sources` object in the Angular.js build as well.

### 0.10.0 Oct 06, 2015

- Add a new `includeAll` option to the `popularIn` source to add an extra suggestion.

### 0.9.0 Oct 01, 2015

- Full CommonJS compliance (moved from browserify to webpack)

### 0.8.0 Sep 24, 2015

- UMD compliance

### 0.7.0 Sep 16, 2015

- New standalone build (including Zepto.js)
- Get rid of lodash-compat and use jQuery, Zepto or Angular.js's helper functions

### 0.6.0 Sep 11, 2015

- Add Zepto.js support.

### 0.5.0 Sep 9, 2015

- The wrapper span will now have a `table-cell` display if the original input was a `block` inside a `table`.

### 0.4.0 Aug 12, 2015

- Add a new `openOnFocus` option to open the dropdown menu when the input is focused

### 0.3.0 July 27, 2015

- Add Angular.js support [#7]

### 0.2.0 July 16, 2015

- Ability to change the layout based on the matching datasets [#11]

### 0.1.0 July 13, 2015

- Start using semantic versioning

### 0.0.2 July 13, 2015

- Ability to keep the dropdown menu opened when the input if blurred [#1]
- Ability to use a custom dropdown menu template [#2]
- Ability to configure a custom header/footer on the dropdown menu [#3]

### 0.0.1 July 12, 2015

- First release based on Twitter's typeahead.js library
- Travis-ci.org, Coveralls.io, Saucelabs.com integration
- CommonJS compatibility
