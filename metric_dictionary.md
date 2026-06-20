# India Post DSS — Metric Dictionary

This metric dictionary provides the exact mathematical formulas, inputs, database fields, and sources for every calculated value displayed across the India Post Decision Support System (DSS).

---

## 1. Demographics & Baseline Metrics

### 1.1 Literacy Rate (Village & Location Level)
* **Definition**: The percentage of literate individuals within the total population of a selected location.
* **Mathematical Formula**:
  $$\text{Literacy Rate} = \left( \frac{\text{Male Literate} + \text{Female Literate}}{\text{Total Population}} \right) \times 100$$
  $$\text{Literacy Rate} = \left( \frac{(\text{totM} \times \frac{\text{mLit}}{100}) + (\text{totF} \times \frac{\text{fLit}}{100})}{\text{totP}} \right) \times 100$$
* **Inputs & Database Fields**:
  - `totM` (Male Population) $\rightarrow$ `demographic_tamilnadu.totM`
  - `totF` (Female Population) $\rightarrow$ `demographic_tamilnadu.totF`
  - `mLit` (Male Literacy %) $\rightarrow$ `demographic_tamilnadu.mLit`
  - `fLit` (Female Literacy %) $\rightarrow$ `demographic_tamilnadu.fLit`
  - `totP` (Total Population) $\rightarrow$ `demographic_tamilnadu.totP`
* **Source**: Census 2011 Primary Census Abstract (PCA)

### 1.2 Workforce Participation Rate
* **Definition**: The percentage of active workers (both main and marginal) relative to the total population.
* **Mathematical Formula**:
  $$\text{Workforce Participation Rate} = \left( \frac{\text{totWorkP}}{\text{totP}} \right) \times 100$$
* **Inputs & Database Fields**:
  - `totWorkP` (Total Work Population) $\rightarrow$ `demographic_tamilnadu.totWorkP`
  - `totP` (Total Population) $\rightarrow$ `demographic_tamilnadu.totP`
* **Source**: Census 2011 PCA

---

## 2. Decision Support System (DSS) Suitability Indices

All suitability indices are calculated dynamically by the rules engine (`src/lib/recommendationEngine.js`) and capped at 100.

### 2.1 Sukanya Samriddhi Account (SSA) Opportunity Index
* **Definition**: Suitability index for initiating a savings drive targeting households with young girls.
* **Mathematical Formula**:
  $$\text{SSA Index} = \min\left(100, \text{round}\left(45 + \frac{\text{population717}}{\text{totP}} \times 300\right)\right)$$
* **Inputs & Database Fields**:
  - `population717` (School-age children) $\rightarrow$ `demographic_tamilnadu.population717`
  - `totP` (Total Population) $\rightarrow$ `demographic_tamilnadu.totP`

### 2.2 Kisan Vikas Patra (KVP) Opportunity Index
* **Definition**: Suitability index for agricultural savings and long-term capital doubling campaigns.
* **Mathematical Formula**:
  $$\text{KVP Index} = \min\left(100, \text{round}\left(45 + \frac{\text{agriWorkers}}{\text{totP}} \times 200\right)\right)$$
  Where:
  $$\text{agriWorkers} = \text{mainClP} + \text{mainAlP} + \text{margClP} + \text{margAlP}$$
* **Inputs & Database Fields**:
  - `mainClP` (Main Cultivators) $\rightarrow$ `demographic_tamilnadu.mainClP`
  - `mainAlP` (Main Agricultural Labor) $\rightarrow$ `demographic_tamilnadu.mainAlP`
  - `margClP` (Marginal Cultivators) $\rightarrow$ `demographic_tamilnadu.margClP`
  - `margAlP` (Marginal Agricultural Labor) $\rightarrow$ `demographic_tamilnadu.margAlP`
  - `totP` (Total Population) $\rightarrow$ `demographic_tamilnadu.totP`

### 2.3 Senior Citizens Savings Scheme (SCSS) Opportunity Index
* **Definition**: Suitability index for retirement savings and quarterly yield payouts.
* **Mathematical Formula**:
  $$\text{SCSS Index} = \min\left(100, \text{round}\left(30 + \frac{\text{population60Plus}}{\text{totP}} \times 400\right)\right)$$
