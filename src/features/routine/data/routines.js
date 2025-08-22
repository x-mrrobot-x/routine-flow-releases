const DEFAULT_ROUTINES = [
  {
    id: 1003,
    title: "Morning Exercise Time",
    description: "30 minutes of exercise to start the day with energy",
    command: "/open FitnessApp",
    priority: "high",
    time: 23400, // 6:30
    frequency: [1, 3, 5],
    active: true
  },
  {
    id: 1002,
    title: "Desligando Wi-Fi para Sair de Casa",
    description: "Desliga o Wi-Fi ao sair para economizar bateria",
    command: "/wifi off",
    priority: "medium",
    time: 27000, // 7:30
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1004,
    title: "Activando Internet Móvil para el Trayecto",
    description: "Activa datos móviles para conectividad externa",
    command: "/mobile on",
    priority: "medium",
    time: 27060, // 7:31
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1005,
    title: "Preparing Bluetooth for Car",
    description: "Turns on Bluetooth for automatic car connection",
    command: "/bluetooth on",
    priority: "medium",
    time: 27120, // 7:32
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1008,
    title: "Iniciando Playlist Motivacional",
    description: "Abre Spotify para playlists motivacionais",
    command: "/open Spotify",
    priority: "low",
    time: 27180, // 7:33
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1006,
    title: "Activando Modo Concentración Total",
    description: "Activa modo avión para máxima productividad",
    command: "/airplane on",
    priority: "high",
    time: 28800, // 8:00
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1009,
    title: "Lunch Break and Relaxation Time",
    description: "Opens YouTube to relax during lunch break",
    command: "/open YouTube",
    priority: "medium",
    time: 43200, // 12:00
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1014,
    title: "Conectando ao Wi-Fi de Casa",
    description: "Liga Wi-Fi ao chegar em casa",
    command: "/wifi on",
    priority: "medium",
    time: 64800, // 18:00
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1019,
    title: "Organizando la Semana",
    description: "Revisar metas y organizar agenda de la semana",
    command: "/open Calendar",
    priority: "high",
    time: 66600, // 18:30
    frequency: [0],
    active: true
  },
  {
    id: 1015,
    title: "Programming Study Session",
    description: "Time to develop technical skills",
    command: "/open ChatGPT",
    priority: "high",
    time: 68400, // 19:00
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1016,
    title: "Removendo Distrações dos Estudos",
    description: "Fecha Instagram para manter foco nos estudos",
    command: "/close Instagram",
    priority: "high",
    time: 68460, // 19:01
    frequency: [1, 2, 3, 4, 5],
    active: true
  },
  {
    id: 1017,
    title: "Hora de Dormir: Bloqueando Pantalla",
    description: "Bloquea pantalla para mejor calidad del sueño",
    command: "/lockscreen",
    priority: "high",
    time: 82800, // 23:00
    frequency: [0, 1, 2, 3, 4, 5, 6],
    active: true
  },
  {
    id: 1013,
    title: "Automatic System Cleanup",
    description: "Executes system cleaning and optimization",
    command: "/run_task PhoneCleanup",
    priority: "medium",
    time: 86340, // 23:59
    frequency: [6],
    active: true
  }
];
