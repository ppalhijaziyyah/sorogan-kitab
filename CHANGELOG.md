# Changelog

## [Unreleased] - 2026-02-17

### Added
- Feature: Import 'Reference' / 'Sumber' column from Excel 'Info' sheet.
- Feature: Debugged JSON import errors by implementing robust async loading in StudioPage.
- Feature: Optional `fileNumber` field in Studio for custom file naming (e.g., `1-1-rukun-islam.json`) without polluting JSON data.

### Changed
- Refactor: `fileNumber` is now excluded from the saved JSON payload. It only affects the generated filename.
- Refactor: Updated file naming convention to `[FileNumber?]-[LevelCode]-[TitleSlug].json` or `[LevelCode]-[TitleSlug].json`.
- Refactor: Updated routing to `/belajar/:levelId/:lessonSlug` (e.g., `/belajar/1/rukun-islam`) to support same title across different levels.
- Fix: Normalized level string input (e.g., "Ibtidai" -> "Ibtida’i") during Excel import to prevent Level 0 bugs.
- Fix: Addressed syntax error in `LearningPage.jsx`.
