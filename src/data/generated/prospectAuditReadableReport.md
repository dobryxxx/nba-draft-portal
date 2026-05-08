# Relatorio de Auditoria dos Prospectos

Gerado em: 07/05/2026, 15:59:01

## Resumo

- Total de prospectos auditados: **45**
- Match alto: **40**
- Match medio: **3**
- Match baixo: **0**
- Sem match externo: **2**
- Prospectos limpos: **24**
- Prospectos com alerta: **14**
- Prospectos criticos: **0**

> Este relatorio apenas sugere revisoes. Nenhuma alteracao foi aplicada a base principal.

## Prospectos Problematicos e Correcoes Sugeridas

### #31 - Isiah Harwell

- **Score de auditoria:** 44/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** SG / SLEEPER
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - measurements - height**: Altura interna diverge da fonte externa.
  - Evidencias: Interno: 6'4" | Externo: 78 in
  - Sugestao: Considerar 6'6".
- **WARNING - stats - stats.threep**: 3PT% interno diverge bastante da fonte externa.
  - Evidencias: Interno: 37.8 | Externo: 27.1
  - Sugestao: Revisar 3PT% para 27.1.
- **WARNING - stats - stats.ts**: TS% interno diverge da fonte externa.
  - Evidencias: Interno: 59.4 | Externo: 39.66
  - Sugestao: Revisar TS% para 39.66.
- **WARNING - scouting - scouting.strengths**: Scouting destaca arremesso, mas dados externos nao sustentam.
  - Evidencias: Shooting trait: 0
  - Sugestao: Revisar strength de shooting.

**Correcoes sugeridas para revisao manual**

- Stats.threep: Revisar 3PT% para 27.1.
- Stats.ts: Revisar TS% para 39.66.
- Nota: measurements: Considerar 6'6".
- Nota: stats: Revisar 3PT% para 27.1.
- Nota: stats: Revisar TS% para 39.66.
- Nota: scouting: Revisar strength de shooting.

### #19 - Karim Lopez

- **Score de auditoria:** 58/100
- **Severidade:** warning
- **Match externo:** none
- **Posicao/Tier atual:** SF/PF / MID_1ST
- **Fontes com match:** nenhuma

**Problemas encontrados**

- **WARNING - match**: Nenhum match externo encontrado.
- **WARNING - identity - name**: Jogador nao encontrado nas fontes externas.
  - Sugestao: Revisar nome/escola ou adicionar alias manual.
- **WARNING - position - position**: Big sem indicadores externos claros de rebote/protecao de aro.
  - Evidencias: Rebounding: 0 | Rim protection: 0
  - Sugestao: Revisar posicao ou papel projetado.

**Correcoes sugeridas para revisao manual**

- Posicao: Revisar posicao ou papel projetado.
- Nota: identity: Revisar nome/escola ou adicionar alias manual.
- Nota: position: Revisar posicao ou papel projetado.

### #44 - Alexandros Samodurov

- **Score de auditoria:** 66/100
- **Severidade:** warning
- **Match externo:** medium
- **Posicao/Tier atual:** PF/C / SLEEPER
- **Fontes com match:** profile

**Problemas encontrados**

- **INFO - missing_data - wingspan**: Campo ausente: wingspan.
- **INFO - identity - team**: Escola/time externo diferente da base interna.
  - Evidencias: Interno: Panathinaikos | Externo: PAN
  - Sugestao: Revisar se houve transferencia ou alias de escola.
- **INFO - missing_data - wingspan**: Envergadura ausente na base interna.
- **INFO - stats - rank**: BPM externo alto para rank baixo.
  - Evidencias: BPM externo: 10.64 | Rank: #44
  - Sugestao: Revisar se o board esta subestimando impacto.
- **WARNING - scouting - scouting.strengths**: Scouting destaca arremesso, mas dados externos nao sustentam.
  - Evidencias: Shooting trait: 6
  - Sugestao: Revisar strength de shooting.

