from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, Boolean, JSON, Text, Float
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
import enum
from .db import Base

class ChannelEnum(str, enum.Enum):
    voice = "voice"
    chat = "chat"

class AIOrHumanEnum(str, enum.Enum):
    AI = "AI"
    Human = "Human"

class CallDirectionEnum(str, enum.Enum):
    inbound = "inbound"
    outbound = "outbound"

class CallStatusEnum(str, enum.Enum):
    connected = "connected"
    no_answer = "no_answer"
    abandoned = "abandoned"

class CallOutcomeEnum(str, enum.Enum):
    qualified = "qualified"
    booked = "booked"
    ticket = "ticket"
    info = "info"

class TicketPriorityEnum(str, enum.Enum):
    low = "low"
    med = "med"
    high = "high"
    urgent = "urgent"

class TicketStatusEnum(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    pending_approval = "pending_approval"
    resolved = "resolved"

class BookingStatusEnum(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    canceled = "canceled"
    completed = "completed"

class CampaignTypeEnum(str, enum.Enum):
    voice = "voice"
    chat = "chat"

class CampaignObjectiveEnum(str, enum.Enum):
    bookings = "bookings"
    renewals = "renewals"
    leadgen = "leadgen"
    upsell = "upsell"

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String)
    phone: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str | None] = mapped_column(String, nullable=True)
    language: Mapped[str | None] = mapped_column(String, nullable=True)
    budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    bedrooms_pref: Mapped[int | None] = mapped_column(Integer, nullable=True)
    neighborhoods: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    tags: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    consent: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True)
    channel: Mapped[ChannelEnum] = mapped_column(Enum(ChannelEnum))
    customer_id: Mapped[str] = mapped_column(String, ForeignKey("customers.id"))
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    sentiment: Mapped[str | None] = mapped_column(String, nullable=True)
    ai_or_human: Mapped[AIOrHumanEnum] = mapped_column(Enum(AIOrHumanEnum), default=AIOrHumanEnum.AI)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    recording_url: Mapped[str | None] = mapped_column(String, nullable=True)
    retention_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    conversation_id: Mapped[str] = mapped_column(String, ForeignKey("conversations.id"), index=True)
    role: Mapped[str] = mapped_column(String)  # user|agent
    text: Mapped[str] = mapped_column(Text)
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Call(Base):
    __tablename__ = "calls"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    conversation_id: Mapped[str] = mapped_column(String, ForeignKey("conversations.id"), index=True)
    direction: Mapped[CallDirectionEnum] = mapped_column(Enum(CallDirectionEnum))
    status: Mapped[CallStatusEnum] = mapped_column(Enum(CallStatusEnum))
    handle_sec: Mapped[int | None] = mapped_column(Integer, nullable=True)
    outcome: Mapped[CallOutcomeEnum | None] = mapped_column(Enum(CallOutcomeEnum), nullable=True)
    ai_or_human: Mapped[AIOrHumanEnum] = mapped_column(Enum(AIOrHumanEnum), default=AIOrHumanEnum.AI)
    recording_url: Mapped[str | None] = mapped_column(String, nullable=True)
    retention_expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

class Ticket(Base):
    __tablename__ = "tickets"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[str] = mapped_column(String, ForeignKey("customers.id"))
    priority: Mapped[TicketPriorityEnum] = mapped_column(Enum(TicketPriorityEnum))
    category: Mapped[str] = mapped_column(String)
    status: Mapped[TicketStatusEnum] = mapped_column(Enum(TicketStatusEnum), default=TicketStatusEnum.open)
    assignee: Mapped[str | None] = mapped_column(String, nullable=True)
    sla_due_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    resolution_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_by: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[str] = mapped_column(String, ForeignKey("customers.id"))
    property_code: Mapped[str] = mapped_column(String)
    start_date: Mapped[datetime] = mapped_column(DateTime)
    status: Mapped[BookingStatusEnum] = mapped_column(Enum(BookingStatusEnum), default=BookingStatusEnum.pending)
    price_sar: Mapped[float | None] = mapped_column(Float, nullable=True)
    source: Mapped[ChannelEnum] = mapped_column(Enum(ChannelEnum))
    created_by: Mapped[AIOrHumanEnum] = mapped_column(Enum(AIOrHumanEnum))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Campaign(Base):
    __tablename__ = "campaigns"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[CampaignTypeEnum] = mapped_column(Enum(CampaignTypeEnum))
    objective: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="active")
    audience_query: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    schedule: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class CampaignMetrics(Base):
    __tablename__ = "campaign_metrics"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    campaign_id: Mapped[str] = mapped_column(String, ForeignKey("campaigns.id"), index=True)
    ts: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    reached: Mapped[int] = mapped_column(Integer, default=0)
    engaged: Mapped[int] = mapped_column(Integer, default=0)
    qualified: Mapped[int] = mapped_column(Integer, default=0)
    booked: Mapped[int] = mapped_column(Integer, default=0)
    revenue_sar: Mapped[float] = mapped_column(Float, default=0.0)
    roas: Mapped[float] = mapped_column(Float, default=0.0)

class Handoff(Base):
    __tablename__ = "handoffs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    conversation_id: Mapped[str] = mapped_column(String, ForeignKey("conversations.id"))
    from_tier: Mapped[str] = mapped_column(String)
    to_tier: Mapped[str] = mapped_column(String)
    reason: Mapped[str] = mapped_column(String)
    at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    success: Mapped[bool] = mapped_column(Boolean, default=False)

class Approval(Base):
    __tablename__ = "approvals"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    entity_type: Mapped[str] = mapped_column(String)
    entity_id: Mapped[str] = mapped_column(String)
    approver: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="pending")
    at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    type: Mapped[str] = mapped_column(String)
    payload: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    tenant_id: Mapped[str] = mapped_column(String, index=True)

class VoiceSession(Base):
    __tablename__ = "voice_sessions"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    tenant_id: Mapped[str] = mapped_column(String, index=True)
    customer_id: Mapped[str] = mapped_column(String, ForeignKey("customers.id"))
    direction: Mapped[str] = mapped_column(String)  # inbound/outbound
    locale: Mapped[str] = mapped_column(String, default="ar-SA")
    status: Mapped[str] = mapped_column(String, default="active")  # active/ended
    simulation: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[datetime] = mapped_column(DateTime, nullable=True) 