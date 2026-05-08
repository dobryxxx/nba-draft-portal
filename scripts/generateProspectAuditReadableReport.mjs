import fs from 'node:fs';

const reportPath = 'src/data/generated/prospectAuditReport.json';
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const problematic = report.results
  .filter((prospect) => prospect.severity === 'warning' || prospect.severity === 'critical' || prospect.matchConfidence === 'none' || prospect.auditScore < 85)
  .sort((a, b) => a.auditScore - b.auditScore || (a.rank ?? 999) - (b.rank ?? 999));

const formatIssue = (issue) => {
  const rows = [`- **${issue.severity.toUpperCase()} - ${issue.type}${issue.field ? ` - ${issue.field}` : ''}**: ${issue.message}`];
  if (issue.evidence?.length) rows.push(`  - Evidencias: ${issue.evidence.join(' | ')}`);
  if (issue.suggestion) rows.push(`  - Sugestao: ${issue.suggestion}`);
  return rows.join('\n');
};

const lines = [
  '# Relatorio de Auditoria dos Prospectos',
  '',
  `Gerado em: ${new Date(report.generatedAt || Date.now()).toLocaleString('pt-BR')}`,
  '',
  '## Resumo',
  '',
  `- Total de prospectos auditados: **${report.totalProspects}**`,
  `- Match alto: **${report.matchedHighConfidence}**`,
  `- Match medio: **${report.matchedMediumConfidence}**`,
  `- Match baixo: **${report.matchedLowConfidence}**`,
  `- Sem match externo: **${report.unmatched}**`,
  `- Prospectos limpos: **${report.cleanProspects}**`,
  `- Prospectos com alerta: **${report.warningProspects}**`,
  `- Prospectos criticos: **${report.criticalProspects}**`,
  '',
  '> Este relatorio apenas sugere revisoes. Nenhuma alteracao foi aplicada a base principal.',
  '',
  '## Prospectos Problematicos e Correcoes Sugeridas',
  '',
];

for (const prospect of problematic) {
  lines.push(`### ${prospect.rank ? `#${prospect.rank} - ` : ''}${prospect.name}`);
  lines.push('');
  lines.push(`- **Score de auditoria:** ${prospect.auditScore}/100`);
  lines.push(`- **Severidade:** ${prospect.severity}`);
  lines.push(`- **Match externo:** ${prospect.matchConfidence}`);
  lines.push(`- **Posicao/Tier atual:** ${prospect.position || '-'} / ${prospect.tier || '-'}`);
  lines.push(`- **Fontes com match:** ${prospect.matchedSources?.length ? prospect.matchedSources.join(', ') : 'nenhuma'}`);
  lines.push('');
  lines.push('**Problemas encontrados**');
  lines.push('');
  const issues = (prospect.issues || []).filter((issue) => issue.severity !== 'info' || prospect.auditScore < 85).slice(0, 8);
  lines.push(issues.length ? issues.map(formatIssue).join('\n') : '- Sem problemas relevantes alem de campos informativos.');

  const notes = prospect.suggestions?.notes?.filter(Boolean) || [];
  if (prospect.suggestions && (prospect.suggestions.position || prospect.suggestions.tier || prospect.suggestions.stats || notes.length)) {
    lines.push('');
    lines.push('**Correcoes sugeridas para revisao manual**');
    lines.push('');
    if (prospect.suggestions.position) lines.push(`- Posicao: ${prospect.suggestions.position}`);
    if (prospect.suggestions.tier) lines.push(`- Tier: ${prospect.suggestions.tier}`);
    if (prospect.suggestions.stats) {
      for (const [key, value] of Object.entries(prospect.suggestions.stats)) lines.push(`- Stats.${key}: ${value}`);
    }
    for (const note of notes.slice(0, 5)) lines.push(`- Nota: ${note}`);
  }
  lines.push('');
}

const byType = {};
for (const prospect of report.results) {
  for (const issue of prospect.issues || []) byType[issue.type] = (byType[issue.type] || 0) + 1;
}

lines.push('## Tipos de Problemas Mais Frequentes');
lines.push('');
for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) lines.push(`- ${type}: ${count}`);
lines.push('');
lines.push('## Proximo Passo Recomendado');
lines.push('');
lines.push('1. Revisar primeiro os jogadores com score abaixo de 75.');
lines.push('2. Confirmar manualmente divergencias de altura/posicao antes de alterar o banco.');
lines.push('3. Para jogadores sem match externo, decidir se precisam de alias manual ou se realmente estao fora das bases externas.');
lines.push('4. Depois da revisao, aplicar mudancas em lote na base principal.');

const outputPath = 'src/data/generated/prospectAuditReadableReport.md';
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(JSON.stringify({ outputPath, problematic: problematic.length }, null, 2));