**Correcoes sugeridas para revisao manual**

- Nota: identity: Revisar se houve transferencia ou alias de escola.
- Nota: stats: Revisar se o board esta subestimando impacto.
- Nota: scouting: Revisar strength de shooting.

### #43 - Sergio de Larrea

- **Score de auditoria:** 71/100
- **Severidade:** warning
- **Match externo:** medium
- **Posicao/Tier atual:** PG/SG / SLEEPER
- **Fontes com match:** profile

**Problemas encontrados**

- **INFO - missing_data - wingspan**: Campo ausente: wingspan.
- **INFO - identity - team**: Escola/time externo diferente da base interna.
  - Evidencias: Interno: Valencia | Externo: VAL
  - Sugestao: Revisar se houve transferencia ou alias de escola.
- **INFO - missing_data - wingspan**: Envergadura ausente na base interna.
- **WARNING - stats - stats.ts**: TS% interno diverge da fonte externa.
  - Evidencias: Interno: 60.5 | Externo: 51.1
  - Sugestao: Revisar TS% para 51.1.

**Correcoes sugeridas para revisao manual**

- Stats.ts: Revisar TS% para 51.1.
- Nota: identity: Revisar se houve transferencia ou alias de escola.
- Nota: stats: Revisar TS% para 51.1.

### #15 - Tounde Yessoufou

- **Score de auditoria:** 72/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** SF / MID_1ST
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - measurements - height**: Altura interna diverge da fonte externa.
  - Evidencias: Interno: 6'7" | Externo: 77 in
  - Sugestao: Considerar 6'5".
- **WARNING - scouting - scouting.strengths**: Scouting destaca arremesso, mas dados externos nao sustentam.
  - Evidencias: Shooting trait: 18
  - Sugestao: Revisar strength de shooting.

**Correcoes sugeridas para revisao manual**

- Nota: measurements: Considerar 6'5".
- Nota: scouting: Revisar strength de shooting.

### #27 - Chris Cenac Jr.

- **Score de auditoria:** 72/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** PF / MID_1ST
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - measurements - height**: Altura interna diverge da fonte externa.
  - Evidencias: Interno: 6'9" | Externo: 83 in
  - Sugestao: Considerar 6'11".
- **WARNING - scouting - scouting.strengths**: Scouting destaca arremesso, mas dados externos nao sustentam.
  - Evidencias: Shooting trait: 19
  - Sugestao: Revisar strength de shooting.

**Correcoes sugeridas para revisao manual**

- Nota: measurements: Considerar 6'11".
- Nota: scouting: Revisar strength de shooting.

### #36 - Matthew Able

- **Score de auditoria:** 72/100
- **Severidade:** warning
- **Match externo:** none
- **Posicao/Tier atual:** SF / SLEEPER
- **Fontes com match:** nenhuma

**Problemas encontrados**

- **WARNING - match**: Nenhum match externo encontrado.
- **WARNING - identity - name**: Jogador nao encontrado nas fontes externas.
  - Sugestao: Revisar nome/escola ou adicionar alias manual.

**Correcoes sugeridas para revisao manual**

- Nota: identity: Revisar nome/escola ou adicionar alias manual.

### #39 - Elliot Cadeau

- **Score de auditoria:** 76/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** PG / SLEEPER
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **INFO - missing_data - wingspan**: Campo ausente: wingspan.
- **INFO - missing_data - wingspan**: Envergadura ausente na base interna.
- **WARNING - scouting - scouting.strengths**: Scouting destaca arremesso, mas dados externos nao sustentam.
  - Evidencias: Shooting trait: 36
  - Sugestao: Revisar strength de shooting.

**Correcoes sugeridas para revisao manual**

- Nota: scouting: Revisar strength de shooting.

### #40 - Jeremy Fears Jr.

