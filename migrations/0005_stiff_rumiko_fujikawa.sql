CREATE TABLE IF NOT EXISTS public.symptoms (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.bloodpressure_symptoms (
    id serial PRIMARY KEY,
    reading_id integer NOT NULL REFERENCES public.bloodpressure(id) ON DELETE CASCADE,
    symptom_id integer NOT NULL REFERENCES public.symptoms(id) ON DELETE CASCADE
);

INSERT INTO public.symptoms (name) VALUES
('Chest pain'),
('Shortness of Breath'),
('Back pain'),
('Numbness'),
('Weakness'),
('Change in Vision'),
('Difficulty Speaking')
ON CONFLICT (name) DO NOTHING;