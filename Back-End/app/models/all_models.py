from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, default="Operator")
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    role = Column(String, default="user") # 'user' or 'admin'
    risk_score = Column(Integer, default=50)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    kind = Column(String, nullable=False) # 'url', 'text', 'email', 'file'
    content_redacted = Column(Text, nullable=True)
    target = Column(String, nullable=False)
    status = Column(String, default="queued") # 'queued', 'processing', 'done', 'failed'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Attachment(Base):
    __tablename__ = "attachments"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    filename = Column(String, nullable=False)
    size = Column(Integer)
    mime_detected = Column(String)
    sha256 = Column(String, index=True)
    storage_path = Column(String)

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), unique=True)
    risk_score = Column(Integer, nullable=False)
    band = Column(String, nullable=False) # 'Low', 'Medium', 'High', 'Critical'
    confidence = Column(String, default="High") # 'Low', 'Medium', 'High'
    classification = Column(String, nullable=False)
    summary = Column(Text)
    recommended_actions = Column(JSON) # JSON array of strings
    limitations = Column(JSON)
    threat_dna = Column(JSON)
    attack_chain = Column(JSON)
    telemetry = Column(JSON)
    domain_intelligence = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Finding(Base):
    __tablename__ = "findings"
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, ForeignKey("analysis_results.id"))
    category = Column(String, nullable=False)
    evidence_type = Column(String, nullable=False) # 'verified', 'heuristic', 'ai_assessed'
    source = Column(String, nullable=False)
    detail = Column(Text, nullable=False)
    points = Column(Integer, default=0)

class Indicator(Base):
    __tablename__ = "indicators"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    type = Column(String, nullable=False) # 'url', 'domain', 'ip', 'email', 'hash'
    value = Column(String, nullable=False, index=True)
    intel_status = Column(String, default="unknown") # 'malicious', 'clean', 'unknown', 'unavailable'
    intel_source = Column(String)

class IntelCache(Base):
    __tablename__ = "intel_cache"
    id = Column(Integer, primary_key=True, index=True)
    indicator_value = Column(String, unique=True, index=True, nullable=False)
    source = Column(String, nullable=False)
    verdict = Column(String, nullable=False)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    target = Column(String, nullable=False)
    severity = Column(String, nullable=False) # 'High', 'Critical'
    status = Column(String, default="Open") # 'Open', 'Investigating', 'Resolved'
    assigned_to = Column(String, default="SOC Team")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    type = Column(String, default="threat") # 'threat', 'analysis', 'awareness'
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    label = Column(String, nullable=False) # 'correct', 'false_positive', 'false_negative'
    note = Column(Text, nullable=True)

class TrainingModule(Base):
    __tablename__ = "training_modules"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    difficulty = Column(String, default="Beginner")
    duration = Column(String, default="5 mins")
    content = Column(JSON) # JSON list of markdown/paragraphs

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("training_modules.id"))
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)
    correct_index = Column(Integer, nullable=False)
    explanation = Column(Text)

class TrainingAttempt(Base):
    __tablename__ = "training_attempts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    module_id = Column(Integer, ForeignKey("training_modules.id"))
    score = Column(Integer, nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

class Campaign(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    name = Column(String, nullable=False)
    target_count = Column(Integer, default=100)
    open_rate = Column(Float, default=0.0)
    click_rate = Column(Float, default=0.0)
    report_rate = Column(Float, default=0.0)
    status = Column(String, default="Draft") # 'Draft', 'Active', 'Completed'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
