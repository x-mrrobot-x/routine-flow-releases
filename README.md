# Routine Flow

![Status](https://img.shields.io/badge/Status-Ativo-brightgreen)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
[![Tasker](https://img.shields.io/badge/Tasker-Integration-blue)](https://tasker.joaoapps.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Routine Flow é gerenciador de rotinas, que permite criar rotinas automatizadas que executam ações específicas em horários e dias da semana programados - desde abrir aplicativos, alternar wifi, até executar comandos personalizados complexos. Ideal para otimizar produtividade e criar hábitos consistentes através da automação.

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
  - [Organização de arquivos](#organização-de-arquivos)
- [Integração com Tasker](#integração-com-tasker-1)
  - [Sistema de automação](#sistema-de-automação)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Contribuição](#contribuição)
  - [Processo de contribuição](#processo-de-contribuição)
  - [Diretrizes](#diretrizes)
  - [Reportar bugs](#reportar-bugs)
- [Licença](#licença)

## Funcionalidades

- **Gerenciamento de Rotinas**: Crie, edite e exclua rotinas personalizadas
- **Agendamento Inteligente**: Configure horários e dias da semana para execução
- **Sistema de Prioridades**: Defina e visualize prioridades (baixa, média, alta) com indicadores visuais
- **Comandos Personalizados**: Execute ações como abrir apps, bloquear tela, controlar conectividade
- **Filtros Avançados**: Filtre rotinas por texto, status, prioridade e dia da semana
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

O Routine Flow utiliza um conjunto de comandos padronizados. Sempre que uma rotina é acionada, o comando será executado no Tasker por meio da tarefa **RF 02 - COMMAND EXECUTOR**.

### Comandos Disponíveis

| Comando               | Descrição                      | Exemplo            |
| --------------------- | ------------------------------ | ------------------ |
| `/launch [app]`       | Abrir aplicativo específico    | `/launch Telegram` |
| `/kill [app]`         | Fechar aplicativo específico   | `/kill Youtube`    |
| `/lockscreen`         | Bloquear a tela do dispositivo | `/lockscreen`      |
| `/bluetooth [on/off]` | Ligar/desligar Bluetooth       | `/bluetooth on`    |
| `/airplane [on/off]`  | Controlar modo avião           | `/airplane off`    |
| `/wifi [on/off]`      | Ligar/desligar WiFi            | `/wifi on`         |
| `/mobile [on/off]`    | Controlar dados móveis         | `/mobile off`      |
| `/run_task [task]`    | Executar tarefa personalizada  | `/run_task MyTask` |

### Adicionar Comandos Personalizados no Tasker

Para adicionar novos comandos, edite a tarefa **RF 02 - COMMAND EXECUTOR** adicionando uma nova condicional:

```
Else If %routine_command ~ "/your_command"
  [Action]
End If
```

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
  "command": "/launch FitnessApp",
  "priority": "high",
  "time": 21600, // segundos desde 00:00 (6:00 AM)
  "frequency": [1, 3, 5], // Seg, Qua, Sex (0-6 = Dom-Sáb)
  "active": true
}
```

### Organização de Arquivos

```
routine-flow/
├── index.html
├── src/
│   ├── App.js
│   ├── assets/
│   │   ├── css/
│   │   └── icons/
│   ├── components/
│   │   ├── Modal.js
│   │   └── Toast.js
│   ├── features/
│   │   ├── routine/
│   │   └── settings/
│   ├── lang/
│   │   ├── en.json
│   │   ├── es.json
│   │   └── pt.json
│   ├── services/
│   │   └── EnvironmentManager.js
│   └── utils/
└── README.md
```

## Integração com Tasker

### Sistema de Automação

O Routine Flow foi desenvolvido especificamente para o Tasker, utilizando:

1. **Execução Automática**: O Tasker monitora os horários, dias da semana e executa rotinas programadas
2. **Sistema de Comandos**: Comandos são processados pela tarefa **RF 02 - COMMAND EXECUTOR**, através da variável `%routine_command` que recebe o comando da rotina
3. **Notificações Integradas**: Sistema de avisos conforme configurações do usuário

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Module Pattern IIFE para melhor compatibilidade entre os WebViews do Tasker)
- **Armazenamento**: localStorage para persistência de dados
- **Internacionalização**: Sistema próprio de i18n com arquivos JSON
- **Ícones**: Conjunto personalizado de ícones SVG
- **Tasker**: Integração completa (backend)

## Contribuição

Contribuições são bem-vindas! Para contribuir:

### Processo de Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/NovaFuncionalidade`)
5. **Abra** um Pull Request

### Diretrizes

- Mantenha o código limpo
- Siga o padrão de arquitetura já estabelecido

### Reportar Bugs

Use as [Issues do GitHub](https://github.com/x-mrrobot/routine-flow/issues) para reportar bugs ou solicitar funcionalidades.

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.