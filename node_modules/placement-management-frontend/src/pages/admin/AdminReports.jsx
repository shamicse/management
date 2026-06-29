import { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminReports = () => {
  const [companyReport, setCompanyReport] = useState([]);
  const [branchReport, setBranchReport] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/admin/reports/company'),
      api.get('/admin/reports/branch'),
    ]).then(([companyRes, branchRes]) => {
      setCompanyReport(companyRes.data);
      setBranchReport(branchRes.data);
    });
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Company-wise and branch-wise placement statistics</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="card-title">Company-wise Report</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Total Applications</th>
                <th>Shortlisted</th>
                <th>Selected</th>
                <th>Rejected</th>
              </tr>
            </thead>
            <tbody>
              {companyReport.map((row) => (
                <tr key={row._id}>
                  <td>{row._id}</td>
                  <td>{row.totalApplications}</td>
                  <td>{row.shortlisted}</td>
                  <td>{row.selected}</td>
                  <td>{row.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Branch-wise Report</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Branch</th>
                <th>Total Applications</th>
                <th>Shortlisted</th>
                <th>Selected</th>
                <th>Avg CGPA</th>
              </tr>
            </thead>
            <tbody>
              {branchReport.map((row) => (
                <tr key={row._id}>
                  <td>{row._id}</td>
                  <td>{row.totalApplications}</td>
                  <td>{row.shortlisted}</td>
                  <td>{row.selected}</td>
                  <td>{row.avgCgpa?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminReports;
