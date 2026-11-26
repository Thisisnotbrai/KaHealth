-- Run in the Supabase SQL Editor to add one sample request per listed person.
-- Re-running the script skips requests created by this import.
BEGIN;

CREATE TEMP TABLE sample_people (
  requester_name text NOT NULL,
  age integer NOT NULL,
  sex text NOT NULL,
  contact text NOT NULL,
  address text NOT NULL
) ON COMMIT DROP;

INSERT INTO sample_people (requester_name, age, sex, contact, address) VALUES
  ('Emiliano Sison', 50, 'Male', '09162345620', 'Jones, Barangay New Kalalake'),
  ('Liza Gonzales', 36, 'Female', '09201234577', 'Kessing, Barangay New Kalalake'),
  ('Gemma Ocampo', 51, 'Female', '09470234608', 'Norton, Barangay New Kalalake'),
  ('Adrian Tolentino', 35, 'Male', '09991234584', 'Murphy, Barangay New Kalalake'),
  ('Sonia Ylagan', 47, 'Female', '09192234604', 'Rodriguez, Barangay New Kalalake'),
  ('Rommel Mendez', 36, 'Male', '09170234607', 'Irving, Barangay New Kalalake'),
  ('Macario Caluag', 61, 'Male', '09991234612', 'Jones, Barangay New Kalalake'),
  ('Nica Velasco', 27, 'Female', '09292345623', 'Kessing, Barangay New Kalalake'),
  ('Renz Dela Rosa', 27, 'Male', '09111234592', 'Norton, Barangay New Kalalake'),
  ('Hannah Mae Mercado', 23, 'Female', '09171234581', 'Murphy, Barangay New Kalalake'),
  ('Noelito Alonzo', 54, 'Male', '09950234610', 'Rodriguez, Barangay New Kalalake'),
  ('Arlene Padilla', 40, 'Female', '09491234587', 'Irving, Barangay New Kalalake'),
  ('Leo Ong', 37, 'Male', '09151234616', 'Jones, Barangay New Kalalake');

CREATE TEMP TABLE sample_medicine_stock (
  medicine_id uuid PRIMARY KEY,
  remaining_stock integer NOT NULL
) ON COMMIT DROP;

INSERT INTO sample_medicine_stock (medicine_id, remaining_stock)
SELECT id, GREATEST(COALESCE(stock, 0), 0)::integer
FROM public.medicines
FOR UPDATE;

DO $$
DECLARE
  person record;
  v_request_id uuid;
  v_medicine_id uuid;
  v_assigned_status text;
  v_inserted_count integer := 0;
  v_skipped_count integer := 0;
  v_reason_marker constant text := 'KaHealth sample medicine request import';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.medicines) THEN
    RAISE EXCEPTION 'Cannot add sample requests because no medicines are available.';
  END IF;

  FOR person IN SELECT * FROM pg_temp.sample_people LOOP
    IF EXISTS (
      SELECT 1
      FROM public.medicine_requests AS existing
      WHERE existing.requester_name = person.requester_name
        AND existing.reason = v_reason_marker
    ) THEN
      v_skipped_count := v_skipped_count + 1;
      CONTINUE;
    END IF;

    v_assigned_status := (ARRAY['pending', 'approved', 'claimed', 'denied'])
      [floor(random() * 4)::integer + 1];

    IF v_assigned_status IN ('approved', 'claimed') THEN
      SELECT medicine_id
      INTO v_medicine_id
      FROM pg_temp.sample_medicine_stock
      WHERE remaining_stock > 0
      ORDER BY random()
      LIMIT 1;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Not enough medicine stock for all randomly approved sample requests; no requests were added.';
      END IF;

      UPDATE pg_temp.sample_medicine_stock
      SET remaining_stock = remaining_stock - 1
      WHERE medicine_id = v_medicine_id;
    ELSE
      SELECT id
      INTO v_medicine_id
      FROM public.medicines
      ORDER BY random()
      LIMIT 1;
    END IF;

    INSERT INTO public.medicine_requests (
      requester_name,
      age,
      sex,
      contact,
      address,
      medicine_id,
      quantity,
      reason,
      file_url,
      status
    ) VALUES (
      person.requester_name,
      person.age,
      person.sex,
      person.contact,
      person.address,
      v_medicine_id,
      1,
      v_reason_marker,
      NULL,
      'pending'
    )
    RETURNING id INTO v_request_id;

    IF v_assigned_status IN ('approved', 'claimed') THEN
      UPDATE public.medicine_requests
      SET status = 'approved'
      WHERE id = v_request_id;
    END IF;

    IF v_assigned_status IN ('claimed', 'denied') THEN
      UPDATE public.medicine_requests
      SET status = v_assigned_status
      WHERE id = v_request_id;
    END IF;

    v_inserted_count := v_inserted_count + 1;
  END LOOP;

  RAISE NOTICE 'Added % sample requests; skipped % already-imported requests.',
    v_inserted_count,
    v_skipped_count;
END
$$;

COMMIT;
