-- Create document templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  template_content TEXT NOT NULL,
  template_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated documents table
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES document_templates(id) ON DELETE SET NULL,
  document_name TEXT NOT NULL,
  document_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert NDA template
INSERT INTO document_templates (title, description, template_type, template_content)
VALUES (
  'Non-Disclosure Agreement (NDA)',
  'A standard Non-Disclosure Agreement to protect confidential information shared between parties.',
  'nda',
  'NON-DISCLOSURE AGREEMENT

THIS AGREEMENT is made and entered into on {{effectiveDate}}(Date)

                                     BETWEEN:

1. {{party1}} (hereinafter referred to as "Party 1")

                                     AND

2. {{party2}} (hereinafter referred to as "Party 2")

 (Party 1 and Party 2 are hereinafter referred to individually as a "Party"and collectively as the "Parties". The Party disclosing confidential information shall be referred to as the "Disclosing Party" and the Party receiving the confidential information shall be referred to as the "Receiving Party".)

                                    WHEREAS:

 Party 1 engages in {{party1Engages}};
 Party 2 engages in {{party2Engages}};
 
The Parties wish to explore {{purpose}} (hereinafter referred to as the "Proposed Transaction");

 IN CONNECTION WITH THE ABOVE, THE PARTIES HEREBY AGREE AS FOLLOWS:

1.	"Confidential and or proprietary Information" shall mean and include any information disclosed by one Party (Disclosing Party) to the other (Receiving Party) either directly or indirectly, in writing, orally, by inspection of tangible objects (including, without limitation, documents, prototypes, samples, media, documentation, discs and code). Confidential information shall include, without limitation, any materials, trade secrets, network information, configurations, trademarks, brand name, know-how, business and marketing plans, financial and operational information, and all other non-public information, material or data relating to the current and/ or future business and operations of the Disclosing Party and analysis, compilations, studies, summaries, extracts or other documentation prepared by the Disclosing Party. Confidential Information may also include information disclosed to the Receiving Party by third parties on behalf of the Disclosing Party. 

2.	The Receiving Party shall refrain from disclosing, reproducing, summarising and/or distributing Confidential Information and confidential materials of the Disclosing Party except in connection with the Proposed Transaction.

3.	The Parties shall protect the confidentiality of each other''s Confidential Information in the same manner as they protect the confidentiality of their own proprietary and confidential information of similar nature. Each Party, while acknowledging the confidential and proprietary nature of the Confidential Information agrees to take all reasonable measures at its own expense to restrain its representatives from prohibited or unauthorised disclosure or use of the Confidential Information.

4.	Confidential Information shall at all times remain the property of the Disclosing Party and may not be copied or reproduced by the Receiving Party without the Disclosing Party''s prior written consent.   

5.	Within seven (7) days of a written request by the Disclosing Party, the Receiving Party shall return/destroy (as may be requested in writing by the Disclosing Party or upon expiry and or earlier termination) all originals, copies, reproductions and summaries of Confidential Information provided to the Receiving Party as Confidential Information.  The Receiving Party shall certify to the Disclosing Party in writing that it has satisfied its obligations under this paragraph.  

6.	The Receiving Party may disclose the Confidential Information only to the Receiving Party''s employees and consultants on a need-to-know basis.  The Receiving Party shall have executed or shall execute appropriate written agreements with third parties, in a form and manner sufficient to enable the Receiving Party to enforce all the provisions of this Agreement.

7.	Confidential Information, however, shall not include any information which the Receiving Party can show: 

i)	is in or comes into the public domain otherwise than through a breach of this Agreement or the fault of the Receiving Party; or

ii)	was already in its possession free of any such restriction prior to receipt from the Disclosing Party; or

iii)	was independently developed by the Receiving Party without making use of the Confidential Information; or

iv)	has been approved for release or use (in either case without restriction) by written authorisation of the Disclosing Party.

8.	In the event either Party receives a summons or other validly issued administrative or judicial process requiring the disclosure of Confidential Information of the other Party, the Receiving Party shall promptly notify the Disclosing Party.  The Receiving Party may disclose Confidential Information to the extent such disclosure is required by law, rule, regulation or legal process; provided however, that, to the extent practicable, the Receiving Party shall give prompt written notice of any such request for such information to the Disclosing Party,  and agrees to co-operate with the Disclosing Party, at the Disclosing Party''s expense, to the extent permissible and practicable, to challenge the request or limit the scope there of, as the Disclosing Party may reasonably deem appropriate.