- **Score de auditoria:** 80/100
- **Severidade:** info
- **Match externo:** high
- **Posicao/Tier atual:** PG / SLEEPER
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **INFO - missing_data - wingspan**: Campo ausente: wingspan.
- **INFO - identity - team**: Escola/time externo diferente da base interna.
  - Evidencias: Interno: Michigan State | Externo: Michigan St.
  - Sugestao: Revisar se houve transferencia ou alias de escola.
- **INFO - missing_data - wingspan**: Envergadura ausente na base interna.
- **INFO - stats - rank**: BPM externo alto para rank baixo.
  - Evidencias: BPM externo: 10.19 | Rank: #40
  - Sugestao: Revisar se o board esta subestimando impacto.

**Correcoes sugeridas para revisao manual**

- Nota: identity: Revisar se houve transferencia ou alias de escola.
- Nota: stats: Revisar se o board esta subestimando impacto.

### #21 - Amari Allen

- **Score de auditoria:** 86/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** SF/PF / MID_1ST
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - scouting - scouting.strengths**: Scouting destaca arremesso, mas dados externos nao sustentam.
  - Evidencias: Shooting trait: 33
  - Sugestao: Revisar strength de shooting.

**Correcoes sugeridas para revisao manual**

- Nota: scouting: Revisar strength de shooting.

### #23 - Christian Anderson

- **Score de auditoria:** 86/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** PG / MID_1ST
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - measurements - height**: Altura interna diverge da fonte externa.
  - Evidencias: Interno: 6'6" | Externo: 75 in
  - Sugestao: Considerar 6'3".

**Correcoes sugeridas para revisao manual**

- Nota: measurements: Considerar 6'3".

### #29 - Milan Momcilovic

- **Score de auditoria:** 86/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** PF / MID_1ST
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - position - position**: Big sem indicadores externos claros de rebote/protecao de aro.
  - Evidencias: Rebounding: 37 | Rim protection: 12
  - Sugestao: Revisar posicao ou papel projetado.

**Correcoes sugeridas para revisao manual**

- Posicao: Revisar posicao ou papel projetado.
- Nota: position: Revisar posicao ou papel projetado.

### #30 - Ebuka Okorie

- **Score de auditoria:** 86/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** SG/SF / SLEEPER
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - measurements - height**: Altura interna diverge da fonte externa.
  - Evidencias: Interno: 6'5" | Externo: 74 in
  - Sugestao: Considerar 6'2".

**Correcoes sugeridas para revisao manual**

- Nota: measurements: Considerar 6'2".

### #32 - Tyler Tanner

- **Score de auditoria:** 86/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** PG / SLEEPER
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - measurements - height**: Altura interna diverge da fonte externa.
  - Evidencias: Interno: 6'3" | Externo: 72 in
  - Sugestao: Considerar 6'0".

**Correcoes sugeridas para revisao manual**

- Nota: measurements: Considerar 6'0".

### #33 - Henri Veesaar

- **Score de auditoria:** 86/100
- **Severidade:** warning
- **Match externo:** high
- **Posicao/Tier atual:** C/PF / SLEEPER
- **Fontes com match:** profile, seasonLines, barttorvik, shotCreation

**Problemas encontrados**

- **WARNING - stats - stats.threep**: 3PT% interno diverge bastante da fonte externa.
  - Evidencias: Interno: 29.4 | Externo: 42.6
  - Sugestao: Revisar 3PT% para 42.6.

**Correcoes sugeridas para revisao manual**

- Stats.threep: Revisar 3PT% para 42.6.
- Nota: stats: Revisar 3PT% para 42.6.

## Tipos de Problemas Mais Frequentes

- missing_data: 14
- stats: 8
- identity: 7
- measurements: 6
- scouting: 6
- match: 2
- position: 2

## Proximo Passo Recomendado

1. Revisar primeiro os jogadores com score abaixo de 75.
2. Confirmar manualmente divergencias de altura/posicao antes de alterar o banco.
3. Para jogadores sem match externo, decidir se precisam de alias manual ou se realmente estao fora das bases externas.
4. Depois da revisao, aplicar mudancas em lote na base principal.