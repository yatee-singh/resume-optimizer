from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database import get_db
from app.schema.optimizer import OptimizeRequest
from app.services.resume_pipeline import resume_pipeline

router = APIRouter(
    prefix="/optimizer",
    tags=["optimizer"],
)


@router.post("/optimize")
async def optimize_resume(
    request: OptimizeRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    if not request.job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty.",
        )

    try:
        result = await resume_pipeline.run(
            db=db,
            user=user,
            job_description=request.job_description,
        )

        return result

    except ValueError as exc:
        print("VALUE ERROR:", exc)
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        print("=" * 80)
        print("OPTIMIZER ERROR")
        print("=" * 80)
        print(type(exc).__name__)
        print(str(exc))
        print("=" * 80)

        # TEMPORARY: let FastAPI show the actual traceback
        raise