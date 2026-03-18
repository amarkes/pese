# Especificação de Estrutura: Módulos e Átomos (Atomic Design)

Esta estrutura reativa e modular segue o padrão de **Atomic Design** para componentes e **Feature-Driven Development (FDD)** para módulos de negócio.

---

## 1. Arquitetura de Módulos (Features)

Os módulos encapsulam a lógica de negócio separadamente para facilitar a manutenção e escalabilidade:

- **src/features/dashboard**: Dashboard principal, resumos e tendências.
- **src/features/weight**: Lógica de registro, meta e cálculo de peso.
- **src/features/glucose**: Tipos de medição, faixas alvo e histórico de glicose.
- **src/features/water**: Controle de ingestão, metas de hidratação e lembretes.
- **src/features/history**: Lista centralizada de todos os registros (peso, água, glicose).
- **src/features/settings**: Metas globais, notificações e preferências.

---

## 2. Componentes (Atomic Design)

Utilizando **NativeWind / Lucide Icons** para consistência.

### 2.1 Atoms (Átomos)
*Componentes indivisíveis e puros.*
- `<Button />`: Primário (`blue-600`), Secundário (`emerald-500`), Ghost.
- `<Typography />`: Títulos (`H1`, `H2`), Body, Caption.
- `<Input />`: Custom text/number input com focus styles Tailwind.
- `<Icon />`: Wrapper simplificado para `lucide-react-native`.
- `<Avatar />`: Pequeno indicador circular de usuário/perfil.
- `<ProgressBar />`: Para metas de água e peso.

### 2.2 Molecules (Moléculas)
*Combinam átomos para uma função específica.*
- `<FormField />`: Conjunto de Label + Input + ErrorMessage.
- `<RecordItem />`: Linha de histórico (Ícone + Valor + Data).
- `<QuickActionButton />`: Botão flutuante ou de atalho com ícone e texto.
- `<StatCard />`: Card pequeno com título e valor (ex: "Último Peso: 75kg").

### 2.3 Organisms (Organismos)
*Seções complexas da interface.*
- `<ChartSummary />`: Gráficos de 7/30 dias integrando `react-native-chart-kit`.
- `<RecordingForm />`: Formulários completos de entrada (Peso, Glicose ou Água).
- `<SectionListHistory />`: Lista agrupada por data com suporte a `SectionList`.
- `<ModalEntry />`: Modal de entrada rápida que aparece sobre o dashboard.

### 2.4 Templates (Templates)
*Estrutura de layout para páginas.*
- `<ScreenLayout />`: Com SafeAreaView, KeyboardAvoidingView e Padding flexível.
- `<AuthLayout />`: Para telas de login (V2).

---

## 3. Estrutura de Pastas Sugerida

```text
src/
├── assets/          # Imagens, fontes e ícones locais
├── components/      # Atomic Design (atoms, molecules, organisms)
├── components/atoms
├── components/molecules
├── components/organisms
├── screens/        # Módulos de negócio (weight, glucose, water, etc.)
│   └── weight/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── store/
├── navigation/      # Stack, Tabs, Drawer config
├── hooks/           # Custom hooks globais (useTheme, useData, etc.)
├── store/           # AsyncStorage wrappers e Context API / Zustand
├── theme/           # Configurações de cores, fontes e NativeWind styles
└── utils/           # Formatadores de data, cálculos matemáticos, etc.
```
