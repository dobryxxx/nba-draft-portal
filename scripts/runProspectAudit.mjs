import fs from 'node:fs';
import path from 'node:path';
import { prospects } from '../src/data/prospects.js';
import { loadProspectExternalData } from '../src/utils/prospectExternalDataLoaders.ts';
import { generateProspectAuditReport } from '../src/utils/prospectDataAudit.ts';

const externalData = loadProspectExternalData();
const report = generateProspectAuditReport(prospects, externalData);
const outputDir = path.resolve('src/data/generated');
const outputPath = path.join(outputDir, 'prospectAuditReport.json');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  sources: [
    'api_profiles.json.gz',
    'api_season_lines.json',
    'barttorvik_complete_final.csv',
    'pbp_shot_creation.csv',
  ],
  topProblemProspects: report.results.slice(0, 10).map((item) => ({
    name: item.name,
    rank: item.rank,
    auditScore: item.auditScore,
    severity: item.severity,
    matchConfidence: item.matchConfidence,
    issues: item.issues.slice(0, 5),
  })),
  ...report,
}, null, 2));

console.log(JSON.stringify({
  outputPath,
  totalProspects: report.totalProspects,
  matchedHighConfidence: report.matchedHighConfidence,
  matchedMediumConfidence: report.matchedMediumConfidence,
  matchedLowConfidence: report.matchedLowConfidence,
  unmatched: report.unmatched,
  cleanProspects: report.cleanProspects,
  warningProspects: report.warningProspects,
  criticalProspects: report.criticalProspects,
  topProblemProspects: report.results.slice(0, 10).map((item) => ({
    name: item.name,
    score: item.auditScore,
    severity: item.severity,
    firstIssue: item.issues[0]?.message,
  })),
}, null, 2));
