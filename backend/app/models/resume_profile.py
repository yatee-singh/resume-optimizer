import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ResumeProfile(Base):
    __tablename__ = "resume_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    headline: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
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

    user: Mapped["User"] = relationship(
        back_populates="resume_profile",
    )

    skills: Mapped[list["Skill"]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
    )

    experiences: Mapped[list["Experience"]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
    )

    projects: Mapped[list["Project"]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
    )

    achievements: Mapped[list["Achievement"]] = relationship(
        back_populates="profile",
        cascade="all, delete-orphan",
    )