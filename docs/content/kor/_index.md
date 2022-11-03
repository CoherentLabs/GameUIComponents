---
date: 2022-3-31
title: Components for Game User Interface
draft: false
---

<!--Copyright (c) Coherent Labs AD. All rights reserved. -->

<!--저작권 (c) Coherent Labs AD. 판권 소유. -->

이것은 [Gameface](https://coherent-labs.com/products/coherent-gameface/)를 위해 특별히 설계된 맞춤형 요소 모음입니다. 모든 구성 요소는 Google 크롬에서도 사용할 수 있습니다. 데모를 시작하여 미리 볼 수 있습니다. 루트 디렉토리를 제공하고 선택한 http 서버를 사용하여 demo.html 파일을 열 수 있습니다. 또는 패키지의 기본 설정을 사용합니다. 모든 구성 요소는 npm 레지스트리에서 사용할 수 있는 npm 패키지입니다. `npm i coherent-gameface-<component-name>`을 사용하여 설치하십시오. 소스에서 빌드할 수도 있습니다.

# 데모 실행

루트 디렉토리로 이동하여 다음을 실행합니다.

    npm 설치

이것은 웹팩 서버와 다른 모든 종속성을 설치합니다. 실행 후:

    npm 실행 빌드

이렇게 하면 모든 구성 요소가 빌드됩니다. 실행 후:

    npm 실행 시작:데모

이것은 http://localhost:8080에 있는 파일을 제공할 것입니다. Gameface 플레이어 또는 Chrome에서 해당 URL을 로드하고 구성 요소를 미리 봅니다. webpack.config.js 파일에서 포트를 변경할 수 있습니다.

# 샘플

샘플은 구성 요소를 사용하여 완전한 사용자 인터페이스를 만드는 방법에 대한 보다 복잡한 예입니다. 샘플/user_interface에 있습니다. 기본, 설정 및 상점의 세 페이지가 있습니다. 이들 중 하나를 실행하려면 폴더로 이동하여 `npm i`를 실행하여 종속성을 설치합니다. 그런 다음 Chrome에서 *.html 파일을 로드합니다. 각 페이지에는 다른 페이지 중 하나에 대한 링크가 있으며 거기에 종속성을 설치하지 않은 경우 예상대로 작동하지 않습니다. 이를 방지하려면 모든 폴더에서 `npm i`를 실행해야 합니다.

# 사용 가능한 명령

다음은 구성 요소를 빌드하고 패키지하는 데 사용되는 명령입니다.

|명령 |설명 |인수 |용도 |
|---|---|---|---|
|재구축 |모든 종속성을 새로 설치하고 모든 것을 빌드합니다. |N/A|`npm run 재빌드`|
|build |모든 구성 요소를 빌드 - 데모, umd 및 cjs 번들을 만듭니다. |[--no-install -ni][--no-install], [--library][--library] |`npm run build -- --no-install --library`|
|build:demo |모든 구성 요소의 데모만 빌드합니다. |N/A|`npm run build:demo`|
|build:library |컴포넌트 라이브러리만 빌드합니다. |N/A|`npm run build:library`|
|build:dev |로컬 패키지만 사용하여 구성 요소를 빌드합니다. npm 레지스트리가 아닌 소스에서만 종속성을 설치합니다. |N/A|`npm run build:dev`|
|build:documentation |구성 요소, 데모 및 문서를 빌드합니다. |[--rebuild][--rebuild], [--component][--component]|`npm run build:documentation -- --component 체크박스`, `npm run build:documentation -- --rebuild`|
|check:copyright |*components* 폴더 안의 파일에 저작권 표시가 있는지 확인합니다. |N/A|`npm 실행 확인:저작권`|
|add:copyright |*components* 폴더 안의 파일 중 누락된 저작권 표시를 추가합니다. |N/A|`npm run add:copyright`|
|start:demo |데모 프로젝트를 제공합니다. |N/A|`npm 실행 시작:데모`|
|테스트 |localhost에서 Karma 서버 시작:`<port>`/debug.html |N/A|`npm run test`|
|test:Chrome |Karma 서버를 시작하고 Google Chrome에서 테스트를 실행합니다. |해당 사항 없음|`npm 실행 테스트:Chrome`|
|pack |게시할 준비가 된 npm 패키지에 구성 요소를 번들로 묶습니다. |N/A|`npm 실행 팩`|
|pack:library |컴포넌트 라이브러리의 npm 패키지를 생성합니다. |해당 사항 없음|`npm 실행 팩:라이브러리`|
|링크 |로컬 패키지로만 테스트할 모든 구성 요소에 대한 링크를 만듭니다[^1]. |N/A|`npm 실행 링크`|
|unlink |구성요소에 대해 존재하는 모든 글로벌 링크를 제거하십시오. 로컬 패키지를 제거하려면 `npm run clean`을 사용하세요.|N/A|`npm run link`|
|clean |모든 기존 번들, 패키지 및 설치된 종속성을 제거합니다. |N/A|`npm run clean`|

[^1]: 구성 요소는 npm 레지스트리의 패키지가 아닌 소스에서 만든 로컬 패키지를 사용하지 않습니다. 핵심 라이브러리 또는 기존 구성 요소를 변경하고 변경 사항을 테스트하려는 경우에 유용합니다. 링크를 사용할 때 **--no-install** 옵션으로 빌드해야 합니다. 그렇지 않으면 빌드가 링크를 덮어쓰는 `npm install`을 수행합니다.

[--no-install]: ## "npm 설치 단계 건너뛰기"
[--library]: ## "구성 요소 라이브러리만 빌드합니다."
[--rootDir]: ## "재귀적 npm 설치를 수행할 폴더"
[--component]: ## "문서를 빌드하려는 구성 요소의 폴더 이름"
[--rebuild]: ## "모든 구성 요소를 다시 빌드합니다"

`npm run tests`를 성공적으로 실행한 후 "--url=http://localhost:9876/debug.html"을 사용하여 Gameface 플레이어 또는 Chrome을 열어 실행 중인 테스트를 확인합니다.


# 소우에서 건물