# Аудит качества медиа

База — `ed6cf917c6df07d33d012d85027f1a764cbd413d`. Astro выдавал готовые WebP из public. Преобразования выполнялись перед сборкой. Галерея брала тот же WebP, что презентация, и задавала ему 100% ширины даже для небольших файлов. Презентация выбирала из 640 и 1440 px, а карточка фиксировала 640 px. Высокие кадры дополнительно ограничивались CSS-высотой 680 px. На DPR 2 это особенно заметно в таблицах и подписях.

В новой версии 29 PNG берутся побайтно из закреплённых коммитов девяти открытых проектов. Один кадр Wayline переснят в 3000×1900 после обнаружения загрузочного состояния в исходнике. Для статьи — варианты WebP 640, 960, 1280 и до 1600 px, если ширина доступна в исходнике. Для увеличения — локальный PNG, размеры и контрольная сумма которого записаны в метаданных. На изображение 1:1 приходится один физический пиксель экрана на пиксель исходного кадра. Исходники не увеличивались искусственно. При достаточно подробном и корректном исходном PNG повторная съёмка не требуется. Выявленный неготовый кадр Wayline заменён реальным захватом после загрузки двух поездок.

Фактические замеры браузера до правок сохранены в [JSON](evidence/v2/media-before.json). Они включают выбранный URL, размеры CSS, DPR, srcset, sizes и байты из Resource Timing. В таблице ниже размеры webp — размер на диске.