9.	Neither Party shall use the other''s name, trademarks, proprietary words or symbols or disclose under this Agreement in any publication, press release, marketing material, or otherwise without the prior written approval of the other.

10.	Each Party agrees that the conditions in this Agreement and the Confidential Information disclosed pursuant to this Agreement are of a special, unique, and extraordinary character and that an impending or existing violation of any provision of this Agreement would cause the other Party irreparable injury for which it would have no adequate remedy at law and further agrees that the other Party shall be entitled to obtain immediately injunctive relief prohibiting such violation, in addition to any other rights and remedies available to it at law or in equity.

11.	The Receiving Party shall indemnify the Disclosing Party for all costs, expenses or damages that Disclosing Party incurs as a result of any violation of any provisions of this Agreement. This obligation shall include court, litigation expenses, and actual, reasonable attorney''s fees. The Parties acknowledge that as damages may not be a sufficient remedy for any breach under this Agreement, the non-breaching party is entitled to seek specific performance or injunctive relief (as appropriate) as a remedy for any breach or threatened breach, in addition to any other remedies at law or in equity.

12. 	Neither Party shall be liable for any special, consequential, incidental or exemplary damages or loss (or any lost profits, savings or business opportunity) regardless of whether a Party was advised of the possibility of the damage or loss asserted.

13.  	Both the Parties agree that by virtue of the Parties entering into this Agreement neither Party is obligated to disclose all or any of the Confidential Information to the other as stated in this Agreement. The Parties reserve the right to disclose only such information at its discretion and which it thinks, is necessary to disclose in relation to the Proposed Transaction.

14. 	Both the Parties agree that this Agreement will be effective from the date of execution of this Agreement by both Parties and shall continue to be effective till the Proposed Transaction is terminated by either Party by giving a thirty (30)days notice, in case either Party foresees that the Proposed Transaction would not be achieved. 

Notwithstanding anything contained herein, the provisions of this Agreement shall survive and continue after expiration or termination of this Agreement for a further period of five year(s) from the date of expiration.

It being further clarified that notwithstanding anything contained herein, in case a binding agreement is executed between the Parties in furtherance of the Proposed Transaction, the terms and conditions of this Agreement shall become effective and form a part of that binding agreement and be co-terminus with such binding agreement and shall be in effect till the term of such binding agreement and shall after its expiry and or early termination shall continue to be in force in the following manner: 

i.	{{confidentialityDuration}} years after the expiry of the binding agreement 

(whichever is earlier)

15. 	Each Party warrants that it has the authority to enter into this Agreement.

16. 	If any provision of this agreement is held to be invalid or unenforceable to any extent, the remainder of this Agreement shall not be affected and each provision hereof shall be valid and enforceable to the fullest extent permitted by law.  Any invalid or unenforceable provision of this Agreement shall be replaced with a provision that is valid and enforceable and most nearly reflects the original intent of the unenforceable provision.

17. 	This Agreement may be executed in two counterparts, each of which will be deemed to be an original, and all of which, when taken together, shall be deemed to constitute one and the same agreement.

18.  	The relationship between both the Parties to this Agreement shall be on a principal-to-principal basis and nothing in this agreement shall be deemed to have created a relationship of an agent or partner between the Parties and none of the employees of COMPANY shall be considered as employees of PARTY 1.

19. 	This Agreement shall be governed by the laws of {{jurisdiction}}. Both parties irrevocably submit to the exclusive jurisdiction of the Courts in Bangalore, for any action or proceeding regarding this Agreement. Any dispute or claim arising out of or in connection herewith, or the breach, termination or invalidity thereof, shall be settled by arbitration in accordance with the provisions of Procedure of the Indian Arbitration & Conciliation Act, 1996, including any amendments thereof. The arbitration tribunal shall be composed of a sole arbitrator, and such arbitrator shall be appointed mutually by the Parties. The place of arbitration shall be Bangalore, India and the arbitration proceedings shall take place in the English language.

20. 	Additional oral agreements do not exist. All modifications and amendments to this Agreement must be made in writing.

