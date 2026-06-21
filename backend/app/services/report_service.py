import os
import textwrap
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from app.repositories import profile_repo, analytics_repo, report_repo

class ReportService:
    def generate_report(self, db: Session, username: str):
        """
        Orchestrates fetching profile and analytics data, generating a PDF report
        via ReportLab, and saving the metadata to the database.
        """
        # Step 1: Find DeveloperProfile
        profile = profile_repo.get_by_username(db, username)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Developer profile not found"
            )

        # Step 2: Fetch analytics snapshot
        snapshot = analytics_repo.get_by_profile_id(db, profile.id)
        if not snapshot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Analytics data not found. Please refresh the profile first."
            )

        # Ensure directory exists
        reports_dir = "reports"
        if not os.path.exists(reports_dir):
            os.makedirs(reports_dir)

        file_path = os.path.join(reports_dir, f"{username}_report.pdf")

        # Step 3: Generate PDF using ReportLab
        c = canvas.Canvas(file_path, pagesize=letter)
        width, height = letter

        # Title
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, height - 50, "DevInsight Developer Report")

        c.setFont("Helvetica", 12)
        y_position = height - 100
        
        # Profile Data
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position, "Profile Information")
        y_position -= 20
        c.setFont("Helvetica", 12)
        c.drawString(50, y_position, f"Name: {profile.name or 'N/A'}")
        y_position -= 20
        c.drawString(50, y_position, f"Username: {profile.username}")
        y_position -= 20
        c.drawString(50, y_position, f"Followers: {profile.followers}")
        y_position -= 20
        c.drawString(50, y_position, f"Public Repositories: {profile.public_repos}")
        
        y_position -= 40
        
        # Analytics Data
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position, "Analytics Dashboard")
        y_position -= 20
        c.setFont("Helvetica", 12)
        c.drawString(50, y_position, f"Developer Score: {snapshot.developer_score}")
        y_position -= 20
        c.drawString(50, y_position, f"Most Used Language: {snapshot.most_used_language or 'Unknown'}")
        y_position -= 20
        c.drawString(50, y_position, f"Total Languages: {snapshot.total_languages}")
        y_position -= 20
        c.drawString(50, y_position, f"Growth Score: {snapshot.growth_score}")
        y_position -= 20
        c.drawString(50, y_position, f"Repository Health Average: {snapshot.repo_health_average}")
        
        y_position -= 40
        
        # Generated Insights
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y_position, "Generated Insights")
        y_position -= 20
        c.setFont("Helvetica", 10)
        
        insights = snapshot.generated_insights or "No insights generated yet."
        wrapped_text = textwrap.wrap(insights, width=90)
        for line in wrapped_text:
            # Handle PDF page overflow safely
            if y_position < 50:
                c.showPage()
                y_position = height - 50
                c.setFont("Helvetica", 10)

            c.drawString(50, y_position, line)
            y_position -= 15

        c.save()

        # Step 4: Create Report database entry
        report = report_repo.create(
            db=db, 
            profile_id=profile.id, 
            file_path=file_path,
            report_type="developer_analytics"
        )

        return {
            "report_id": report.id,
            "status": "ready"
        }

    def get_report(self, db: Session, report_id: int):
        """
        Retrieves the report database object.
        """
        report = report_repo.get_by_id(db, report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Report not found"
            )
        return report

report_service = ReportService()