| Кадр и источник | PNG, пиксели и байты | Прежний WebP | Новый WebP |
| --- | ---: | ---: | ---: |
| [credence · details](https://github.com/bivaettttt/credence/blob/b8dc127da708225191f0f0450ec69a49cb605dff/assets/screenshots/details.png) | 1440 × 950 · 94486 | 1440 px · 40196 | 1440 px · 33874 |
| [credence · risk](https://github.com/bivaettttt/credence/blob/b8dc127da708225191f0f0450ec69a49cb605dff/assets/screenshots/risk.png) | 1440 × 950 · 78606 | 1440 px · 32500 | 1440 px · 28854 |
| [credence · offer](https://github.com/bivaettttt/credence/blob/b8dc127da708225191f0f0450ec69a49cb605dff/assets/screenshots/offer.png) | 1440 × 950 · 96318 | 1440 px · 41190 | 1440 px · 33840 |
| [flowent · expense-editor](https://github.com/bivaettttt/flowent/blob/ee5d419aada38fce45343f04850882ebeee12d17/assets/screenshots/expense-editor.png) | 1600 × 900 · 139384 | 1440 px · 42226 | 1600 px · 54620 |
| [flowent · runtime-viewer](https://github.com/bivaettttt/flowent/blob/ee5d419aada38fce45343f04850882ebeee12d17/assets/screenshots/runtime-viewer.png) | 1440 × 1060 · 174400 | 1440 px · 67428 | 1440 px · 72392 |
| [flowent · incident-details](https://github.com/bivaettttt/flowent/blob/ee5d419aada38fce45343f04850882ebeee12d17/assets/screenshots/incident-details.png) | 1440 × 950 · 134568 | 1440 px · 54094 | 1440 px · 47468 |
| [flowent · recovery-history](https://github.com/bivaettttt/flowent/blob/ee5d419aada38fce45343f04850882ebeee12d17/assets/screenshots/recovery-history.png) | 1440 × 1040 · 160632 | 1440 px · 67220 | 1440 px · 53136 |
| [nexora · workbench](https://github.com/bivaettttt/nexora/blob/e028f4be74e077017cae596a5d046c8a3d577a9f/assets/screenshots/workbench.png) | 1440 × 1000 · 113501 | 1440 px · 65850 | 1440 px · 58284 |
| [nexora · partial-delivery](https://github.com/bivaettttt/nexora/blob/e028f4be74e077017cae596a5d046c8a3d577a9f/assets/screenshots/partial-delivery.png) | 1440 × 1000 · 123539 | 1440 px · 75422 | 1440 px · 63886 |
| [nexora · error-inspector](https://github.com/bivaettttt/nexora/blob/e028f4be74e077017cae596a5d046c8a3d577a9f/assets/screenshots/error-inspector.png) | 1440 × 1725 · 183846 | 1440 px · 105972 | 1440 px · 77584 |
| [nexora · reconciliation](https://github.com/bivaettttt/nexora/blob/e028f4be74e077017cae596a5d046c8a3d577a9f/assets/screenshots/reconciliation.png) | 1440 × 1000 · 62649 | 1440 px · 33274 | 1440 px · 33032 |
| [quantara · dashboard](https://github.com/bivaettttt/quantara/blob/d4142f4cb3fc87a630e230fe7c60c2eda084363e/assets/screenshots/dashboard.png) | 1500 × 950 · 140805 | 1440 px · 54494 | 1500 px · 51064 |
| [quantara · lineage](https://github.com/bivaettttt/quantara/blob/d4142f4cb3fc87a630e230fe7c60c2eda084363e/assets/screenshots/lineage.png) | 1500 × 950 · 153821 | 1440 px · 45446 | 1500 px · 40232 |
| [quantara · comparison](https://github.com/bivaettttt/quantara/blob/d4142f4cb3fc87a630e230fe7c60c2eda084363e/assets/screenshots/comparison.png) | 1500 × 950 · 149201 | 1440 px · 52816 | 1500 px · 43582 |
| [sentrix · alerts](https://github.com/bivaettttt/sentrix/blob/7addc9671ebd287f1d5633b174da038af90471d2/assets/screenshots/alerts.png) | 1500 × 950 · 179833 | 1440 px · 58438 | 1500 px · 40830 |
| [sentrix · investigation](https://github.com/bivaettttt/sentrix/blob/7addc9671ebd287f1d5633b174da038af90471d2/assets/screenshots/investigation.png) | 1500 × 950 · 129088 | 1440 px · 43188 | 1500 px · 42710 |
| [sentrix · review](https://github.com/bivaettttt/sentrix/blob/7addc9671ebd287f1d5633b174da038af90471d2/assets/screenshots/review.png) | 1500 × 950 · 118305 | 1440 px · 41304 | 1500 px · 38698 |
| [traceon · requirement](https://github.com/bivaettttt/traceon/blob/6cc6505b0c9a2c28a6b2b6ef15332be7962f19a0/assets/screenshots/requirement.png) | 1440 × 1000 · 136684 | 1440 px · 55146 | 1440 px · 49762 |
| [traceon · impact](https://github.com/bivaettttt/traceon/blob/6cc6505b0c9a2c28a6b2b6ef15332be7962f19a0/assets/screenshots/impact.png) | 1440 × 2234 · 343806 | 1440 px · 119640 | 1440 px · 107070 |
| [traceon · review](https://github.com/bivaettttt/traceon/blob/6cc6505b0c9a2c28a6b2b6ef15332be7962f19a0/assets/screenshots/review.png) | 1440 × 1658 · 188424 | 1440 px · 73986 | 1440 px · 67378 |
| [traceon · baseline](https://github.com/bivaettttt/traceon/blob/6cc6505b0c9a2c28a6b2b6ef15332be7962f19a0/assets/screenshots/baseline.png) | 1440 × 1000 · 135947 | 1440 px · 54504 | 1440 px · 50126 |
| [vaultix · accounts](https://github.com/bivaettttt/vaultix/blob/9d1971294ca9f96e2f6fb820691863df6f57050d/assets/screenshots/accounts.png) | 1440 × 1000 · 119749 | 1440 px · 42974 | 1440 px · 42312 |
| [vaultix · journal](https://github.com/bivaettttt/vaultix/blob/9d1971294ca9f96e2f6fb820691863df6f57050d/assets/screenshots/journal.png) | 1440 × 1000 · 67383 | 1440 px · 24196 | 1440 px · 24452 |
| [vaultix · lab](https://github.com/bivaettttt/vaultix/blob/9d1971294ca9f96e2f6fb820691863df6f57050d/assets/screenshots/lab.png) | 1440 × 1809 · 213313 | 1440 px · 78884 | 1440 px · 68930 |
| [veridion · research-desk](https://github.com/bivaettttt/veridion/blob/9bea917d073cb62108f88a9b2c9eb29236618d6d/assets/screenshots/research-desk.png) | 1440 × 1000 · 177961 | 1440 px · 66544 | 1440 px · 70898 |
| [veridion · citation-inspector](https://github.com/bivaettttt/veridion/blob/9bea917d073cb62108f88a9b2c9eb29236618d6d/assets/screenshots/citation-inspector.png) | 1440 × 1000 · 181361 | 1440 px · 67668 | 1440 px · 72520 |
| [veridion · human-review](https://github.com/bivaettttt/veridion/blob/9bea917d073cb62108f88a9b2c9eb29236618d6d/assets/screenshots/human-review.png) | 1440 × 1000 · 173801 | 1440 px · 67238 | 1440 px · 66354 |
| [wayline · trips](https://github.com/bivaettttt/wayline/blob/6b29602c23335fb7b18d5f62782827fae1102521/assets/screenshots/trips.png) | 1500 × 950 · 47946 | 1440 px · 16888 | 1500 px · 19024 |
| [wayline · disruption-details](https://github.com/bivaettttt/wayline/blob/6b29602c23335fb7b18d5f62782827fae1102521/assets/screenshots/disruption-details.png) | 1500 × 950 · 118786 | 1440 px · 41362 | 1500 px · 43488 |
| [wayline · alternatives](https://github.com/bivaettttt/wayline/blob/6b29602c23335fb7b18d5f62782827fae1102521/assets/screenshots/alternatives.png) | 1500 × 950 · 134146 | 1440 px · 50580 | 1500 px · 43370 |

Дополнение финальной проверки: кадр Wayline trips из таблицы заменён новым PNG 3000×1900 (viewport 1500×950, DPR 2), presentation WebP 1600×1013. Точные байты и SHA записаны в JSON кейса; [протокол пересъёмки](evidence/v2/wayline-capture.json). Таблица сохраняет первичный аудит исходников. Галерея читает локальный PNG; новый кадр не выдаётся за файл из старого коммита Wayline.
