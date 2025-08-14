/*
  # Add document type management tables for HakiDraft

  1. New Tables
    - `document_categories` table for general document categories
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `document_types` table for specific document types
      - `id` (uuid, primary key)
      - `category_id` (uuid, references document_categories)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Updates to existing tables
    - Add `document_type_id` to `documents` table

  3. Security
    - Enable RLS on new tables
    - Add policies for appropriate access control
*/

-- Create document_categories table
CREATE TABLE document_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_types table
CREATE TABLE document_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES document_categories(id) NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category_id, name)
);

-- Add document_type_id column to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS document_type_id uuid REFERENCES document_types(id);

-- Enable RLS
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_categories
CREATE POLICY "Anyone can read document categories"
  ON document_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Create RLS policies for document_types
CREATE POLICY "Anyone can read document types"
  ON document_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_document_categories_updated_at
  BEFORE UPDATE ON document_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_document_types_updated_at
  BEFORE UPDATE ON document_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert sample data for document categories and types
-- General Documents (Across Most Practice Areas)
INSERT INTO document_categories (name, description) VALUES 
  ('General Documents', 'Documents used across most practice areas');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Client engagement letters / retainer agreements', 'Letters for client engagement and retainer agreements'),
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Legal opinions', 'Legal opinion documents'),
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Demand letters', 'Demand letters for legal matters'),
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Cease and desist letters', 'Cease and desist legal letters'),
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Affidavits', 'Affidavit documents'),
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Notices', 'Various legal notices (e.g., notice of hearing, default, termination)'),
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Memos and legal briefs', 'Legal memos and briefs'),
  ((SELECT id FROM document_categories WHERE name = 'General Documents'), 'Pleadings', 'General term for filed documents in court cases');

-- Litigation / Court Practice
INSERT INTO document_categories (name, description) VALUES 
  ('Litigation / Court Practice', 'Documents used in litigation and court practice');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Plaint (civil suits)', 'Plaint documents for civil suits'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Petitions', 'Legal petitions'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Statements of claim / defence', 'Statements of claim and defence'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Witness statements', 'Witness statement documents'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Pre-trial briefs', 'Pre-trial legal briefs'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Motions / applications', 'Legal motions and applications'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Affidavits in support or opposition', 'Affidavits in support or opposition of motions'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Submissions / written arguments', 'Written legal submissions and arguments'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Court orders / draft decrees', 'Court orders and draft decrees'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Consent judgments / settlement agreements', 'Consent judgments and settlement agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Discovery documents', 'Discovery documents (e.g., interrogatories, requests to produce documents)'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Notices of appeal', 'Notices of appeal'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Judicial reviews', 'Judicial review documents'),
  ((SELECT id FROM document_categories WHERE name = 'Litigation / Court Practice'), 'Exhibits and bundles of documents', 'Exhibits and bundles of documents');

-- Corporate / Commercial Law
INSERT INTO document_categories (name, description) VALUES 
  ('Corporate / Commercial Law', 'Documents used in corporate and commercial law');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Contracts / agreements', 'Various contracts and agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Service level agreements (SLAs)', 'Service level agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Memorandums of Understanding (MOUs)', 'Memorandums of Understanding'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Non-disclosure agreements (NDAs)', 'Non-disclosure agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Partnership agreements', 'Partnership agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Joint venture agreements', 'Joint venture agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Shareholder agreements', 'Shareholder agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Employment contracts', 'Employment contracts'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Consultancy agreements', 'Consultancy agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Franchise agreements', 'Franchise agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Loan agreements', 'Loan agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Distribution agreements', 'Distribution agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Sales contracts', 'Sales contracts'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Licensing agreements', 'Licensing agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Articles of incorporation', 'Articles of incorporation'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Bylaws', 'Corporate bylaws'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Board resolutions / minutes', 'Board resolutions and minutes'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Company registration documents', 'Company registration documents'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Due diligence reports', 'Due diligence reports'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Mergers & acquisition documentation', 'Mergers and acquisition documentation'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Corporate governance policies', 'Corporate governance policies'),
  ((SELECT id FROM document_categories WHERE name = 'Corporate / Commercial Law'), 'Company secretarial filings', 'Company secretarial filings');

-- Real Estate & Conveyancing
INSERT INTO document_categories (name, description) VALUES 
  ('Real Estate & Conveyancing', 'Documents used in real estate and conveyancing');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Sale agreements', 'Sale agreements for land, house, commercial property'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Transfer instruments', 'Property transfer instruments'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Leases / tenancy agreements', 'Lease and tenancy agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Title search reports', 'Title search reports'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Land control board consents', 'Land control board consents'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Charge instruments (mortgages)', 'Charge instruments and mortgages'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Deeds', 'Various deeds (e.g., deed of assignment, deed of gift, deed of variation)'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Caveats and withdrawal of caveats', 'Caveats and withdrawal of caveats'),
  ((SELECT id FROM document_categories WHERE name = 'Real Estate & Conveyancing'), 'Landlord-tenant notices', 'Landlord-tenant notices (e.g., notice to vacate)');

