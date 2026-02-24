CREATE TABLE "bloodpressure_symptoms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bloodpressure_symptoms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"reading_id" integer NOT NULL,
	"symptom_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "symptoms" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "symptoms_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "symptoms_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "bloodpressure_symptoms" ADD CONSTRAINT "bloodpressure_symptoms_reading_id_bloodpressure_id_fk" FOREIGN KEY ("reading_id") REFERENCES "public"."bloodpressure"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bloodpressure_symptoms" ADD CONSTRAINT "bloodpressure_symptoms_symptom_id_symptoms_id_fk" FOREIGN KEY ("symptom_id") REFERENCES "public"."symptoms"("id") ON DELETE cascade ON UPDATE no action;