21. 	The Agreement and/or any rights arising from it cannot be assigned or otherwise transferred either wholly or in part, without the written consent of the other Party.

            For Party 1:                                                  For Party 2:

            _______________________                                       _______________________
            Signature                                                     Signature

            Name: ___________________                                     Name: ___________________
            Designation: _____________                                    Designation: _____________
            Date: ___________________                                     Date: ___________________'
);

-- Insert Consulting Agreement template
INSERT INTO document_templates (title, description, template_type, template_content)
VALUES (
  'Consulting Agreement',
  'A standard consulting agreement for professional services.',
  'consulting',
  'CONSULTING AGREEMENT

THIS CONSULTING AGREEMENT (the "Agreement") is made and entered into as of {{effectiveDate}} (the "Effective Date"), by and between:

{{clientName}}, with its principal place of business at {{clientAddress}} (hereinafter referred to as the "Client")

AND

{{consultantName}}, with its principal place of business at {{consultantAddress}} (hereinafter referred to as the "Consultant").

WHEREAS, the Client desires to retain the Consultant to provide certain services as set forth in this Agreement; and

WHEREAS, the Consultant is willing to perform such services for the Client on the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties hereto agree as follows:

1. SERVICES

The Consultant shall provide the following services to the Client (collectively, the "Services"):

{{servicesDescription}}

The Consultant shall perform the Services with reasonable care and skill in accordance with generally accepted professional standards.

2. TERM

This Agreement shall commence on the Effective Date and shall continue for a period of {{termDuration}} months, unless earlier terminated in accordance with Section 8 of this Agreement (the "Term").

3. COMPENSATION

In consideration for the Services performed by the Consultant, the Client shall pay the Consultant a fee of {{compensationAmount}} per {{compensationPeriod}} (the "Fee"). The Fee shall be paid to the Consultant within {{paymentTerms}} days of receipt of an invoice from the Consultant.

4. EXPENSES

The Client shall reimburse the Consultant for all reasonable and necessary expenses incurred by the Consultant in connection with the performance of the Services, provided that such expenses are approved in advance by the Client and are supported by appropriate documentation.

5. INDEPENDENT CONTRACTOR STATUS

The Consultant is an independent contractor and not an employee of the Client. The Consultant shall be responsible for all taxes, insurance, and other obligations related to the Consultant''s business operations.

6. CONFIDENTIALITY

The Consultant acknowledges that during the performance of the Services, the Consultant may have access to certain confidential and proprietary information of the Client. The Consultant agrees to maintain the confidentiality of such information and not to disclose it to any third party without the prior written consent of the Client.

7. INTELLECTUAL PROPERTY

All intellectual property rights in any work product created by the Consultant in the course of providing the Services shall be owned by the Client. The Consultant hereby assigns to the Client all such intellectual property rights.

8. TERMINATION

Either party may terminate this Agreement at any time by giving {{terminationNotice}} days'' written notice to the other party. In the event of termination, the Client shall pay the Consultant for all Services performed up to the date of termination.

9. LIMITATION OF LIABILITY

The Consultant''s liability under this Agreement shall be limited to the total amount of fees paid by the Client to the Consultant under this Agreement. In no event shall the Consultant be liable for any indirect, incidental, special, or consequential damages.

10. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of {{jurisdiction}}, without giving effect to any choice of law or conflict of law provisions.

11. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.

12. AMENDMENTS

This Agreement may only be amended or modified by a written instrument executed by both parties.

13. NOTICES

All notices required or permitted under this Agreement shall be in writing and shall be deemed effective upon personal delivery or upon deposit in the mail, postage prepaid, registered or certified, addressed to the party at the address set forth above.

14. ASSIGNMENT

Neither party may assign this Agreement or any rights or obligations hereunder without the prior written consent of the other party.

15. SEVERABILITY

If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.

CLIENT:                                                  CONSULTANT:

_______________________                                  _______________________
Signature                                                Signature

Name: ___________________                                Name: ___________________
Title: ___________________                               Title: ___________________
Date: ___________________                                Date: ___________________'
);