-- Family Law
INSERT INTO document_categories (name, description) VALUES 
  ('Family Law', 'Documents used in family law matters');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Family Law'), 'Divorce petitions', 'Divorce petition documents'),
  ((SELECT id FROM document_categories WHERE name = 'Family Law'), 'Child custody/maintenance applications', 'Child custody and maintenance applications'),
  ((SELECT id FROM document_categories WHERE name = 'Family Law'), 'Prenuptial agreements', 'Prenuptial agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Family Law'), 'Adoption petitions', 'Adoption petition documents'),
  ((SELECT id FROM document_categories WHERE name = 'Family Law'), 'Guardianship applications', 'Guardianship applications'),
  ((SELECT id FROM document_categories WHERE name = 'Family Law'), 'Consent orders', 'Consent orders (custody, divorce settlements)'),
  ((SELECT id FROM document_categories WHERE name = 'Family Law'), 'Affidavits on family status / financial status', 'Affidavits on family status and financial status');

-- Succession / Probate
INSERT INTO document_categories (name, description) VALUES 
  ('Succession / Probate', 'Documents used in succession and probate matters');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Wills', 'Will documents'),
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Codicils', 'Codicil documents'),
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Petition for grant of probate', 'Petition for grant of probate'),
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Petition for letters of administration', 'Petition for letters of administration'),
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Affidavits of means and relationships', 'Affidavits of means and relationships'),
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Inventory and accounts for estate distribution', 'Inventory and accounts for estate distribution'),
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Deed of family arrangement', 'Deed of family arrangement'),
  ((SELECT id FROM document_categories WHERE name = 'Succession / Probate'), 'Trust deeds', 'Trust deeds');

-- Employment / Labor Law
INSERT INTO document_categories (name, description) VALUES 
  ('Employment / Labor Law', 'Documents used in employment and labor law');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Employment contracts', 'Employment contracts'),
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Termination / dismissal letters', 'Termination and dismissal letters'),
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Non-compete agreements', 'Non-compete agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Workplace policies', 'Workplace policies (e.g., disciplinary, harassment)'),
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Warning letters', 'Warning letters'),
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Grievance responses', 'Grievance response documents'),
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Redundancy / retrenchment notices', 'Redundancy and retrenchment notices'),
  ((SELECT id FROM document_categories WHERE name = 'Employment / Labor Law'), 'Collective bargaining agreements', 'Collective bargaining agreements');

-- Intellectual Property (IP) Law
INSERT INTO document_categories (name, description) VALUES 
  ('Intellectual Property (IP) Law', 'Documents used in intellectual property law');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Intellectual Property (IP) Law'), 'Copyright assignment agreements', 'Copyright assignment agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Intellectual Property (IP) Law'), 'Trademark registration applications', 'Trademark registration applications'),
  ((SELECT id FROM document_categories WHERE name = 'Intellectual Property (IP) Law'), 'Patent applications', 'Patent applications'),
  ((SELECT id FROM document_categories WHERE name = 'Intellectual Property (IP) Law'), 'IP licensing agreements', 'IP licensing agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Intellectual Property (IP) Law'), 'Confidentiality agreements', 'Confidentiality agreements'),
  ((SELECT id FROM document_categories WHERE name = 'Intellectual Property (IP) Law'), 'Cease and desist letters (IP infringement)', 'Cease and desist letters for IP infringement');

-- Immigration Law
INSERT INTO document_categories (name, description) VALUES 
  ('Immigration Law', 'Documents used in immigration law');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Immigration Law'), 'Work permit applications', 'Work permit applications'),
  ((SELECT id FROM document_categories WHERE name = 'Immigration Law'), 'Visa support letters', 'Visa support letters'),
  ((SELECT id FROM document_categories WHERE name = 'Immigration Law'), 'Deportation appeal documents', 'Deportation appeal documents'),
  ((SELECT id FROM document_categories WHERE name = 'Immigration Law'), 'Residency or citizenship applications', 'Residency or citizenship applications'),
  ((SELECT id FROM document_categories WHERE name = 'Immigration Law'), 'Affidavits of support or relationship', 'Affidavits of support or relationship');

-- Regulatory / Administrative Law
INSERT INTO document_categories (name, description) VALUES 
  ('Regulatory / Administrative Law', 'Documents used in regulatory and administrative law');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Regulatory / Administrative Law'), 'License applications', 'License applications'),
  ((SELECT id FROM document_categories WHERE name = 'Regulatory / Administrative Law'), 'Compliance filings', 'Compliance filings'),
  ((SELECT id FROM document_categories WHERE name = 'Regulatory / Administrative Law'), 'Petitions for review / appeal', 'Petitions for review and appeal'),
  ((SELECT id FROM document_categories WHERE name = 'Regulatory / Administrative Law'), 'Regulatory submissions and responses', 'Regulatory submissions and responses'),
  ((SELECT id FROM document_categories WHERE name = 'Regulatory / Administrative Law'), 'Policy position papers', 'Policy position papers'),
  ((SELECT id FROM document_categories WHERE name = 'Regulatory / Administrative Law'), 'Memoranda to government bodies', 'Memoranda to government bodies');

-- Academic / Legal Research
INSERT INTO document_categories (name, description) VALUES 
  ('Academic / Legal Research', 'Documents used in academic and legal research');

INSERT INTO document_types (category_id, name, description) VALUES 
  ((SELECT id FROM document_categories WHERE name = 'Academic / Legal Research'), 'Legal research memos', 'Legal research memos'),
  ((SELECT id FROM document_categories WHERE name = 'Academic / Legal Research'), 'Position papers', 'Position papers'),
  ((SELECT id FROM document_categories WHERE name = 'Academic / Legal Research'), 'Policy briefs', 'Policy briefs'),
  ((SELECT id FROM document_categories WHERE name = 'Academic / Legal Research'), 'Law reform proposals', 'Law reform proposals'),
  ((SELECT id FROM document_categories WHERE name = 'Academic / Legal Research'), 'Draft legislation / amendments', 'Draft legislation and amendments');