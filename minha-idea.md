# Nome provisório: pese

## Um app simples, bonito e com evolução fácil.

## Tecnologias
- React native cli (sem expo)
- Async storage
- UI: nativewind/tailwind rn
- Navegação: react-navigation
- Cores
    - Primária: #2563EB (azul forte / blue-600)
    - Secundária: #10B981 (verde esmeralda)
    - Background: #F8FAFC (cinza bem claro)
    - Cards: #FFFFFF
    - Texto principal: #0F172A
    - Texto secundário: #64748B
    - Sucesso: #22C55E
    - Atenção: #F59E0B
    - Alerta: #EF4444
- Sensação
    - Clean
    - Profissional
    - App de saúde premium
    - Fácil de usar no dia a dia
- Gráficos: react-native-chart-kit
- Animações: react-native-reanimated
- Gestures: react-native-gesture-handler
- Icons: lucide-react-native



1. # MVP (versão 1)

- Cadastro de em páginas separadas:
    - peso
        - dia automatico
        - hora automatico
        - peso
    - bebeu agua
        - hora automatico
        - quantidade
    - glicose com tipos para:
        - jejum
        - pré-refeição
        - pós-refeição
        - aleatória
        - observação

- Lista de histórico
- Gráfico peso 7/30 dias
- Gráfico glicose 7/30 dias
- Gráfico de ingestão de água 7/30 dias
- Média semanal
- Diferença do último registro vs anterior
- Meta de peso
- Faixa alvo de glicose
- Lembrete diário

2. # V2

- Tags de refeição
- Correlação com treino
- Exportar PDF/CSV
- Login
- Compartilhar com médico/nutri


3. # V3 Funcionalidades adicionais
- Campos do peso

    - peso
    - percentual gordura (opcional)
    - cintura (opcional)
    - observação

- Campos da glicose

    - valor
    - momento:
        - jejum
        - antes da refeição
        - 1h após refeição
        - 2h após refeição
        - antes de dormir
    - observação
    - refeição relacionada (opcional)

- Dashboard

    - Último peso
    - Variação 7 dias
    - Média glicose jejum
    - Média glicose pós-refeição
    - Maior/menor valor
    - Tendência (subindo / descendo)

