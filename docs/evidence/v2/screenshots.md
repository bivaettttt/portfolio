# Проверка Portfolio 2.0 · реальные кадры

Chromium, production-сборка. Все файлы — снимки работающего сайта. MCP-кадры отмечены `mcp` в имени; остальные сделаны Playwright напрямую. DPR 1 для итоговых CSS-снимков; матрица медиа включает мобильный DPR 2. Тёмные и английские состояния также проверены.

## Сопоставление на одинаковой ширине

| Состояние | До | После |
| --- | --- | --- |
| Главная, 1440×1000 | [до](before/home-1440.png) | [после](home-after-1440.png) |
| Главная, 390×844 | [до, DPR 2](before/home-390.png) | [после, CSS](home-after-390.png) |
| Папки, 1440×1000 | [до](before/projects-1440.png) | [после](projects-after-1440.png) |
| Traceon, 390×844 | [до, DPR 2](before/projects-personal-traceon-390.png) | [после, CSS](projects-personal-traceon-after-390.png) |
| Профиль, 1440×1000 | [до](before/profile-1440.png) | [после](profile-after-1440.png) |

Ширины в таблице — CSS px; мобильные до/после могут иметь разный размер файла в физических пикселях. Исходная браузерная матрица сохранена в [media-before.json](media-before.json), итоговая — [media-after.json](media-after.json). `pass1/` сохраняет ранний проход для сопоставления исправлений; финальные файлы ниже.

## Итоговые кадры

- [bks-processes-showcase-1440](bks-processes-showcase-1440.png)
- [contact-after-1440](contact-after-1440.png)
- [flowent-showcase-1440](flowent-showcase-1440.png)
- [gallery-fit-1440](gallery-fit-1440.png)
- [gallery-mobile-390](gallery-mobile-390.png)
- [gallery-native-1440](gallery-native-1440.png)
- [home-after-1440](home-after-1440.png)
- [home-after-390](home-after-390.png)
- [merch-showcase-1440](merch-showcase-1440.png)
- [nexora-mcp-1440](nexora-mcp-1440.png)
- [nexora-native-mcp-1440](nexora-native-mcp-1440.png)
- [nexora-showcase-1440](nexora-showcase-1440.png)
- [profile-after-1440](profile-after-1440.png)
- [projects-academic-after-1440](projects-academic-after-1440.png)
- [projects-after-1440](projects-after-1440.png)
- [projects-after-390](projects-after-390.png)
- [projects-personal-after-1440](projects-personal-after-1440.png)
- [projects-personal-traceon-after-390](projects-personal-traceon-after-390.png)
- [projects-practice-after-1440](projects-practice-after-1440.png)
- [projects-practice-merch-after-390](projects-practice-merch-after-390.png)
- [traceon-showcase-1440](traceon-showcase-1440.png)

## Подлинность

[Новый захват Wayline](wayline-capture.json): 1500×950 CSS px, DPR 2, исходный PNG 3000×1900. Выполнен после загрузки реестра, на отдельном Compose-проекте; исходный Wayline working tree остался чистым.

[Исходные учебные материалы](academic-sources.json) содержат пути к проверенным локальным источникам и характеристики оригиналов. Три реконструкции из отчёта не выдаются за скриншоты.
