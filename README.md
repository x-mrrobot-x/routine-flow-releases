# Routine Flow

Routine Flow é uma aplicação para gerenciamento de rotinas diárias. Permite agendar, atualizar, deletar rotinas, e acionar ações do Tasker usando um sistema de comandos.

## Recursos

- **Acionamento Flexível:** Acione rotinas com base no horário, ativação e dias da semana.  
- **Sistema de Prioridades:** Classifique rotinas em três níveis de prioridade (Baixa, Média, Alta) com indicadores visuais diferenciados para identificação rápida.  
- **Controle de Status:** Ative ou desative rotinas conforme necessário.  
- **Sistema de Comandos Personalizados:** Crie comandos individuais para realizar ações quando uma rotina for acionada.  
- **Notificações Personalizáveis:** Receba notificações via mensagens Toast, voz do Google ou vibração quando uma rotina for executada.  
- **Filtragem Avançada:** Localize rapidamente rotinas por nome, prioridade, status ou dia da semana.  
- **Ordenação Cronológica:** Ordene rotinas por horário de ativação (cronológica).  
- **Suporte Multi-idioma:** Utilize o sistema em Inglês, Espanhol ou Português.

## Condicionais de Acionamento

As rotinas são acionadas com base em:

- **Tempo (Horário):** A rotina executa no horário configurado
- **Ativa/Inativa:** Apenas rotinas ativas são consideradas para acionamento
- **Dias da Semana:** A rotina executa nos dias da semana selecionados

## Comandos Personalizados

Cada rotina pode ter um **comando** associado. Ao acionar uma rotina, o comando é enviado para a tarefa **RS 02 - ROUTINE COMMAND HANDLER** (no Tasker). O comando ficará disponível na variável `%routine_command`, permitindo construir lógicas com condicionais para automação como abrir apps, executar outras tarefas, etc.

**Exemplo** de lógica para uma rotina que tenha o comando `open_app_spotify` ou `open_app_gmail`:

```
Task: **RS 02 - ROUTINE COMMAND HANDLER**

A1: If %routine_command ~ "open_app_spotify"
    A2: Launch App [ App: Spotify ]

A3: Else If %routine_command ~ "open_app_gmail"
    A4: Launch App [ App: Gmail ]

A5: End If
```

## Como Clonar o Repositório

1. **Clone o Repositório:**
    ```bash
    https://github.com/x-mrrobot/routine-flow.git
    ```
2. **Navegue até o Projeto:**
    ```bash
    cd "routine-flow"
    ```

## Estrutura de Pastas/Arquivos

```
/routine-flow
│
└── index.html
│
├── css/
│   └── index.css
│
├── js/
│   ├── modules/
│   │   ├── App.js
│   │   ├── DOM.js
│   │   ├── EnvironmentManager.js
│   │   ├── EventManager.js
│   │   ├── Filter.js
│   │   ├── Form.js
│   │   ├── I18n.js
│   │   ├── Icons.js
│   │   ├── Modal.js
│   │   ├── Render.js
│   │   ├── RoutineActions.js
│   │   ├── RoutineService.js
│   │   ├── Settings.js
│   │   ├── Toast.js
│   │   └── Utils.js
│   └── routineData.js
│
└── languages/
    ├── en.json
    ├── es.json
    └── pt.json
```