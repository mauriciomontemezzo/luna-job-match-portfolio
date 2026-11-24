# LUNA Job Match — Technical Case Study

## Full-Stack Development and Workflow Automation

**Project type:** Experimental web application

**Status:** Functional local prototype

**Technologies:** Next.js, React, TypeScript,
Tailwind CSS, n8n, ExcelJS and REST-style APIs

## 1. The Challenge

Job seekers often need to compare their
professional backgrounds with multiple
job opportunities.

Traditional keyword searches do not always
explain why a vacancy was recommended,
what information is missing, or which
requirements still need human verification.

The project explores a structured,
explainable approach to this workflow.

## 2. The Solution

LUNA Job Match is a web application that
supports the following process:

1. Submit a PDF resume.
2. Review extracted professional information.
3. Configure job-search preferences.
4. Retrieve real job opportunities.
5. Review matching scores and diagnostics.
6. Examine warnings and unresolved conditions.
7. Select relevant opportunities.
8. Export selected jobs to an XLSX file.

The project does not predict hiring outcomes.

## 3. System Architecture

The application uses Next.js Route Handlers
to coordinate the frontend with external
automation workflows and export operations.

The interface is implemented with React
and TypeScript.

Assessment logic is separated into
independently testable TypeScript modules.

External n8n workflows support integrations
such as resume analysis and job discovery.

ExcelJS is used for spreadsheet generation.

See [Architecture](ARCHITECTURE.md)
for a more detailed technical overview.

## 4. Core Engineering Challenges

### 4.1 Integrating Resume Uploads

Challenge:

Receive PDF resumes while preventing
obviously invalid uploads from reaching
the rest of the workflow.

Approach:

- Validate the expected multipart field
- Inspect the reported MIME type
- Reject empty and oversized files
- Check the PDF signature
- Return appropriate HTTP status codes

Local tests confirmed rejection behavior
for seven documented scenarios.

These tests do not establish complete
PDF security or resistance to all
resource-exhaustion attacks.

### 4.2 Connecting External Workflows

Challenge:

Coordinate a web interface with external
automation services.

Approach:

- Use server-side API routes
- Apply input validation
- Handle unsuccessful external responses
- Include timeouts in relevant integrations
- Separate local configuration from source code

Some workflow contracts still require
additional documentation.

### 4.3 Building Explainable Matching Logic

Challenge:

Avoid presenting a single score as
proof that a candidate qualifies
for a job.

Approach:

- Separate classification and diagnostics
- Display reasons and supporting indicators
- Identify missing information
- Flag geographic and seniority concerns
- Avoid automatically confirming eligibility

Experimental modules V3 through V6
provide additional explanations.

They do not automatically override
established scoring, prioritization
or ordering behavior.

### 4.4 Preserving Functional Versions

Challenge:

Introduce new matching functionality
without disrupting the working application.

Approach:

- Make narrowly scoped changes
- Use Git checkpoints
- Maintain regression tests
- Validate TypeScript and ESLint
- Test relevant features in the browser
- Keep experimental functionality isolated

This approach supported incremental
development across multiple iterations.

### 4.5 Preparing a Production Build

Challenge:

Validate compilation separately from
local development behavior.

Approach:

- Run the Next.js production build
- Check TypeScript compilation
- Confirm generated build artifacts
- Test production route restrictions
  through a temporary localhost server

The build completed successfully.

Seven restricted API endpoints returned
HTTP 404 in the reported production-mode
tests.

The application is not yet operational
as a public production service.

## 5. Testing Evidence

Reported validation results include:

| Validation | Reported result |
|---|---|
| TypeScript | Passed |
| ESLint | Passed |
| Module regression | 49/49 test files |
| Next.js production build | Passed |
| Resume upload rejection | 7/7 scenarios |
| Production route restrictions | 7/7 endpoints |

These results are scoped to the
development environment and specific
tests performed.

They are not a guarantee of
production security or reliability.

See [Security Validation](SECURITY_VALIDATION.md)
for the documented test scenarios.

## 6. Key Technical Decisions

### Modular Assessment Logic

Separate modules make it easier
to test professional matching logic
without changing the UI or API layer.

### Experimental Feature Isolation

New diagnostic versions were introduced
without automatically affecting
existing ranking decisions.

### Conservative Eligibility Language

The system avoids representing
career indicators or geographic
mentions as definitive eligibility.

### Local-First Development

The application was validated locally
before considering broader deployment.

### Incremental Version Control

Git checkpoints preserve working
milestones and support safer iteration.

## 7. Current Limitations

- No completed public deployment
- No production-ready user authentication
- No complete multi-user data isolation
- External n8n configuration is required
- Core APIs are restricted outside
  development mode
- Job availability depends on
  external data providers
- Matching logic is experimental
- Privacy and retention policies
  require further work
- End-to-end testing remains incomplete
- Installation reproducibility
  needs improvement

## 8. Future Improvements

Planned engineering directions include:

1. Standardize test execution.
2. Document external API contracts.
3. Improve integration testing.
4. Add safe demonstration assets.
5. Review authentication and authorization.
6. Establish data privacy controls.
7. Design a production deployment strategy.
8. Explore multi-user support.

## 9. Engineering Skills Demonstrated

This project provides concrete examples of:

- React and Next.js development
- TypeScript application logic
- Server-side API integration
- Workflow automation with n8n
- Input validation
- HTTP error handling
- Modular business logic
- Spreadsheet generation
- Regression testing
- Git-based incremental development
- Technical documentation
- Security-conscious engineering decisions

## 10. Portfolio Positioning

LUNA Job Match is best presented as
a functional experimental prototype
with documented engineering decisions,
local validation and known limitations.

It demonstrates practical experience
with full-stack application development,
workflow automation and system integration.

It should not be described as a
production-ready recruitment platform,
a validated hiring prediction system,
or a commercially deployed SaaS product.
