---
date: 2022-3-25
title: Accordion menu
draft: false
---

<!--저작권 (c) Coherent Labs AD. 판권 소유. MIT 라이선스에 따라 라이선스가 부여되었습니다. 라이선스 정보는 프로젝트 루트의 License.txt를 참조하세요. -->

아코디언 메뉴는 Gameface 사용자 정의 구성 요소 제품군의 일부입니다. 이 제품군의 대부분의 구성 요소는 슬롯을 사용하여 동적 콘텐츠를 허용합니다.


용법
====================
아코디언 메뉴 구성 요소는 UMD 및 CJS 빌드와 함께 제공됩니다.

# 설치
`npm i coherent-gameface-accordion-menu`


## UMD 모듈과 함께 사용:

* 구성 요소 라이브러리 가져오기:

~~~~{.html}
<script src="./node_modules/coherent-gameface-components/umd/components.production.min.js"></script>
~~~~

* 아코디언 메뉴 구성 요소 가져오기:

~~~~{.html}
<스크립트 src="./node_modules/coherent-gameface-accordion-menu/umd/accordion-menu.production.min.js"></script>
~~~~

* gameface-accordion-panel, gameface-accordion-header 및 gameface-accordion-content와 함께 gameface-accordion-menu 구성 요소를 html에 추가합니다.

~~~~{.html}
<gameface-accordion-menu></gameface-accordion-menu>
~~~~

이게 전부입니다! 아코디언 메뉴를 보려면 Gameface에서 파일을 로드하십시오.

JavaScript를 사용하여 모듈을 가져오려면 스크립트 태그를 제거할 수 있습니다.
node_modules 폴더에서 구성 요소와 accordion-menu를 가져오고 다음과 같이 가져옵니다.

~~~~{.js}
'coherent-gameface-components'에서 구성 요소를 가져옵니다.
'coherent-gameface-accordion-menu'에서 accordionMenu 가져오기;
~~~~

이 접근 방식을 사용하려면 [Webpack](https://webpack.js.org/) 또는 [Rollup](https://rollupjs.org/guide/en/)과 같은 모듈 번들러가 필요합니다.
node_modules 폴더의 모듈. 또는 node_modules에서 직접 가져올 수 있습니다.

~~~~{.js}
'./node_modules/coherent-gameface-components/umd/components.production.min.js'에서 구성 요소를 가져옵니다.
'./node_modules/coherent-gameface-accordion-menu/umd/accordion-menu.production.min.js'에서 accordionMenu 가져오기;
~~~~

## CJS 모듈과 함께 사용:

* 구성 요소 라이브러리 가져오기:

~~~~{.js}
const 구성 요소 = require('coherent-gameface-components');
const accordionMenu = require('일관된 게임페이스-아코디언-메뉴');
~~~~

CommonJS(CJS) 모듈은 NodeJS 환경에서 사용하므로 반드시 모듈을 사용하십시오.
브라우저에서 사용하기 위해 번들러.


## 스타일 추가

~~~~{.html}
<link rel="stylesheet" href="coherent-gameface-components-theme.css">
<link rel="stylesheet" href="style.css">
~~~~
기본 스타일을 덮어쓰려면 변경하려는 클래스 이름에 대한 새 규칙을 만들고 기본 스타일 뒤에 포함하기만 하면 됩니다.

Gameface에서 HTML 파일을 로드하면 아코디언 메뉴가 표시됩니다.


## 사용하는 방법


accordion-menu 구성 요소를 사용하려면 HTML에 다음 요소를 추가하십시오.
~~~~{.html}
<gameface-accordion-menu></gmeface-accordion-menu>
~~~~

클릭 시 확장되는 패널을 추가하려면 gameface-accordion-panel을 추가해야 합니다.

~~~~{.html}
<게임페이스-아코디언-메뉴>
    <gameface-accordion-panel slot="accordion-panel">
        <gameface-accordion-header>긴 텍스트</gameface-accordion-header>
        <게임페이스-아코디언-컨텐츠>
            Lorem ipsum, dolor sitmet consectetur adipiscing elit. 아이우스, 인! At nesciunt earum ea deserunt architectureto animi quod
            neque dicta asperiores. culpa quisquam temporibus aliquam의 오류 aliquid facilis hic.
        </gameface-accordion-content>
    </gameface-accordion-panel>
</gameface-accordion-menu>
~~~~

 아코디언 메뉴의 각 패널에 대해 gameface-accordion-panel을 추가할 수 있습니다. 제대로 표시하려면 gameface-accordion-header 및 gameface-accordion-content 구성 요소를 포함해야 합니다. gameface-accordion-header는 항상 표시되는 패널의 일부이며 gameface-accordion-content는 숨겨져 확장됩니다.

다음 속성을 사용하여 accordion-menu를 사용자 정의할 수 있습니다.

|속성 |유형 |기본값 | 설명 |
|---|---|---|---|
|여러 | 부울 |거짓 | 한 번에 여러 패널을 확장할 수 있는 경우 |

gameface-accordion-panel에 다음 속성을 추가할 수도 있습니다.

|속성 |유형 |기본값 | 설명 |
|---|---|---|---|
|장애인 | 부울 |거짓 | 패널이 비활성화된 경우. 비활성화된 패널을 확장하거나 축소할 수 없습니다. |
|확장된 | 부울 |거짓 | 로드 시 패널이 확장되는 경우 |
---
naljja: 2022-3-25
jemog: akodieon menyu