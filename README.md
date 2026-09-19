# resume-optimizer

## Architecture

                         ┌──────────────────────┐
                         │       USER           │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │    React Frontend     │
                         │                       │
                         │  Achievement Bank     │
                         │  Job Description      │
                         │  Generated Resume     │
                         └──────────┬────────────┘
                                    │
                              REST / SSE
                                    │
                         ┌──────────▼───────────┐
                         │      FastAPI          │
                         │                       │
                         │ Resume APIs           │
                         │ Achievement APIs      │
                         │ Job APIs               │
                         │ Optimization APIs      │
                         └──────────┬────────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
           PostgreSQL           Qdrant              LLM
           Structured DB       Vector Store        AI Layer
