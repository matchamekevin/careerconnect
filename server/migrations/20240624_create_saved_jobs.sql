-- Table de sauvegarde des offres par étudiant
CREATE TABLE IF NOT EXISTS saved_jobs (
  id SERIAL PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  UNIQUE(student_id, job_id)
);
