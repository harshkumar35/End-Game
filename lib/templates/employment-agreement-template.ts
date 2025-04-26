export const employmentAgreementTemplate = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            margin: 2.5cm;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
          }
          h2 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: bold;
          }
          p {
            margin-bottom: 15px;
            text-align: justify;
          }
          .section {
            margin-bottom: 20px;
          }
          .signature {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
          .signature-block {
            width: 45%;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 50px;
            margin-bottom: 10px;
          }
          .date-line {
            border-top: 1px solid #000;
            margin-top: 20px;
            margin-bottom: 10px;
            width: 60%;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>EMPLOYMENT AGREEMENT</h1>
        </div>
        
        <p>This Employment Agreement (the "Agreement") is entered into as of {{effectiveDate}} by and between:</p>
        
        <p><strong>{{employerName}}</strong> (hereinafter referred to as the "Employer"), and</p>
        <p><strong>{{employeeName}}</strong> (hereinafter referred to as the "Employee").</p>
        
        <div class="section">
          <h2>1. EMPLOYMENT</h2>
          <p>The Employer hereby employs the Employee, and the Employee hereby accepts employment with the Employer, on the terms and conditions set forth in this Agreement.</p>
        </div>
        
        <div class="section">
          <h2>2. POSITION AND DUTIES</h2>
          <p>The Employee shall be employed as {{position}}. The Employee shall perform such duties as are customarily performed by someone in such position and such other duties as may be assigned from time to time by the Employer.</p>
        </div>
        
        <div class="section">
          <h2>3. TERM</h2>
          <p>The Employee's employment under this Agreement shall commence on {{effectiveDate}} and shall continue until terminated in accordance with the provisions of this Agreement.</p>
        </div>
        
        <div class="section">
          <h2>4. COMPENSATION</h2>
          <p>The Employer shall pay the Employee a salary of {{baseSalary}}, subject to applicable withholding and other taxes.</p>
        </div>
        
        <div class="section">
          <h2>5. BENEFITS</h2>
          <p>The Employee shall be entitled to the following benefits:</p>
          <p>{{benefits}}</p>
        </div>
        
        <div class="section">
          <h2>6. WORK HOURS</h2>
          <p>{{workHours}}</p>
        </div>
        
        <div class="section">
          <h2>7. TERMINATION</h2>
          <p>{{terminationTerms}}</p>
        </div>
        
        <div class="section">
          <h2>8. CONFIDENTIALITY</h2>
          <p>The Employee acknowledges that during employment, the Employee may have access to confidential information belonging to the Employer. The Employee agrees to maintain the confidentiality of such information during and after the term of employment.</p>
        </div>
        
        <div class="section">
          <h2>9. GOVERNING LAW</h2>
          <p>This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}, without regard to its conflict of law principles.</p>
        </div>
        
        <div class="section">
          <h2>10. ENTIRE AGREEMENT</h2>
          <p>This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior negotiations, understandings, and agreements between the Parties.</p>
        </div>
        
        <div class="signature">
          <div class="signature-block">
            <p><strong>Employer:</strong></p>
            <div class="signature-line"></div>
            <p>Name: {{employerName}}</p>
            <p>Title: ____________________</p>
            <div class="date-line"></div>
            <p>Date</p>
          </div>
          
          <div class="signature-block">
            <p><strong>Employee:</strong></p>
            <div class="signature-line"></div>
            <p>Name: {{employeeName}}</p>
            <div class="date-line"></div>
            <p>Date</p>
          </div>
        </div>
      </body>
    </html>
`
