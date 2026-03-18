# Especificação de Páginas: Detalhamento de Telas (MVP)

Este documento especifica cada página principal do app Pese, focando no MVP (V1).

---

## 1. Dashboard (Módulo Principal)
A primeira tela do app, fornecendo um resumo rápido.

- **Componentes**:
  - `<SummaryCard />`: Card horizontal de "Último Peso", "Glicose Atual" (jejum/refeição) e "Total Água (0/2500ml)".
  - `<ChartLine />`: Gráfico simplificado de 7 dias para visualização imediata da tendência.
  - `<VariationLabel />`: Pequeno indicador visual (Verde/Vermelho) de "mais alto" ou "mais baixo" que o anterior.
  - `<QuickActionGrid />`: Botões grandes + icon (Lucide) para "Registrar Peso", "Registrar Glicose", "Registrar Água".
- **Comportamento**: Atualizar dados ao abrir a tela (onBlur/onFocus).

## 2. Registro de Peso (Input Page)
Uma página dedicada para um entrada sem atrito.

- **Componentes**:
  - `<BigNumberInput />`: Input focado automaticamente ao abrir a página, com teclado numérico.
  - `<DatePicker />`: Seletor de data/hora (padrão atual).
  - `<SaveButton />`: Botão primário com animação de sucesso (`react-native-reanimated`).
- **Comportamento**: Ao salvar, navegar de volta para Dashboard com um Toast informando a variação vs último peso.

## 3. Registro de Glicose (Input Page)
Entrada mais específica com categorização.

- **Componentes**:
  - `<TypePickerGrid />`: Chips para selecionar (Jejum, Pré-Refeição, Pós-Refeição, Aleatório).
  - `<NumericalInput />`: Entrada do valor em mg/dL.
  - `<NoteArea />`: Campo de observação curto (Opcional).
- **Comportamento**: Se o valor estiver fora da "Faixa Alvo" definida nas configurações, mostrar um alerta visual (Laranja/Vermelho).

## 4. Registro de Água (Input Page/Modal)
Entrada rápida e frequente.

- **Componentes**:
  - `<WaterPresets />`: Botões rápidos (200ml, 300ml, 500ml).
  - `<ManualInput />`: Para quantidades específicas.
  - `<HydrationProgress />`: Círculo de progresso atualizando ao adicionar ml.
- **Comportamento**: Somar ao total diário e mostrar confetes simples ao bater a meta.

## 5. Histórico & Detalhes (Common List)
Visão cronológica de todos os eventos.

- **Componentes**:
  - `<FilterTabs />`: Abas para (Tudo, Peso, Glicose, Água).
  - `<RecordItem />`: Card de histórico com ícone correspondente, valor, data e hora.
  - `<SwipeableAction />`: Deslizar para a esquerda para excluir ou editar um registro.
- **Comportamento**: Scroll infinito (Pagination) se o histórico for longo.

## 6. Configurações (Settings & Goals)
Onde o usuário define suas regras de negócio pessoais.

- **Componentes**:
  - `<GoalSection />`: Inputs para "Meta de Peso", "Faixa Alvo Glicose Min/Max", "Meta Água (ml)".
  - `<ThemeToggle />`: Alternar entre light/dark (V2).
  - `<ReminderSwitch />`: Ativar/Desativar notificações de lembrete diário.
- **Comportamento**: Salvar automaticamente ao alterar (debounce 500ms).
