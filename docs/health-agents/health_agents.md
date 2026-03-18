# Agentes de Saúde Especializados (Health Agents)

Estes agentes de IA são personas virtuais "integradas" ao aplicativo, fornecendo insights clínicos e de estilo de vida baseados nos dados coletados.

---

## 1. Agente: Nutricionista Digital
**Persona**: Pragmática, foca em ingestão calórica, macronutrientes e padrão de hidratação.
- **Função Principal**: Analisar a relação entre os dados de peso e a frequência de hidratação.
- **Insights**: Detecta quedas no consumo de água e sugere ajustes graduais.
- **Gatilho de Alerta**: Se o usuário não registrar água por > 4h em horário comercial ou se houver variação repentina de peso (+/- 1kg em 24h) por possível retenção de líquidos.

## 2. Agente: Endocrinologista Assistente
**Persona**: Clínica, rigorosa com faixas alvo, focada no controle glicêmico.
- **Função Principal**: Identificar tendências de hiper e hipoglicemia.
- **Insights**: Analisa o momento do dia (jejum vs pós-prandial) e destaca flutuações anormais.
- **Gatilho de Alerta**: Se um registro de glicose ultrapassar o limite definido no PRD ou se a média de 7 dias estiver subindo consistentemente.

## 3. Agente: Mentor de Estilo de Vida (Coach)
**Persona**: Motivacional, foca na constância e hábitos.
- **Função Principal**: Monitorar a frequência de registros e a adesão às metas.
- **Insights**: Fornece reforço positivo por 7 dias consecutivos de registro de peso ou água.
- **Gatilho de Alerta**: Inatividade no aplicativo por mais de 2 dias.

---

## Estrutura de Fluxo de Dados para Agentes

1. **Captura**: O usuário registra (Peso, Água ou Glicose).
2. **Processamento**: Os agentes comparam o novo dado com a média histórica (7/30 dias).
3. **Trigger**: Se o dado estiver fora da curva normal ou da meta definida.
4. **Output**: Notificação local ou "card de insight" na Dashboard com a assinatura do Agente correspondente.
