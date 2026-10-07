class ContextBuilder:

    def build(
        self,
        profile,
        experiences,
        projects,
        skills,
    ):

        return {
            "headline": profile.headline,
            "summary": profile.summary,

            "skills": [
                s.name
                for s in skills
            ],

            "experiences": [
                {
                    "company": e.company,
                    "role": e.role,
                    "description": e.description,
                }
                for e in experiences
            ],

            "projects": [
                {
                    "name": p.name,
                    "description": p.description,
                }
                for p in projects
            ],
        }


context_builder = ContextBuilder()