-- Insert Employment Agreement template
INSERT INTO document_templates (title, description, template_type, template_content)
VALUES (
  'Employment Agreement',
  'A standard employment agreement for hiring employees.',
  'employment',
  'EMPLOYMENT AGREEMENT

THIS EMPLOYMENT AGREEMENT (the "Agreement") is made and entered into as of {{effectiveDate}} (the "Effective Date"), by and between:

{{employerName}}, with its principal place of business at {{employerAddress}} (hereinafter referred to as the "Employer")

AND

{{employeeName}}, residing at {{employeeAddress}} (hereinafter referred to as the "Employee").

WHEREAS, the Employer desires to employ the Employee on the terms and conditions set forth herein; and

WHEREAS, the Employee desires to accept such employment on such terms and conditions;

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties hereto agree as follows:

1. EMPLOYMENT

The Employer hereby employs the Employee, and the Employee hereby accepts employment with the Employer, upon the terms and conditions set forth in this Agreement.

2. POSITION AND DUTIES

The Employee shall serve as {{position}} and shall perform such duties as are customarily performed by someone in such position and such other duties as may be assigned from time to time by the Employer.

3. TERM

This Agreement shall commence on the Effective Date and shall continue until terminated in accordance with the provisions of Section 8 of this Agreement.

4. COMPENSATION

The Employer shall pay the Employee a base salary of {{baseSalary}} per {{salaryPeriod}} (the "Base Salary"), payable in accordance with the Employer''s standard payroll practices. The Base Salary shall be subject to review and adjustment by the Employer from time to time.

5. BENEFITS

The Employee shall be entitled to participate in all employee benefit plans, practices, and programs maintained by the Employer, as in effect from time to time, on the same basis as other similarly situated employees of the Employer.

6. WORKING HOURS AND LOCATION

The Employee shall work {{workingHours}} hours per week at {{workLocation}} or such other location as may be designated by the Employer from time to time.

7. VACATION AND LEAVE

The Employee shall be entitled to {{vacationDays}} days of paid vacation per year, in addition to public holidays and other leave as provided by the Employer''s policies.

8. TERMINATION

This Agreement may be terminated:
(a) By the Employer for cause, effective immediately upon written notice to the Employee;
(b) By the Employer without cause, upon {{employerTerminationNotice}} days'' written notice to the Employee;
(c) By the Employee, upon {{employeeTerminationNotice}} days'' written notice to the Employer; or
(d) By mutual agreement of the parties.

9. CONFIDENTIALITY

The Employee acknowledges that during the course of employment, the Employee may have access to confidential and proprietary information of the Employer. The Employee agrees to maintain the confidentiality of such information and not to disclose it to any third party without the prior written consent of the Employer.

10. INTELLECTUAL PROPERTY

All intellectual property rights in any work created by the Employee in the course of employment shall be owned by the Employer. The Employee hereby assigns to the Employer all such intellectual property rights.

11. NON-COMPETITION

During the term of this Agreement and for a period of {{nonCompetePeriod}} months thereafter, the Employee shall not, directly or indirectly, engage in any business that competes with the Employer.

12. NON-SOLICITATION

During the term of this Agreement and for a period of {{nonSolicitPeriod}} months thereafter, the Employee shall not, directly or indirectly, solicit any employee, contractor, or customer of the Employer.

13. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of {{jurisdiction}}, without giving effect to any choice of law or conflict of law provisions.

14. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements and understandings, whether oral or written.

15. AMENDMENTS

This Agreement may only be amended or modified by a written instrument executed by both parties.

16. NOTICES

All notices required or permitted under this Agreement shall be in writing and shall be deemed effective upon personal delivery or upon deposit in the mail, postage prepaid, registered or certified, addressed to the party at the address set forth above.

17. SEVERABILITY

If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the Effective Date.

EMPLOYER:                                               EMPLOYEE:

_______________________                                 _______________________
Signature                                               Signature

Name: ___________________                               Name: ___________________
Title: ___________________                              
Date: ___________________                               Date: ___________________'
);

-- Enable Row Level Security
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for document_templates
CREATE POLICY "Anyone can view document templates" 
ON document_templates FOR SELECT 
USING (true);

-- Create policies for generated_documents
CREATE POLICY "Users can view their own generated documents" 
ON generated_documents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated documents" 
ON generated_documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generated documents" 
ON generated_documents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated documents" 
ON generated_documents FOR DELETE 
USING (auth.uid() = user_id);
