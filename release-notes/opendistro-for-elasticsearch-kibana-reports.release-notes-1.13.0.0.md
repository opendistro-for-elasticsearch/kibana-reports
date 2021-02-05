## 2021-02-04 Version 1.13.0.0

### Features
* Add Custom Common Time Ranges ([#239](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/239))
* Definition Details Modal & Delete Toast ([#258](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/258))
* Support creating report for saved objects with custom id ([#283](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/283))
* Add Search box to Report Source Selection ([#286](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/286))
* Support customized server config ([#313](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/313))


### Enhancements
* Headless chrome creation script and readme file ([#229](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/229))
* Remove logo for side bar menu ([#230](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/230))
* Using common-utils for Security plugin transient thread context key ([#234](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/234))
* Using Kotlin standard coding standard ([#235](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/235))
* Using chromium path relative to constant file ([#236](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/236))
* add double dots to relative url in fetch() ([#242](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/242))
* Optimize selectors for DOM operation to reduce possible version compatibility issue ([#244](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/244))
* Add flag to chromium to use single process ([#268](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/268))
* Add semaphore to block on puppeteer chromium execution ([#284](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/284))
* Update timeRangeMatcher to avoid create report failure ([#292](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/292))

### Bug Fixes
* Fix chromium path for puppeteer ([#232](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/232))
* Disable GPU on chromium ([#237](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/237))
* Fix the time range display issue(timezone) on visual report ([#240](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/240))
* Bug Fixes in UI ([#241](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/241))
* defaultItemsQueryCount setting moved to general group ([#246](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/246))
* Fix UUID Generation ([#263](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/263))
* Configure Max Size for Dashboards API & Minor UI Changes ([#266](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/266))
* Support csv report for saved search with multiple indices ([#267](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/267))
* Added error case handling for on-demand report generation ([#271](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/271))
* Fixed Edit Report Definition Trigger Type Pre-fill ([#280](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/280))
* Fix the selected fields issue in csv report ([#293](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/293))
* Fix reporting download button visibility issue for dashboard and visualization ([#294](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/294))
* Context menu popout & Report definitions toast fixes ([#295](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/295))
* Keep Reporting menu in Nav Menu when switching Index Patterns ([#299](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/299))

### Infrastructure
* Update workflow to build artifact for ARM64 ([#228](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/228))
* Fix release workflow artifact paths and s3 url ([#231](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/231))
* Update path and artifact names in release workflow ([#233](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/233))
* Add Download Cypress Tests ([#253](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/253))
* Added integration test for the sample on-demand report generation use-case ([#270](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/270))
* Add integration test cases for report definition rest APIs ([#272](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/272))
* Report Instance Integration Tests ([#274](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/274))
* List Multiple Report Definitions IT ([#276](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/276))
* Add frontend metrics for Kibana reports ([#277](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/277))
* Reporting backend metrics ([#282](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/282))
* Add overall frontend metrics for actions ([#287](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/287))
* Reporting backend metrics ([#288](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/288))
* Dump coverage for each IT ([#296](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/296))
* Change release workflows to use new staging bucket for artifacts ([#301](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/301))
* Re-add metric API ([#303](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/303))
* Fix Reporting CVEs ([#304](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/304))
* Rename kibana reports release artifacts in github workflow ([#305](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/305))
* Add reporting backend to Codecov ([#306](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/306))
* Rename deb and rpm packages for reports scheduler ([#307](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/307))

### Documentation
* Add docs link ([#247](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/247))
* Add codecov for kibana reports & Add README badges ([#248](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/248))
* Fix README badge ([#257](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/257))

### Maintenance
* Backport from branch opendistro-1.12.0.0 to 7.9.1 ([#245](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/245))
* Hide/remove report definition related UI ([#260](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/260))
* Reports Table Backport Changes ([#261](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/261))
* Backport commits from dev ([#269](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/269))
* Backport from dev branch ([#289](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/289))
* Change Reports Table Display ([#291](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/291))
* Backport bug fixes from dev ([#297](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/297))
* Backport Context Menu fix to 7.9.1 ([#300](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/300))
* Remove reporting plugin page from kibana nav ([#302](https://github.com/opendistro-for-elasticsearch/kibana-reports/pull/302))