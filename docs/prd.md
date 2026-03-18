# Pese - Product Requirements Document (PRD)

| Status | Draft |
| --- | --- |
| Author | Pese Engineering Team |
| Version | 1.0 (MVP focus) |
| Last Updated | 2026-03-18 |

---

## 1. Visão Geral (Overview)

O **pese** é um aplicativo móvel projetado para simplificar o monitoramento de indicadores de saúde críticos: peso, glicemia e hidratação. O foco está na facilidade de uso diário, proporcionando uma experiência "Premium" e "Clean" sem a complexidade de aplicativos tradicionais de saúde.

## 2. Púbico Alvo

- Pessoas monitorando perda ou ganho de peso.
- Diabéticos ou pré-diabéticos que precisam de registros frequentes de glicose.
- Indivíduos focados em melhorar a hidratação diária.
- Usuários que desejam compartilhar dados precisos com seus profissionais de saúde (V2).

---

## 3. Requisitos Funcionais (MVP)

### 3.1 Registros (Input)
- **Peso**: Registro simplificado com data/hora automática e campo numérico para o peso.
- **Água**: Registro rápido de consumo (em ml) com hora automática.
- **Glicose**: Registro com categorias obrigatórias (jejum, pré-refeição, pós-refeição, aleatória) e campo de observação opcional.

### 3.2 Visualização (Dashboard)
- Resumo do último registro de cada categoria.
- Diferença percentual/absoluta entre o último registro e o anterior.
- Gráficos de barra/linha para os últimos 7 e 30 dias (peso, glicose e água).
- Médias semanais calculadas dinamicamente.

### 3.3 Metas e Configurações
- Definição de meta de peso.
- Definição de faixa alvo de glicose (mínimo e máximo).
- Lembretes diários configuráveis para registro.

---

## 4. Requisitos Não-Funcionais

- **Performance**: Inicialização rápida (< 2s) e transições suaves entre telas (60fps).
- **Offline-First**: Armazenamento local (AsyncStorage) para funcionamento sem internet.
- **Estética**: Design premium utilizando Tailwind CSS/NativeWind, com foco em legibilidade e botões grandes.
- **Segurança**: Dados de saúde sensíveis armazenados localmente e criptografados (futuro).

---

## 5. Stack Técnica

- **Framework**: React Native CLI (v0.7x) - *Sem Expo*.
- **Estilização**: NativeWind (Tailwind CSS for RN) para UI rápida e consistente.
- **Navegação**: React Navigation (Stack e Tabs).
- **Dados Local**: AsyncStorage.
- **Gráficos**: React-native-chart-kit.
- **Animações**: React-native-reanimated.
- **Ícones**: Lucide React Native.

---

## 6. Roadmap

### Fase 1: MVP (Lançamento Inicial)
- CAD de peso, água e glicose.
- Dashboard simplificado com gráficos de 7/30 dias.
- Histórico completo em lista.

### Fase 2: V2 (Engajamento e Exportação)
- Tags de refeição detalhadas.
- Correlação com exercícios físicos.
- Exportar relatórios em PDF/CSV para médicos.
- Autenticação e Sincronização em Nuvem.

### Fase 3: V3 (Aprofundamento de Dados)
- Campos avançados de peso (percentual de gordura, medidas de cintura).
- Tendências preditivas via IA.
- Dashboards especializados por categoria.
