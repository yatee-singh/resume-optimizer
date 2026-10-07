import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class OptimizedResume(Base):
    __tablename__ = "optimized_resumes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    job_title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    ats_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    job_description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    resume_json: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
    )