# Public Portfolio Release — Validation Report

## 1. Purpose

This report documents the validation performed on an
isolated copy of LUNA Job Match prepared for a potential
public source-code portfolio release.

The original development repository and its Git history
remain private and unchanged.

This report does not certify the application as secure
or ready for public production deployment.

## 2. Release Scope

The review copy was created from the private development
checkpoint `27fb02f`.

- 134 tracked source files were copied.
- One historical backup file was excluded.
- The original Git history was not copied.
- No local environment files were included.
- The isolated review copy has no Git repository.

The public portfolio repository has not yet been created.

## 3. Build and Static Validation

Environment observed during testing:

- Node.js: 24.22.3
- npm: 11.19.1
- Next.js: 16.4.6
- Test server port: 3100

Validation results:

| Check | Result |
|---|---|
| Dependency installation | Passed |
| Next.js type generation | Passed |
| TypeScript validation | Passed |
| ESLint validation | Passed |
| Production build | Passed |
| Independent build artifacts | Generated |

The production build compiled successfully and generated
the application routes.

## 4. Production API Restrictions

Seven experimental API endpoints were tested using
HTTP POST requests while running the production build.

| Endpoint | Observed HTTP status |
|---|---|
| /api/analisar-curriculo | 404 |
| /api/buscar-vagas | 404 |
| /api/buscar-vagas-v2 | 404 |
| /api/exportar-vagas | 404 |
| /api/simular-vagas | 404 |
| /api/testar-n8n | 404 |
| /api/testar-pdf-n8n | 404 |

Result: 7 of 7 tested endpoints returned HTTP 404.

Static review also identified environment-based guards
and confirmed that the searched `fetch` calls occur after
the environment checks.

These observations do not establish that all possible
requests or internal execution paths are safe.

## 5. Resume Upload Validation

The `/api/curriculo` endpoint was tested with five
invalid inputs.

| Test | Observed HTTP status |
|---|---|
| Missing uploaded file | 400 |
| Plain-text file | 400 |
| JSON supplied instead of a PDF | 400 |
| Empty PDF | 400 |
| File exceeding 10 MB | 400 |

Result: 5 of 5 invalid inputs were rejected.

These tests do not constitute a comprehensive assessment
of PDF parsing security or resource exhaustion.

## 6. Health Endpoint

The application page `/analisar` returned HTTP 200.

The `/api/health` endpoint returned HTTP 503 with
a JSON response containing `ok: false`.

The isolated review environment did not contain the
external n8n configuration.

The unavailable integration is a plausible explanation
for the observed response, but the precise cause was
not independently established.

## 7. Security Review Boundaries

The following checks were performed during preparation:

- Basic credential-pattern scanning.
- Historical credential-pattern scanning in the
  original private repository.
- Review of tracked filenames and backup candidates.
- PNG metadata cleanup for portfolio screenshots.
- Static inspection of API protection indicators.
- Controlled production HTTP response tests.

These checks do not replace a professional security
assessment.

Potential gaps include:

- Authentication and authorization for multi-user use.
- Rate limiting and abuse prevention.
- Dependency vulnerability management.
- Secure PDF processing and resource controls.
- Data privacy and retention controls.
- Comprehensive secret scanning.
- Monitoring and production deployment hardening.

## 8. Portfolio Release Position

LUNA Job Match is presented as a local experimental
software engineering prototype.

Its matching indicators are explanatory and
experimental. Scores are not hiring probabilities.

A public source-code repository does not imply
that the application is publicly hosted or suitable
for processing real candidate information online.

Production deployment requires additional security,
privacy, infrastructure, and integration work.

## 9. Conclusion

The isolated portfolio copy passed the documented
build, type-checking, linting, production endpoint,
and invalid-upload tests.

The production health endpoint returned HTTP 503
without the external integration configuration.

The codebase is a candidate for a public portfolio
repository after final content and privacy review.
It is not approved for public production deployment.
