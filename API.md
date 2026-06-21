# 🛠️ LEONI SQLM Platform — Backend API Endpoints

This document outlines the REST API endpoints structured within the NestJS backend controllers. All filtering endpoints accept query parameters such as `?date=`, `?plant=`, or `?commodity=`.

---

## 📥 1. Data Ingestion & Imports Module
Manages the uploading and tracking of the raw Excel operational files (`Suppliers Kpi.xlsx`, `Supplier Evaluation .xlsx`, etc.).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/imports/upload` | Upload and parse an Excel data file into the database. |
| `GET` | `/imports` | Retrieve historical logs of all file imports. |

---

## 🏭 2. Supplier Profiles Module
Manages the core relational records of all mapped vendors.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/suppliers` | Fetch a list of all active suppliers. |
| `GET` | `/suppliers/:id` | Fetch full supplier profile, including all cross-referenced KPIs, Audits, Evaluations, and Release histories. |

---

## 📊 3. Suppliers KPI Module (`Suppliers Kpi.xlsx`)
Processes monthly indicator telemetry data (IpB, PPM, and Complaints).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/kpi` | Fetch filtered rows of raw KPI records. |
| `GET` | `/kpi/summary` | Fetch high-level summary metadata (Avg PPM, Avg IPB, total complaints count, and unique supplier totals). |
| `GET` | `/kpi/worst/complaints` | Fetch ranked list of the worst performing suppliers sorted by high numbers of complaints. |
| `GET` | `/kpi/worst/ppm` | Fetch ranked list of the worst performing suppliers sorted by high parts-per-million defect rates. |

---

## 🔍 4. Supplier Audits Module (`Supplier Audit 05-2026.xlsx`)
Tracks historical quality compliance testing, criteria matrices, and results.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/audits` | Fetch filtered lists of all historical audit records. |
| `GET` | `/audits/stats` | Fetch aggregate completion tracking states and metrics categorized by auditor classifications. |
| `GET` | `/audits/history/:supplierId` | Fetch time-series audit history data belonging to an individual supplier. |

---

## 🏆 5. Supplier Evaluation Module (`Supplier Evaluation .xlsx`)
Handles operational scoring sheets and categorical tier benchmarking.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/evaluations` | Fetch filtered logs of supplier evaluations. |
| `GET` | `/evaluations/benchmark` | Fetch summary aggregations of the overall supplier ABC rating distribution. |

---

## 🔓 6. Supplier Release Module (`Supplier Release.xlsx`)
Tracks regulatory operational sign-offs and security deployment parameters.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/releases` | Fetch filtered lists of supplier release authorization records. |
| `GET` | `/releases/stats` | Fetch global distribution analytics tracking release success states (Approved, Conditional, Blocked). |