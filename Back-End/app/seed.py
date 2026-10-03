import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.session import engine, SessionLocal, Base
from app.models.all_models import (
    Organization, User, Submission, AnalysisResult, Finding,
    Incident, Notification, TrainingModule, QuizQuestion, Campaign
)
from app.core.security import get_password_hash

def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).filter(User.email == "admin@phishguard.ai").first():
        print("Database already seeded!")
        db.close()
        return

    print("Seeding Organization & Users...")
    org = Organization(name="Enterprise CyberSec Org")
    db.add(org)
    db.commit()

    admin = User(
        org_id=org.id,
        email="admin@phishguard.ai",
        name="Security Admin",
        hashed_password=get_password_hash("AdminPass123!"),
        is_admin=True,
        role="admin",
        risk_score=15
    )
    user = User(
        org_id=org.id,
        email="user@phishguard.ai",
        name="Alex Vance",
        hashed_password=get_password_hash("UserPass123!"),
        is_admin=False,
        role="user",
        risk_score=28
    )
    db.add(admin)
    db.add(user)
    db.commit()

    print("Seeding Training Modules & Quizzes...")
    m1 = TrainingModule(
        title="Spotting Lookalike Domains",
        topic="Domain Spoofing",
        difficulty="Beginner",
        duration="5 mins",
        content=[
            "Attackers often register domains that look identical to trusted brands, such as paypa1.com or g00gle.com.",
            "Punycode tricks use international characters like Cyrillic 'а' to trick users.",
            "Always inspect the domain directly to the left of .com, .org, or .net!"
        ]
    )
    m2 = TrainingModule(
        title="Urgency & Social Engineering Tricks",
        topic="Psychological Manipulation",
        difficulty="Intermediate",
        duration="7 mins",
        content=[
            "Phishing emails create artificial panic ('Account suspended in 24h!') to bypass critical thinking.",
            "Impersonating authority figures like CEOs or IT directors induces compliance.",
            "Always pause and verify through a trusted second channel before acting."
        ]
    )
    db.add(m1)
    db.add(m2)
    db.commit()

    q1 = QuizQuestion(
        module_id=m1.id,
        question="Which of the following is a lookalike domain for paypal.com?",
        options=["paypal.com/login", "paypa1-security.com", "help.paypal.com", "paypal.org"],
        correct_index=1,
        explanation="paypa1-security.com replaces the 'l' with a '1' and adds a suffix."
    )
    q2 = QuizQuestion(
        module_id=m1.id,
        question="In the URL http://support.apple.com.attacker.com, who owns the domain?",
        options=["apple.com", "support.apple.com", "attacker.com", "None of the above"],
        correct_index=2,
        explanation="The actual registered domain is attacker.com because it sits directly before the TLD."
    )
    db.add(q1)
    db.add(q2)
    db.commit()

    print("Seeding Sample Submissions & Threat Analysis...")
    sub1 = Submission(
        user_id=user.id,
        org_id=org.id,
        kind="url",
        target="http://paypa1-secure-verification.com/login",
        content_redacted="http://paypa1-secure-verification.com/login",
        status="done"
    )
    db.add(sub1)
    db.commit()

    res1 = AnalysisResult(
        submission_id=sub1.id,
        risk_score=88,
        band="Critical",
        confidence="High",
        classification="Credential Phishing",
        summary="High probability of phishing. Multiple deception vectors flagged including brand impersonation and insecure transport.",
        recommended_actions=["Do not enter passwords.", "Close tab immediately.", "Report to SOC team."],
        limitations=["External OSINT WHOIS feed was unavailable and marked as UNKNOWN to preserve data integrity."],
        threat_dna=[
            {"name": "Brand Impersonation", "score": 91, "severity": "CRITICAL", "evidence": "Matches target pattern for brand 'paypal'."},
            {"name": "SSL/HTTPS Status", "score": 95, "severity": "CRITICAL", "evidence": "Insecure HTTP protocol used for sensitive target."},
            {"name": "Blacklist Status", "score": "Unavailable", "severity": "UNAVAILABLE", "evidence": "External OSINT threat feeds unavailable (Offline mode)."}
        ],
        attack_chain=[
            {"step": "Suspicious Email / Vector", "status": "detected", "detail": "Phishing message received with spoofed headers."},
            {"step": "Malicious URL / Domain", "status": "detected", "detail": "User redirected to paypa1-secure-verification.com."},
            {"step": "Fake Login Page", "status": "potential", "detail": "Credential harvesting form requesting passwords."}
        ],
        telemetry={"entropyScore": 3.84, "urlLength": 45, "subdomainCount": 3, "httpsStatus": False},
        domain_intelligence={"domain": "paypa1-secure-verification.com", "ipInfo": "185.220.101.5 (Anonymous Proxy)", "registrar": "NameCheap Inc", "reputation": "Flagged by 4/80 Intel Feeds"}
    )
    db.add(res1)
    db.commit()

    f1 = Finding(
        result_id=res1.id,
        category="Brand Impersonation",
        evidence_type="verified",
        source="Google Safe Browsing",
        detail="Domain closely resembles PayPal brand assets.",
        points=50
    )
    f2 = Finding(
        result_id=res1.id,
        category="Suspicious Domain Pattern",
        evidence_type="heuristic",
        source="Typosquat Analyzer",
        detail="Character substitution (paypa1 vs paypal).",
        points=25
    )
    db.add(f1)
    db.add(f2)

    inc1 = Incident(
        submission_id=sub1.id,
        org_id=org.id,
        target=sub1.target,
        severity="Critical",
        status="Open",
        assigned_to="SOC Team"
    )
    db.add(inc1)

    notif1 = Notification(
        user_id=user.id,
        title="Critical Phishing Threat Flagged",
        body=f"Submission '{sub1.target}' generated a risk score of 88%.",
        type="threat"
    )
    db.add(notif1)

    camp1 = Campaign(
        org_id=org.id,
        name="Q3 Executive CEO Phishing Test",
        target_count=150,
        open_rate=42.0,
        click_rate=8.0,
        report_rate=64.0,
        status="Active"
    )
    db.add(camp1)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
