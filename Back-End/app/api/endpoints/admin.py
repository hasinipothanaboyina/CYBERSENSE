from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
import csv
import io
from app.api.deps import get_current_active_admin
from app.database.session import get_db
from app.models.all_models import User, Submission, Incident, Campaign

router = APIRouter()

class CampaignCreateRequest(BaseModel):
    name: str

@router.get("/overview")
def get_admin_overview(db: Session = Depends(get_db), admin: User = Depends(get_current_active_admin)):
    users_count = db.query(User).count()
    incidents_count = db.query(Incident).filter(Incident.status != "Resolved").count()
    total_submissions = db.query(Submission).count()
    return {
        "users_total": users_count,
        "incidents": incidents_count,
        "total_submissions": total_submissions,
        "simulation_click_rate": 11.0
    }

@router.get("/users")
def get_users(db: Session = Depends(get_db), admin: User = Depends(get_current_active_admin)):
    users = db.query(User).all()
    return [{
        "id": u.id,
        "email": u.email,
        "name": u.name,
        "role": u.role,
        "risk_score": u.risk_score
    } for u in users]

@router.get("/incidents")
def get_incidents(db: Session = Depends(get_db), admin: User = Depends(get_current_active_admin)):
    incidents = db.query(Incident).order_by(Incident.id.desc()).all()
    return [{
        "id": f"INC-{inc.id}",
        "target": inc.target,
        "severity": inc.severity,
        "status": inc.status,
        "assignedTo": inc.assigned_to,
        "date": inc.created_at.strftime("%Y-%m-%d") if inc.created_at else "Just now"
    } for inc in incidents]

@router.patch("/incidents/{id}")
def update_incident(id: int, status: str, db: Session = Depends(get_db), admin: User = Depends(get_current_active_admin)):
    incident = db.query(Incident).filter(Incident.id == id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident.status = status
    db.commit()
    return {"id": incident.id, "status": incident.status}

@router.get("/campaigns")
def get_campaigns(db: Session = Depends(get_db), admin: User = Depends(get_current_active_admin)):
    campaigns = db.query(Campaign).order_by(Campaign.id.desc()).all()
    return [{
        "id": f"CAMP-0{c.id}",
        "name": c.name,
        "targetCount": c.target_count,
        "openRate": c.open_rate,
        "clickRate": c.click_rate,
        "reportRate": c.report_rate,
        "status": c.status,
        "createdAt": c.created_at.strftime("%Y-%m-%d") if c.created_at else "Just now"
    } for c in campaigns]

@router.post("/campaigns")
def create_campaign(req: CampaignCreateRequest, db: Session = Depends(get_db), admin: User = Depends(get_current_active_admin)):
    camp = Campaign(name=req.name, status="Active")
    db.add(camp)
    db.commit()
    db.refresh(camp)
    return {"id": camp.id, "name": camp.name, "status": camp.status}

@router.get("/export")
def export_csv(format: str = "csv", db: Session = Depends(get_db), admin: User = Depends(get_current_active_admin)):
    incidents = db.query(Incident).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Incident ID", "Target", "Severity", "Status", "Assigned To"])
    for inc in incidents:
        writer.writerow([inc.id, inc.target, inc.severity, inc.status, inc.assigned_to])
        
    return Response(content=output.getvalue(), media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=phishguard_incidents_report.csv"
    })
