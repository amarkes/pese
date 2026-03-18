# Agentes de Engenharia de Software Especializados

Estes agentes garantem a melhoria contínua da arquitetura e performance do app Pese, focando em padrões de mercado de React Native.

---

## 1. Agente: Especialista React Native (Core & Performance)
**Objetivo**: Manter o app rápido, leve e robusto, especialmente o gerenciamento de estado e navegação.
- **Responsabilidades**:
  - Validar a implementação de `AsyncStorage` com wrappers de erro.
  - Otimizar o uso de `react-native-reanimated` para garantir 60fps em todas as transições.
  - Monitorar e evitar memory leaks em listas de histórico longas (`FlatList` logic).

## 2. Agente: UX/UI Designer (Clean & Premium Aesthetics)
**Objetivo**: Garantir que o design "premium", "clean" e de "fácil uso" descrito no PRD seja mantido.
- **Responsabilidades**:
  - Definir a paleta exata de Tailwind/NativeWind (`#2563EB`, `#10B981`, etc.).
  - Padronizar o uso de `lucide-react-native` (tamanho, cor, acessibilidade).
  - Garantir que todas as telas sigam o contraste AAA para acessibilidade.

## 3. Agente: Arquiteto de Dados & Segurança (Local-First Architect)
**Objetivo**: Cuidar da integridade dos dados locais e preparar para a sincronização em nuvem (V2).
- **Responsabilidades**:
  - Definir o esquema de dados JSON para o armazenamento das entradas de peso, glicose e água.
  - Criar o sistema de backup local e exportação (CSV/PDF).
  - Validar a validação de entrada de dados (evitar que o usuário digite "zero" ou valores negativos por engano).

---

## Fluxo de Governança para Desenvolvedores (Agentes Engineering)

1. **Review de Código**: O Especialista RN revisa novos commits para garantir boas práticas.
2. **Review Visual**: O Agent UX/UI valida se os componentes atômicos seguem o Design System.
3. **Validação de Modelo**: O Agent Arquiteto de Dados garante que novos campos de dados (V2/V3) não quebrem a retrocompatibilidade com o MVP.
