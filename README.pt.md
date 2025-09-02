<table align="right">
  <tr>
    <td height="30px">
      <a href="README.md">English 🇺🇸</a>
    </td>
  </tr>
</table>

# Routine Flow

![Status](https://img.shields.io/badge/Status-Ativo-brightgreen)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
[![Tasker](https://img.shields.io/badge/Tasker-Integration-blue)](https://tasker.joaoapps.com/)

Routine Flow é um gerenciador de rotinas, que permite criar rotinas automatizadas que executam ações específicas em horários e dias da semana programados - desde abrir aplicativos, alternar wifi, até executar comandos personalizados complexos. Ideal para otimizar produtividade e criar hábitos consistentes através da automação.

<img align="center" width="100%%" alt="App preview" src="./.github/preview.jpg" />

## Índice

- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
  - [Clone do repositório](#1-clone-do-repositório)
  - [Execução da aplicação](#2-execução-da-aplicação)
  - [Integração com Tasker](#3-integração-com-tasker)
- [Comandos Personalizados](#comandos-personalizados)
  - [Comandos disponíveis](#comandos-disponíveis)
  - [Adicionar comandos no Tasker](#adicionar-comandos-personalizados-no-tasker)
- [Configuração](#configuração)
  - [Notificações](#notificações)
  - [Idiomas suportados](#idiomas-suportados)
- [Estrutura do Projeto](#estrutura-do-projeto)
  - [Estrutura de dados](#estrutura-de-dados)
  - [Estrutura de Pastas e Arquivos](#estrutura-de-pastas-e-arquivos)
- [Integração com Tasker](#integração-com-tasker-1)
  - [Sistema de automação](#sistema-de-automação)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

## Funcionalidades

- **Gerenciamento de Rotinas**: Crie, edite e exclua rotinas personalizadas
- **Agendamento Inteligente**: Configure horários e dias da semana para execução
- **Organização com Categorias**: Agrupe rotinas por categorias personalizadas, com cores e nomes customizáveis
- **Sistema de Prioridades**: Defina e visualize prioridades (baixa, média, alta) com indicadores visuais
- **Comandos Personalizados**: Execute ações como abrir apps, bloquear tela, controlar conectividade
- **Filtros Avançados**: Filtre rotinas por texto, status, prioridade, dia da semana e comando
- **Ordenação Cronológica**: Visualização organizada por horário de ativação
- **Próxima Rotina**: Exibição da próxima rotina agendada
- **Notificações Customizáveis**: Configure anúncios por voz, toast e vibração
- **Multi-idioma**: Suporte completo a Português, Inglês e Espanhol

## Instalação

### 1. Clone do repositório

```bash
git clone https://github.com/x-mrrobot/routine-flow.git
cd routine-flow
```

### 2. Execução da aplicação

**Opção A: Direto no navegador**

- Abra o arquivo `index.html` diretamente no navegador

**Opção B: Servidor local usando live-server**

```bash
# Instalar live-server globalmente
npm install -g live-server

# Executar na porta 5000
live-server --port=5000
```

### 3. Integração com Tasker

- Certifique-se de que o [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm) está instalado
- Importe este projeto da [TaskerNet](https://taskernet.com/shares/?user=AS35m8k%2FEQCE%2BJiPvkN1cJcjBE7Yh%2B%2Fa8zZeifxINYS7E94XnS26HrYYgsweBVnbf2VB9WJdrS5k&id=Project%3AROUTINE+FLOW)
- Para executar a maioria dos comandos disponíveis, é necessário ativar o [ADB WiFi](https://tasker.joaoapps.com/userguide/en/help/ah_adb_wifi.html)

## Comandos Personalizados

O Routine Flow suporta um conjunto de comandos padronizados. Quando uma rotina é acionada, o comando definido na rotina é executado no Tasker por meio da tarefa **RF 02 - COMMAND EXECUTOR**.

### Comandos Disponíveis

| Comando                 | Descrição                      | Exemplo            |
| ----------------------- | ------------------------------ | ------------------ |
| `/open [app]`           | Abrir aplicativo específico    | `/open Telegram`   |
| `/close [app]`          | Fechar aplicativo específico   | `/close Youtube`   |
| `/wifi [on/off]`        | Ligar/desligar WiFi            | `/wifi on`         |
| `/mobile_data [on/off]` | Controlar dados móveis         | `/mobile_data off` |
| `/bluetooth [on/off]`   | Ligar/desligar Bluetooth       | `/bluetooth on`    |
| `/airplane [on/off]`    | Controlar modo avião           | `/airplane off`    |
| `/lockscreen`           | Bloquear a tela do dispositivo | `/lockscreen`      |
| `/run_task [task]`      | Executar tarefa personalizada  | `/run_task MyTask` |

### Adicionar Comandos Personalizados no Tasker

Para adicionar novos comandos, edite a tarefa **RF 02 - COMMAND EXECUTOR** adicionando uma nova condicional:

```
Else If %routine_command ~ "/your_command"
  [Action]
End If
```

## Categorias

O Routine Flow permite organizar suas rotinas em categorias personalizadas. Cada categoria pode ter um nome e uma cor, facilitando a visualização e o gerenciamento.

- **Criar e Gerenciar**: No menu principal, clique no botão "+" ao lado das categorias para abrir o gerenciador. Você pode adicionar, editar e excluir categorias.
- **Filtrar por Categoria**: Clique em uma categoria para exibir apenas as rotinas associadas a ela.
- **Categoria Padrão**: Existe uma categoria "Geral" padrão que não pode ser removida.

## Configuração

### Notificações

Acesse o botão de configurações no canto superior direito para personalizar:

- **Anunciar com voz do Google**: Ativa anúncios por voz do título das rotinas
- **Exibir toast na tela**: Mostra notificações flutuantes com títulos das rotinas
- **Vibrar dispositivo**: Vibração ao executar rotinas

### Idiomas Suportados

- **pt.json**: Português (Brasil)
- **en.json**: English (Estados Unidos)
- **es.json**: Español

## Estrutura do Projeto

### Estrutura de Dados

As rotinas são armazenadas no formato JSON:

```json
{
  "id": 1234567890,
  "title": "Exercícios matinais",
  "description": "30 minutos de exercícios para começar o dia",
  "command": "/open FitnessApp",
  "priority": "high",
  "time": 21600, // segundos desde 00:00 (6:00 AM)
  "frequency": [1, 3, 5], // Seg, Qua, Sex (0-6 = Dom-Sáb)
  "active": true,
  "categoryId": "health"
}
```

### Estrutura de Pastas e Arquivos

A estrutura de arquivos do projeto é organizada da seguinte forma:

```
routine-flow/
├── index.html
├── README.md
└── src/
    ├── App.js
    ├── assets/
    │   ├── icons/
    │   └── styles/
    ├── components/
    │   ├── Modal.js
    │   └── Toast.js
    ├── features/
    │   ├── categories/
    │   │   ├── components/
    │   │   │   ├── CategoryForm.js
    │   │   │   ├── CategoryModal.js
    │   │   │   └── CategoryRenderer.js
    │   │   ├── data/
    │   │   │   └── categories.js
    │   │   └── services/
    │   │       └── CategoryService.js
    │   ├── routine/
    │   │   ├── components/
    │   │   │   ├── AppPickerModal.js
    │   │   │   ├── CommandDropdown.js
    │   │   │   ├── DeleteRoutineModal.js
    │   │   │   ├── RoutineForm.js
    │   │   │   ├── RoutineModal.js
    │   │   │   ├── RoutineRenderer.js
    │   │   │   └── TaskPickerModal.js
    │   │   ├── data/
    │   │   │   ├── apps.js
    │   │   │   ├── routines.js
    │   │   │   └── tasks.js
    │   │   └── services/
    │   │       ├── RoutineActions.js
    │   │       ├── RoutineFilter.js
    │   │       └── RoutineService.js
    │   └── settings/
    │       ├── SettingsModal.js
    │       └── SettingsService.js
    ├── locales/
    │   ├── en.json
    │   ├── es.json
    │   └── pt.json
    ├── services/
    │   ├── EnvironmentManager.js
    │   ├── EventBus.js
    │   ├── I18n.js
    │   ├── Icons.js
    │   ├── PaginationManager.js
    │   └── TimeService.js
    └── shared/
        ├── DOM.js
        └── Utils.js
```

## Integração com Tasker

### Sistema de Automação

O Routine Flow foi desenvolvido especificamente para rodar no Tasker, utilizando:

1. **Execução Automática**: O Tasker monitora os horários, dias da semana e executa rotinas programadas
2. **Sistema de Comandos**: Comandos são processados pela tarefa **RF 02 - COMMAND EXECUTOR**, através da variável `%routine_command` que recebe o comando da rotina
3. **Notificações Integradas**: Sistema de avisos conforme configurações do usuário

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Module Pattern IIFE para melhor compatibilidade entre os WebViews do Tasker)
- **Armazenamento**: localStorage para persistência de dados
- **Internacionalização**: Sistema próprio de i18n com arquivos JSON
- **EnvironmentManager**: Módulo para gerenciamento de ambientes (web ou Tasker) que abstrai funcionalidades específicas da plataforma, como armazenamento e carregamento de dados.
- **EventBus**: Sistema de publicação/assinatura de eventos para comunicação desacoplada entre diferentes módulos da aplicação.
- **Ícones**: Conjunto personalizado de ícones SVG
- **Tasker**: Integração completa (backend)