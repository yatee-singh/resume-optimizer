import uuid
from datetime import date, datetime
from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String,  func,  Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resume_profiles.id", ondelete="CASCADE"),
        nullable=False,
    )

    company: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
)

    start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    embedding: Mapped[list[float] | None] = mapped_column(
    Vector(384),
    nullable=True
)

    is_current: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    profile: Mapped["ResumeProfile"] = relationship(
        back_populates="experiences",
    )