import os
import textwrap

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.analytics.engine import generate_analytics_for_profile

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from app.repositories import (
    profile_repo,
    report_repo
)


class ReportService:


    def generate_report(self, db: Session, username: str):

        """
        Generate developer analytics PDF report.
        """


        # 1. Get developer profile
        profile = profile_repo.get_by_username(
            db,
            username
        )


        if not profile:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Developer profile not found"
            )


        # 2. Generate fresh analytics data
        analytics_data = generate_analytics_for_profile(
            db,
            profile
        )


        developer_score = (
            analytics_data
            .get("developer_score", {})
            .get("score", 0)
        )


        breakdown = (
            analytics_data
            .get("developer_score", {})
            .get("breakdown", {})
        )


        language_analysis = (
            analytics_data
            .get("language_analysis", {})
        )


        growth_score = (
            analytics_data
            .get("growth_analysis", {})
            .get("growth_score", 0)
        )


        repo_health = (
            analytics_data
            .get("repo_health", {})
            .get("average_health", 0)
        )


        insights = analytics_data.get(
            "insights",
            "No insights available."
        )



        # 3. Create reports folder

        reports_dir = "reports"

        os.makedirs(
            reports_dir,
            exist_ok=True
        )


        file_path = os.path.join(
            reports_dir,
            f"{username}_report.pdf"
        )



        # 4. Generate PDF

        pdf = canvas.Canvas(
            file_path,
            pagesize=letter
        )


        width, height = letter

        y = height - 50



        pdf.setFont(
            "Helvetica-Bold",
            24
        )


        pdf.drawString(
            50,
            y,
            "DevInsight Developer Report"
        )


        y -= 50


        pdf.setFont(
            "Helvetica",
            12
        )



        data = [


            f"Name: {profile.name or 'N/A'}",

            f"Username: {profile.username}",

            f"Followers: {profile.followers}",

            f"Public Repositories: {profile.public_repos}",



            "",



            "Analytics Dashboard",


            f"Developer Score: {developer_score}",


            f"Contribution Score: {breakdown.get('contribution',0)}",


            f"Growth Score: {growth_score}",


            f"Most Used Language: {language_analysis.get('most_used_language','Unknown')}",


            f"Total Languages: {language_analysis.get('total_languages',0)}",


            f"Repository Health Average: {repo_health}",



            "",


            "Generated Insights",


            insights

        ]



        for line in data:


            if y < 50:

                pdf.showPage()

                y = height - 50



            for wrapped in textwrap.wrap(
                str(line),
                width=90
            ):


                pdf.drawString(
                    50,
                    y,
                    wrapped
                )


                y -= 15



        pdf.save()



        # 5. Save report metadata

        report = report_repo.create(

            db=db,

            profile_id=profile.id,

            file_path=file_path,

            report_type="developer_analytics"

        )



        return {


            "report_id": report.id,

            "profile_id": profile.id,

            "status": "ready"

        }




    def get_report(
        self,
        db: Session,
        report_id: int
    ):


        report = report_repo.get_by_id(
            db,
            report_id
        )


        if not report:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )


        return report



report_service = ReportService()