* **Inputs & Database Fields**:
  - `population60Plus` (Seniors aged 60+) $\rightarrow$ `demographic_tamilnadu.population60Plus`
  - `totP` (Total Population) $\rightarrow$ `demographic_tamilnadu.totP`

### 2.4 Public Provident Fund (PPF) Opportunity Index
* **Definition**: Suitability index for compound tax-saving long-term investments.
* **Mathematical Formula**:
  $$\text{PPF Index} = \min\left(100, \text{round}\left(30 + \frac{\text{salariedWorkers}}{\text{totP}} \times 400 + \text{literacyRate} \times 0.3\right)\right)$$
  Where:
  $$\text{salariedWorkers} = \text{mainOtP} + \text{margOtP}$$
* **Inputs & Database Fields**:
  - `mainOtP` (Main Other Workers) $\rightarrow$ `demographic_tamilnadu.mainOtP`
  - `margOtP` (Marginal Other Workers) $\rightarrow$ `demographic_tamilnadu.margOtP`
  - `totP` (Total Population) $\rightarrow$ `demographic_tamilnadu.totP`

---

## 3. Campaign Impact & Forecasting Metrics

### 3.1 Expected Campaign Impact (Eligible Citizens Target)
* **Definition**: The estimated volume of new enrollments achievable during an intensive 10-day campaign.
* **Conversion Rate Assumptions (Based on Erode District Pilot Campaigns)**:
  - **SSA (Sukanya Samriddhi Account)**: 15% of school-age children target segment.
  - **KVP (Kisan Vikas Patra)**: 12% of agricultural workforce segment.
  - **SCSS (Senior Citizens Savings Scheme)**: 20% of senior population post-retirement.
  - **PPF (Public Provident Fund)**: 10% of salaried professionals seeking tax savings.
* **Mathematical Formulas**:
  - **SSA**: $\text{Expected Impact} = \text{population717} \times 0.15$
  - **KVP**: $\text{Expected Impact} = \text{agriWorkers} \times 0.12$
  - **SCSS**: $\text{Expected Impact} = \text{population60Plus} \times 0.20$
  - **PPF**: $\text{Expected Impact} = \text{salariedWorkers} \times 0.10$

---

## 4. Head Post Office Dashboard KPIs

Calculated dynamically from the `HeadPostData` collection containing target sub-office branch registries:

### 4.1 Campaign Reach
* **Definition**: The total number of eligible citizens across all branch offices (BOs) under the selected Sub-Post Office matching the selected scheme.
* **Mathematical Formula**:
  $$\text{Campaign Reach} = \sum (\text{Eligible Count per BO})$$
* **Inputs & Database Fields**:
  - Distinct registry rows matching the selected scheme eligibility criteria $\rightarrow$ `HeadPostData.length` (after eligibility filter).

### 4.2 Enrollment Conversion %
* **Definition**: The percentage of eligible citizens who have successfully registered the policy out of the total campaign reach.
* **Mathematical Formula**:
  $$\text{Enrollment Conversion} = \left( \frac{\text{Total Schemes Registered}}{\text{Total Eligible Persons}} \right) \times 100$$
* **Inputs & Database Fields**:
  - Count of items matching selected scheme where enrollment flag is `1` $\rightarrow$ `HeadPostData.scheme1 / scheme2 / scheme3`

### 4.3 Branch Readiness
* **Definition**: The total count of active branch post offices (BOs) participating in the regional campaign.
* **Mathematical Formula**:
  $$\text{Branch Readiness} = \text{Count of unique BranchPostOffice keys}$$
* **Inputs & Database Fields**:
  - Count of unique branch values retrieved $\rightarrow$ `HeadPostData.BranchPostOffice`

### 4.4 Opportunity Potential (Pending Registrations)
* **Definition**: The absolute volume of eligible individuals who remain unregistered.
* **Mathematical Formula**:
  $$\text{Opportunity Potential} = \text{Total Eligible} - \text{Total Schemes Registered}$$
